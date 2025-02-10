import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export type ReportFormat = 'excel' | 'pdf' | 'csv';

export interface ReportOptions {
  format: ReportFormat;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  groupBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  columns?: string[];
}

export interface ReportMetadata {
  id: string;
  name: string;
  description: string;
  format: ReportFormat;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

class ReportService {
  private async generateExcelReport(
    data: any[],
    columns: string[],
    reportName: string
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(reportName);

    // Add headers
    worksheet.addRow(columns);

    // Add data
    data.forEach((item) => {
      const row = columns.map((col) => {
        const value = item[col];
        if (value instanceof Date) {
          return format(value, 'PPP', { locale: ar });
        }
        return value;
      });
      worksheet.addRow(row);
    });

    // Style the header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    return await workbook.xlsx.writeBuffer();
  }

  private async generatePDFReport(
    data: any[],
    columns: string[],
    reportName: string
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ size: 'A4', margin: 50 });

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add title
      doc
        .fontSize(20)
        .text(reportName, { align: 'center' })
        .moveDown();

      // Add date
      doc
        .fontSize(12)
        .text(
          format(new Date(), 'PPP', { locale: ar }),
          { align: 'right' }
        )
        .moveDown();

      // Create table
      const table = {
        headers: columns,
        rows: data.map((item) =>
          columns.map((col) => {
            const value = item[col];
            if (value instanceof Date) {
              return format(value, 'PPP', { locale: ar });
            }
            return String(value);
          })
        ),
      };

      // Draw table headers
      const cellPadding = 10;
      const columnWidth = (doc.page.width - 100) / columns.length;
      let yPos = doc.y;

      // Draw headers
      doc.font('Helvetica-Bold');
      table.headers.forEach((header, i) => {
        doc.text(
          header,
          50 + i * columnWidth,
          yPos,
          {
            width: columnWidth,
            align: 'left',
          }
        );
      });

      // Draw rows
      doc.font('Helvetica');
      yPos += 20;
      table.rows.forEach((row) => {
        const rowHeight = 20;
        if (yPos + rowHeight > doc.page.height - 50) {
          doc.addPage();
          yPos = 50;
        }

        row.forEach((cell, i) => {
          doc.text(
            cell,
            50 + i * columnWidth,
            yPos,
            {
              width: columnWidth,
              align: 'left',
            }
          );
        });

        yPos += rowHeight;
      });

      doc.end();
    });
  }

  private generateCSV(data: any[], columns: string[]): string {
    const header = columns.join(',');
    const rows = data.map((item) =>
      columns
        .map((col) => {
          const value = item[col];
          if (value instanceof Date) {
            return format(value, 'PPP', { locale: ar });
          }
          // Escape commas and quotes in values
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    return [header, ...rows].join('\n');
  }

  async generateReport(
    reportType: string,
    options: ReportOptions
  ): Promise<ReportMetadata> {
    try {
      // Create report metadata
      const reportMeta = await prisma.report.create({
        data: {
          name: `${reportType}_${format(new Date(), 'yyyy-MM-dd_HH-mm')}`,
          description: `${reportType} report`,
          format: options.format,
          status: 'processing',
        },
      });

      // Build query
      const query: any = {
        where: options.filters || {},
        orderBy: options.sortBy
          ? { [options.sortBy]: options.sortOrder || 'asc' }
          : undefined,
      };

      if (options.dateRange) {
        query.where.createdAt = {
          gte: options.dateRange.start,
          lte: options.dateRange.end,
        };
      }

      // Get data based on report type
      let data;
      switch (reportType) {
        case 'users':
          data = await prisma.user.findMany(query);
          break;
        case 'orders':
          data = await prisma.order.findMany(query);
          break;
        case 'products':
          data = await prisma.product.findMany(query);
          break;
        default:
          throw new Error(`Unknown report type: ${reportType}`);
      }

      // Generate report file
      let buffer: Buffer | string;
      const columns = options.columns || Object.keys(data[0] || {});

      switch (options.format) {
        case 'excel':
          buffer = await this.generateExcelReport(
            data,
            columns,
            reportMeta.name
          );
          break;
        case 'pdf':
          buffer = await this.generatePDFReport(
            data,
            columns,
            reportMeta.name
          );
          break;
        case 'csv':
          buffer = this.generateCSV(data, columns);
          break;
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      // Upload to storage and get URL
      const url = await this.uploadReport(
        buffer,
        `${reportMeta.name}.${options.format}`,
        options.format
      );

      // Update report metadata
      const updatedReport = await prisma.report.update({
        where: { id: reportMeta.id },
        data: {
          status: 'completed',
          url,
        },
      });

      return updatedReport;
    } catch (error) {
      logger.error('ReportService', 'Error generating report', error);
      throw error;
    }
  }

  private async uploadReport(
    buffer: Buffer | string,
    filename: string,
    format: ReportFormat
  ): Promise<string> {
    // Implement file upload to your storage service (S3, etc.)
    // For now, we'll just return a mock URL
    return `/api/reports/download/${filename}`;
  }

  async getReportsList(options?: {
    status?: string;
    format?: ReportFormat;
    page?: number;
    limit?: number;
  }): Promise<{
    reports: ReportMetadata[];
    pagination: { total: number; pages: number };
  }> {
    const { status, format, page = 1, limit = 10 } = options || {};

    const where: any = {};
    if (status) where.status = status;
    if (format) where.format = format;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      reports,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async deleteReport(id: string): Promise<void> {
    try {
      await prisma.report.delete({
        where: { id },
      });
    } catch (error) {
      logger.error('ReportService', 'Error deleting report', error);
      throw error;
    }
  }
}

export const reportService = new ReportService();
