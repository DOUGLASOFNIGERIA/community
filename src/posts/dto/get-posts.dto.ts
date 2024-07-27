// get-posts.dto.ts
export class GetPostsDto {
  readonly sortBy?: 'time' | 'upvotes';
  readonly filterBy?: string;
}
