import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { HydratedUserDocument, S3Service, UserRole } from "src/common";
import { BrandRepo } from "src/DataBase";
import { CreateCategoryDto } from "./dto";


@Injectable()
export class CategoryService { 
    constructor(private readonly BrandRepo: BrandRepo ,
                private readonly s3Service: S3Service) {}



async createCategory(
    brandDto: CreateCategoryDto, 
    user: HydratedUserDocument, 
    file: Express.Multer.File
) {
  const { Name, slogon } = brandDto;

  const brandExist = await this.BrandRepo.findOne({ filter: { Name } });
  if (brandExist) {
    throw new ConflictException("Brand Name already exist");
  }

  const url = await this.s3Service.uploadFile({
    path: "brands",
    file,
  });

  const brand = await this.BrandRepo.create({
    Name,
    slogon,
    Image: url,
    CreatedBy: user._id,
  });

  if (!brand) {
    throw new InternalServerErrorException("Failed to create brand");
  }

  return brand;
}



async updateCategory(
  id: string,
  updateDto: Partial<CreateCategoryDto>,         
  user: HydratedUserDocument,                         
  file?: Express.Multer.File                   
) {
  const brand = await this.BrandRepo.findById(id);
  if (!brand) throw new NotFoundException("Brand not found");

  const isOwner = brand.CreatedBy?.toString?.() === user._id?.toString?.();
  const isAdmin = user.Role === UserRole.Admin;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You are not allowed to update this brand");
  }

  if (updateDto.Name && updateDto.Name !== brand.Name) {
    const exists = await this.BrandRepo.findOne({ filter: { Name: updateDto.Name } });
    if (exists) throw new ConflictException("Brand name already exists");
  }

  let imageUrl = brand.Image;
  if (file) {
    const newUrl = await this.s3Service.uploadFile({ path: "brands", file });
    if (imageUrl) {
      try { await this.s3Service.DeleteFile({Key : imageUrl}); } catch {}
    }
    imageUrl = newUrl;
  }
  const payload: any = {};
  if (typeof updateDto.Name === "string")   payload.Name = updateDto.Name;
  if (typeof updateDto.slogon === "string") payload.slogon = updateDto.slogon;
  if (imageUrl !== brand.Image)             payload.Image = imageUrl;

  if (Object.keys(payload).length === 0) {
    return brand;
  }

  const updated = await this.BrandRepo.updateOne({ _id: id }, payload);
  if (!updated) throw new InternalServerErrorException("Failed to update brand");

  return updated;
}

async deleteCategory(id: string, user: HydratedUserDocument) {
  const brand = await this.BrandRepo.findById(id);
  if (!brand) {
    throw new NotFoundException("Brand not found");
  }

  if (brand.CreatedBy.toString() !== user._id.toString() && user.Role !== UserRole.Admin) {
    throw new ForbiddenException("You are not allowed to delete this brand");
  }

  if (brand.Image) {
    try {
      await this.s3Service.DeleteFile({Key : brand.Image});
    } catch (err) {
      console.warn("Image delete failed:", err.message);
    }
  }

  const deleted = await this.BrandRepo.deleteOne({ _id: id });
  if (!deleted) {
    throw new InternalServerErrorException("Failed to delete brand");
  }

  return { message: "Brand deleted successfully", id };
}



async getCategory(id: string) {
  const brand = await this.BrandRepo.findById(id);
  if (!brand) {
    throw new NotFoundException("Brand not found");
  }
  return brand;
}

async getAllCategories(query?: { limit?: number; page?: number; search?: string }) {
  // Pagination & optional search
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query?.search) {
    filter.name = { $regex: query.search, $options: "i" };
  }

  const [brands, total] = await Promise.all([
    this.BrandRepo.countDocuments({ filter }),
    this.BrandRepo.find({ filter, options: { skip, limit } })

  ]);

  return {
    total,
    page,
    pages: Math.ceil( Number(total) / Number(limit)),
    data: brands,
  };
}


    
}