import { useState } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = async (url: string, options?: RequestInit) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  const postData = async (url: string, body: any) => {
    return fetchData(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  };

  const putData = async (url: string, body: any) => {
    return fetchData(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  };

  const deleteData = async (url: string) => {
    return fetchData(url, {
      method: 'DELETE',
    });
  };

  const uploadImage = async (file: File, folder?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setState({ data: data as T, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return {
    ...state,
    fetchData,
    postData,
    putData,
    deleteData,
    uploadImage,
  };
} 