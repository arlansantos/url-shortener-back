export interface IPaginateResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}
