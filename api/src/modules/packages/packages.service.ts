import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { packages } from "@models/packages";
import { DatabaseService } from "@modules/database/database.service";
import { CreatePackageDto, UpdatePackageDto } from "@modules/packages/packages.dto";

@Injectable()
export class PackagesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(dto: CreatePackageDto) {
    const [existing] = await this.databaseService.db.select().from(packages).where(eq(packages.slug, dto.slug));

    if (existing) {
      throw new ConflictException(`Package with slug "${dto.slug}" already exists`);
    }

    const [newPackage] = await this.databaseService.db
      .insert(packages)
      .values({
        slug: dto.slug,
        title: dto.title,
        description: dto.description,
        features: dto.features ?? [],
        priceCents: dto.priceCents ?? null,
        isActive: dto.isActive ?? true
      })
      .returning();

    return { package: newPackage };
  }

  async findAll() {
    const rows = await this.databaseService.db.select().from(packages);
    return { packages: rows };
  }

  async findOne(id: string) {
    const [pkg] = await this.databaseService.db.select().from(packages).where(eq(packages.id, id));

    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return { package: pkg };
  }

  async update(id: string, dto: UpdatePackageDto) {
    const [existing] = await this.databaseService.db.select().from(packages).where(eq(packages.id, id));

    if (!existing) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const [duplicate] = await this.databaseService.db.select().from(packages).where(eq(packages.slug, dto.slug));

      if (duplicate) {
        throw new ConflictException(`Package with slug "${dto.slug}" already exists`);
      }
    }

    const [updatedPackage] = await this.databaseService.db
      .update(packages)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(packages.id, id))
      .returning();

    return { package: updatedPackage };
  }

  async remove(id: string) {
    const [deletedPackage] = await this.databaseService.db.delete(packages).where(eq(packages.id, id)).returning();

    if (!deletedPackage) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }

    return { message: "Package deleted successfully" };
  }
}
