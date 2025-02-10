import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const db = {
  from(table: string) {
    return {
      select: async (columns = '*') => {
        try {
          const response = await axios.get(`${API_URL}/${table}?select=${columns}`);
          return { data: response.data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      
      insert: async (data: any) => {
        try {
          const response = await axios.post(`${API_URL}/${table}`, data);
          return { data: response.data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      update: async (query: any, data: any) => {
        try {
          const response = await axios.patch(`${API_URL}/${table}`, { query, data });
          return { data: response.data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      delete: async (query: any) => {
        try {
          const response = await axios.delete(`${API_URL}/${table}`, { data: query });
          return { data: response.data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      eq: (column: string, value: any) => ({
        getMany: async () => {
          try {
            const response = await axios.get(`${API_URL}/${table}?${column}=${value}`);
            return { data: response.data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        },
        single: async () => {
          try {
            const response = await axios.get(`${API_URL}/${table}?${column}=${value}&limit=1`);
            return { data: response.data[0], error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),

      order: (column: string, { ascending = true } = {}) => ({
        range: async (from: number, to: number) => {
          try {
            const response = await axios.get(
              `${API_URL}/${table}?order=${column}&ascending=${ascending}&from=${from}&to=${to}`
            );
            return { data: response.data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    };
  }
};
