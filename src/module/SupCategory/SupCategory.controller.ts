import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { SupCategoryService } from "./SupCategory.service";
import {   type HydratedUserDocument } from "src/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserDecorator } from "src/common/decorator/UserDecorator";
import { CreateBrandDto } from "./dto";


@Controller("supCategory")
export class SupCategoryController { 
    constructor(private readonly SupCategoryService: SupCategoryService) {}



@UseInterceptors(FileInterceptor("attachment"))
@Post()
async createSupCategory(
    @Body() supCategoryDto: CreateBrandDto,
    @UserDecorator() user: HydratedUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
) {
  const supCategory = await this.SupCategoryService.createSupCategory(supCategoryDto, user, file);
  return { message: "done", supCategory };
}


@Delete(":id")
async deleteSupCategory(@Param("id") id: string, @UserDecorator() user: HydratedUserDocument ) {
  const result = await this.SupCategoryService.deleteSupCategory(id, user);
  return result;
}

    @Get()
    async getAllSupCategories(@Query() query: { limit?: number; page?: number; search?: string }) {
        const result = await this.SupCategoryService.getAllSupCategories(query);
        return result;
    }

    @Get(":id")
    async getSupCategory(@Param("id") id: string) {
        const result = await this.SupCategoryService.getSupCategory(id);
        return result;
    }
    

    @Patch(":id")
    async updateSupCategory(
        @Param("id") id: string,
        @Body() updateDto: Partial<CreateBrandDto>,
        @UserDecorator() user: HydratedUserDocument,
        @UploadedFile(ParseFilePipe) file?: Express.Multer.File
    ) {
        const result = await this.SupCategoryService.updateSupCategory(id, updateDto, user, file);
        return result;
    }
}
