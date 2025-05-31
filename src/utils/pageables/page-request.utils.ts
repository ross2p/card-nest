import { ApiProperty } from '@nestjs/swagger';
import { PageResponse } from './page-response.utils';

export class PageRequest {
  @ApiProperty({ description: 'The page number to retrieve', example: 1, required: false })
  pageNumber?: number = 1;

  @ApiProperty({ description: 'The number of items per page', example: 200, required: false })
  pageSize?: number = 200;

  @ApiProperty({
    description: 'Sorting criteria in the format { field: "asc" | "desc" }',
    example: { id: 'desc' },
    required: false,
  })
  sortBy?: Record<string, 'desc' | 'asc'> = { id: 'desc' };

  skip?: number = this.pageNumber * this.pageSize - this.pageSize;

  @ApiProperty({ description: 'Search query string', example: '', required: false })
  search?: string = "";


  toPageResponse<T>(content: T[], count: number): PageResponse<T> {
    return new PageResponse<T>(this, content, count);
  }

  getFilter(...searchFields: string[]) {
    return {
      // ...(searchFields && {
      //   where: searchFields.map(searchField => ({
      //     [searchField]: {
      //       contains: this.search,
      //       mode: 'insensitive'
      //     }
      //   }))
      // }),
      skip: this.skip,
      take: this.pageSize,
      orderBy: this.sortBy,
    };
  }
}