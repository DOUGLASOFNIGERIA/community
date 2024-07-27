import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.postsService.update(+id, updatePostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.postsService.delete(+id, req.user.userId);
  }

  @Get()
  findAll(@Query() getPostsDto: GetPostsDto) {
    const { sortBy, filterBy } = getPostsDto;
    return this.postsService.findAll(sortBy, filterBy);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  vote(
    @Param('id') id: string,
    @Body() createVoteDto: CreateVoteDto,
    @Request() req,
  ) {
    return this.postsService.vote(+id, createVoteDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    return this.postsService.addComment(+id, createCommentDto, req.user.userId);
  }

  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.postsService.getComments(+id);
  }
}
