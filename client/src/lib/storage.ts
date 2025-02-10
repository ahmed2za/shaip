import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const storage = {
  async uploadFile(
    bucket: string,
    path: string,
    file: File
  ): Promise<{ path: string; error: Error | null }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('path', path);

      const response = await axios.post(`${API_URL}/storage/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { path: response.data.path, error: null };
    } catch (error) {
      return { path: '', error: error as Error };
    }
  },

  getPublicUrl(path: string) {
    return {
      data: {
        publicUrl: `${API_URL}/storage/public/${path}`
      }
    };
  }
};
