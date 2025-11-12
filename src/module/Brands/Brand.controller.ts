import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { BrandService } from "./Brand.service";
import { FileValidation,  type HydratedUserDocument } from "src/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerCloud } from "src/common/utils/cloud/multer";
import { UserDecorator } from "src/common/decorator/UserDecorator";
import { CreateBrandDto } from "./dto";


@Controller("brands")
export class BrandController { 
    constructor(private readonly BrandService: BrandService) {}



@UseInterceptors(FileInterceptor("attachment"))
@Post()
async createBrand(
  @Body() brandDto: CreateBrandDto,
  @UserDecorator() user: HydratedUserDocument,
  @UploadedFile(ParseFilePipe) file: Express.Multer.File,
) {
  const brand = await this.BrandService.createBrand(brandDto, user, file);
  return { message: "done", brand };
}


@Delete(":id")
async deleteBrand(@Param("id") id: string, @UserDecorator() user: HydratedUserDocument ) {
  const result = await this.BrandService.deleteBrand(id, user);
  return result;
}

    @Get()
    async getAllBrands(@Query() query: { limit?: number; page?: number; search?: string }) {
        const result = await this.BrandService.getAllBrands(query);
        return result;
    }

    @Get(":id")
    async getBrand(@Param("id") id: string) {
        const result = await this.BrandService.getBrand(id);
        return result;
    }
     

    @Patch(":id")
    async updateBrand(
        @Param("id") id: string,
        @Body() updateDto: Partial<CreateBrandDto>,
        @UserDecorator() user: HydratedUserDocument,
        @UploadedFile(ParseFilePipe) file?: Express.Multer.File
    ) {
        const result = await this.BrandService.updateBrand(id, updateDto, user, file);
        return result;
    }
}
