import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PRIORITIES } from '../common/constants';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: PRIORITIES, default: 'Medium' })
  priority: string;

  @Prop({ default: '' })
  lead: string;

  @Prop({ type: [String], default: [] })
  members: string[];

  @Prop({ type: Date, default: null })
  dueDate?: Date | null;

  @Prop({ required: true, index: true })
  owner: string;

  @Prop({ default: 0 })
  order: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
