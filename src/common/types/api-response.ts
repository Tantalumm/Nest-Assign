export type ApiResponse<T> = {
  successful: boolean;
  error_code: string;
  data: T | null;
};

export const ok = <T>(data: T): ApiResponse<T> => ({
  successful: true,
  error_code: '',
  data,
});

export const fail = (error_code: string): ApiResponse<null> => ({
  successful: false,
  error_code,
  data: null,
});