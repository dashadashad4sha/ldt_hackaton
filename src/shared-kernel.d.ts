type Nullable<T> = T | null
type DateString = string

type PaginatedResponse<T> = {
	count: number,
	next: string,
	previous: string,
	results: T[],
}