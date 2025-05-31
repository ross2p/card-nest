import { PageRequest } from './page-request.utils';

export class PageResponse<T> {
  readonly search?: string;
  readonly pageNumber?: number;
  readonly pageSize?: number;
  readonly pageCount?: number;
  readonly sortBy?: Record<string, 'desc' | 'asc'>;
  readonly content: T[];

  constructor(pageRequest: PageRequest, content: T[], count: number) {
    this.search = pageRequest.search;
    this.pageNumber = pageRequest.pageNumber;
    this.pageSize = content.length < pageRequest.pageSize ? content.length : pageRequest.pageSize;
    this.pageCount = Math.ceil(count / (this.pageSize === 0 ? pageRequest.pageSize : this.pageSize));
    this.sortBy = pageRequest.sortBy;
    this.content = content;
  }
}
