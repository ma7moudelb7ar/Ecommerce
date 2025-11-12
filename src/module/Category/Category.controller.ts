import {  Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CategoryService } from "./Category.service";
import {type  HydratedUserDocument } from "src/common";
import { CreateCategoryDto } from "./dto";
import { UserDecorator } from "src/common/decorator/UserDecorator";
import { FileInterceptor } from "@nestjs/platform-express";



@Controller("Category")
export class CategoryController { 
    constructor(private readonly CategoryService: CategoryService) {}



@UseInterceptors(FileInterceptor("attachment"))
@Post()
async createCategory(
    @Body() categoryDto: CreateCategoryDto,
    @UserDecorator() user: HydratedUserDocument,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
) {
    const category = await this.CategoryService.createCategory(categoryDto, user, file);
    return { message: "done", category };
}


@Delete(":id")
async deleteCategory(@Param("id") id: string, @UserDecorator() user: HydratedUserDocument ) {
    const result = await this.CategoryService.deleteCategory(id, user);
    return result;
}

    @Get()
    async getAllCategories(@Query() query: { limit?: number; page?: number; search?: string }) {
        const result = await this.CategoryService.getAllCategories(query);
        return result;
    }

    @Get(":id")
    async getCategory(@Param("id") id: string) {
        const result = await this.CategoryService.getCategory(id);
        return result;
    }
    

    @Patch(":id")
    async updateCategory(
        @Param("id") id: string,
        @Body() updateDto: Partial<CreateCategoryDto>,
        @UserDecorator() user: HydratedUserDocument,
        @UploadedFile(ParseFilePipe) file?: Express.Multer.File
    ) {
        const result = await this.CategoryService.updateCategory(id, updateDto, user, file);
        return result;
    }
}
