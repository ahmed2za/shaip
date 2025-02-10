const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export const fetchApi = {
  from: (resource: string) => ({
    select: async (fields: string = '*'): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_URL}/${resource}?select=${fields}`);
        const data = await response.json();
        return { data };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
      }
    },
    update: async (data: any): Promise<ApiResponse> => {
      try {
        const response = await fetch(`${API_URL}/${resource}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        return { data: result };
      } catch (error) {
        return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
      }
    },
    eq: (field: string, value: any) => ({
      select: async (fields: string = '*'): Promise<ApiResponse> => {
        try {
          const response = await fetch(`${API_URL}/${resource}?${field}=${value}&select=${fields}`);
          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An unknown error occurred' };
        }
      }
    })
  }),
  channel: (channel: string) => ({
    on: (
      eventName: string,
      config: {
        event: string;
        schema: string;
        table: string;
        filter: string;
      },
      callback: (payload: any) => void
    ) => {
      // Here you would implement your WebSocket connection
      // For now, we'll return a dummy subscription object
      return {
        subscribe: () => {
          console.log(`Subscribed to ${channel} ${config.event} on ${config.table}`);
          return () => console.log('Unsubscribed');
        }
      };
    }
  })
};
