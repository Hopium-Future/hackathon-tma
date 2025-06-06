export type Response<T> = {
    data: T[];
    // total: number;
    hasMore: boolean;
}