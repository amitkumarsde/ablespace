import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

interface JwtUser {
  sub: string;
  name: string;
  avatarUrl?: string;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser, @Query('projectId') projectId?: string) {
    return this.tasksService.findAllForUser(user.sub, projectId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.tasksService.findOne(user.sub, id);
  }

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.sub, dto, this.actor(user));
  }

  @Patch(':id')
  update(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(user.sub, id, dto, this.actor(user));
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.tasksService.remove(user.sub, id);
  }

  @Post(':id/comments')
  addComment(@CurrentUser() user: JwtUser, @Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.tasksService.addComment(user.sub, id, dto.text, this.actor(user));
  }

  @Post(':id/comments/:commentId/replies')
  addReply(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.addReply(user.sub, id, commentId, dto.text, this.actor(user));
  }

  @Delete(':id/comments/:commentId')
  removeComment(
    @CurrentUser() user: JwtUser,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.tasksService.removeComment(user.sub, id, commentId);
  }

  private actor(user: JwtUser) {
    return { name: user.name, avatar: user.avatarUrl };
  }
}
