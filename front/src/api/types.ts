export type ApiResponse<T> = {
  data: T,
  error: false,
  status: number
} | {
  data: null,
  error: true,
  status: number
}