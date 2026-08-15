import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PRIORITIES, TASK_STATUSES } from '../common/constants';

export type TaskDocument = HydratedDocument<Task>;

// A document or link attached to a task.
@Schema({ _id: false })
class Resource {
  @Prop({ required: true }) label: string;
  @Prop({ default: '' }) url: string;
}
const ResourceSchema = SchemaFactory.createForClass(Resource);

// A reply under a comment.
@Schema()
class Reply {
  @Prop({ required: true }) authorName: string;
  @Prop({ default: '' }) authorAvatar: string;
  @Prop({ required: true }) text: string;
  @Prop({ default: Date.now }) createdAt: Date;
}
const ReplySchema = SchemaFactory.createForClass(Reply);

// A comment with optional replies.
@Schema()
class Comment {
  @Prop({ required: true }) authorName: string;
  @Prop({ default: '' }) authorAvatar: string;
  @Prop({ required: true }) text: string;
  @Prop({ default: Date.now }) createdAt: Date;
  @Prop({ type: [ReplySchema], default: [] }) replies: Reply[];
}
const CommentSchema = SchemaFactory.createForClass(Comment);

// A subtask shown on the detail page.
@Schema()
class Subtask {
  @Prop({ required: true }) title: string;
  @Prop({ enum: PRIORITIES, default: 'Medium' }) priority: string;
  @Prop({ type: [String], default: [] }) members: string[];
  @Prop({ type: Date, default: null }) dueDate?: Date | null;
}
const SubtaskSchema = SchemaFactory.createForClass(Subtask);

// An activity log entry.
@Schema()
class Update {
  @Prop({ required: true }) actorName: string;
  @Prop({ default: '' }) actorAvatar: string;
  @Prop({ required: true }) text: string;
  @Prop({ default: Date.now }) createdAt: Date;
}
const UpdateSchema = SchemaFactory.createForClass(Update);

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  // Project this task belongs to (optional).
  @Prop({ type: String, default: null, index: true })
  projectId?: string | null;

  @Prop({ required: true, enum: TASK_STATUSES, default: 'To Do' })
  status: string;

  @Prop({ required: true, enum: PRIORITIES, default: 'Medium' })
  priority: string;

  @Prop({ type: [String], default: [] })
  members: string[];

  @Prop({ type: [String], default: [] })
  teams: string[];

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: Date, default: null })
  startDate?: Date | null;

  @Prop({ type: Date, default: null })
  dueDate?: Date | null;

  @Prop({ default: '' })
  reporter: string;

  @Prop({ type: [ResourceSchema], default: [] })
  resources: Resource[];

  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks: Subtask[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: [UpdateSchema], default: [] })
  updates: Update[];

  // Owner user id; tasks are private.
  @Prop({ required: true, index: true })
  owner: string;

  // Sort position within a column.
  @Prop({ default: 0 })
  order: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
