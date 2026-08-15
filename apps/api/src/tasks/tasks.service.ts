import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface Actor {
  name: string;
  avatar?: string;
}

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  // Get a user's tasks, optionally filtered by project.
  findAllForUser(owner: string, projectId?: string) {
    const filter: Record<string, unknown> = { owner };
    if (projectId) filter.projectId = projectId;
    return this.taskModel.find(filter).sort({ order: 1, createdAt: 1 });
  }

  findOne(owner: string, id: string) {
    return this.findOwned(owner, id);
  }

  // Create a task at the end of its column.
  async create(owner: string, dto: CreateTaskDto, actor: Actor) {
    const status = dto.status || 'To Do';
    const last = await this.taskModel.findOne({ owner, status }).sort({ order: -1 });
    const order = last ? last.order + 1000 : 1000;
    return this.taskModel.create({
      ...dto,
      owner,
      status,
      reporter: dto.reporter || actor.name,
      order,
    });
  }

  async update(owner: string, id: string, dto: UpdateTaskDto, actor: Actor) {
    const task = await this.findOwned(owner, id);

    // Log status and priority changes.
    if (dto.priority && dto.priority !== task.priority) {
      this.logUpdate(task, actor, `changed priority from ${task.priority} to ${dto.priority}`);
    }
    if (dto.status && dto.status !== task.status) {
      this.logUpdate(task, actor, `moved from ${task.status} to ${dto.status}`);
    }

    Object.assign(task, dto);
    return task.save();
  }

  async remove(owner: string, id: string) {
    const task = await this.findOwned(owner, id);
    await task.deleteOne();
    return { message: 'Task deleted successfully.' };
  }

  async addComment(owner: string, id: string, text: string, actor: Actor) {
    const task = await this.findOwned(owner, id);
    task.comments.push({
      authorName: actor.name,
      authorAvatar: actor.avatar || '',
      text,
      createdAt: new Date(),
      replies: [],
    } as never);
    this.logUpdate(task, actor, 'posted an update');
    return task.save();
  }

  async addReply(owner: string, id: string, commentId: string, text: string, actor: Actor) {
    const task = await this.findOwned(owner, id);
    const comment = (task.comments as never as { id(c: string): any }).id(commentId);
    if (!comment) throw new NotFoundException('Comment not found.');
    comment.replies.push({
      authorName: actor.name,
      authorAvatar: actor.avatar || '',
      text,
      createdAt: new Date(),
    });
    return task.save();
  }

  async removeComment(owner: string, id: string, commentId: string) {
    const task = await this.findOwned(owner, id);
    const comment = (task.comments as never as { id(c: string): any }).id(commentId);
    if (!comment) throw new NotFoundException('Comment not found.');
    comment.deleteOne();
    return task.save();
  }

  private logUpdate(task: TaskDocument, actor: Actor, text: string) {
    task.updates.push({
      actorName: actor.name,
      actorAvatar: actor.avatar || '',
      text,
      createdAt: new Date(),
    } as never);
  }

  private async findOwned(owner: string, id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Task not found.');
    const task = await this.taskModel.findOne({ _id: id, owner });
    if (!task) throw new NotFoundException('Task not found.');
    return task;
  }
}
