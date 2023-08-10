export type CommonPagination = {
  page: number;
  size: number;
};

export type CommonPaginationInput = {
  page?: number;
  size?: number;
};

export type CommonContent<T = any> = {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
};
