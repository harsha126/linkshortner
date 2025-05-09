export type ServerResponse<T> = {
    isError: boolean,
    response: T,
    error: string[]
}