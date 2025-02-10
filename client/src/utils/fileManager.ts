import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from './logger';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;

export interface UploadedFile {
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
}

export class FileManager {
  static async uploadFile(
    file: File,
    directory: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadedFile> {
    try {
      const key = `${directory}/${Date.now()}-${file.name}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      });

      await s3Client.send(command);

      // Generate signed URL for immediate access
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

      return {
        key,
        url,
        filename: file.name,
        contentType: file.type,
        size: file.size,
      };
    } catch (error) {
      logger.error('FileManager', 'Error uploading file', error);
      throw new Error('Failed to upload file');
    }
  }

  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      logger.error('FileManager', 'Error deleting file', error);
      throw new Error('Failed to delete file');
    }
  }

  static async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      logger.error('FileManager', 'Error generating signed URL', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  static async uploadMultipleFiles(
    files: File[],
    directory: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];
    let totalProgress = 0;

    for (const [index, file] of files.entries()) {
      const result = await this.uploadFile(file, directory);
      results.push(result);

      if (onProgress) {
        totalProgress = ((index + 1) / files.length) * 100;
        onProgress(totalProgress);
      }
    }

    return results;
  }

  static isValidFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        const mainType = type.split('/')[0];
        return file.type.startsWith(`${mainType}/`);
      }
      return file.type === type;
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
