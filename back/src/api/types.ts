export interface ApiResponse<T> {
  data?: T,
  error?: {
    status: number,
    description: unknown
  }
}
