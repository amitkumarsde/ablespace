import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>,
  ) {}

  findAllForUser(owner: string) {
    return this.projectModel.find({ owner }).sort({ order: 1, createdAt: 1 });
  }

  async findOne(owner: string, id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('Project not found.');
    const project = await this.projectModel.findOne({ _id: id, owner });
    if (!project) throw new NotFoundException('Project not found.');
    return project;
  }

  async create(owner: string, dto: CreateProjectDto) {
    const last = await this.projectModel.findOne({ owner }).sort({ order: -1 });
    const order = last ? last.order + 1000 : 1000;
    return this.projectModel.create({ ...dto, owner, order });
  }

  async update(owner: string, id: string, dto: UpdateProjectDto) {
    const project = await this.findOne(owner, id);
    Object.assign(project, dto);
    return project.save();
  }

  async remove(owner: string, id: string) {
    const project = await this.findOne(owner, id);
    await project.deleteOne();
    return { message: 'Project deleted successfully.' };
  }
}
