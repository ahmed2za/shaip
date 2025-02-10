import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import formidable from 'formidable';
import { FileManager } from '@/utils/fileManager';
import { logger } from '@/utils/logger';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFiles: 5,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await form.parse(req);
    const uploadedFiles = files.files || [];
    const directory = fields.directory?.[0] || 'uploads';

    const results = await Promise.all(
      uploadedFiles.map(async (file) => {
        const buffer = await fs.promises.readFile(file.filepath);
        const fileObj = new File([buffer], file.originalFilename || 'unnamed', {
          type: file.mimetype || 'application/octet-stream',
        });

        return await FileManager.uploadFile(fileObj, directory);
      })
    );

    // Clean up temp files
    await Promise.all(
      uploadedFiles.map((file) =>
        fs.promises.unlink(file.filepath).catch(() => {})
      )
    );

    return res.status(200).json({ files: results });
  } catch (error) {
    logger.error('API Upload', 'Error handling file upload', error);
    return res.status(500).json({ error: 'Failed to upload files' });
  }
}
