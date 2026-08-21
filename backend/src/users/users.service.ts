import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        createdAt: true,
        jobPreferences: true,
        resumes: {
          select: {
            id: true,
            fileName: true,
            status: true,
            skills: true,
            technologies: true,
            createdAt: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async setJobPreferences(userId: string, roles: string[]) {
    await this.prisma.jobPreference.deleteMany({ where: { userId } });
    await this.prisma.jobPreference.createMany({
      data: roles.map((roleName) => ({ userId, roleName })),
    });
    return this.prisma.jobPreference.findMany({ where: { userId } });
  }
}
