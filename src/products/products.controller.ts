import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import {
  ApiExtraModels,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiPageResponse } from 'src/page/api-page-response.decorator';
import { ConnectionArgs } from 'src/page/connection-args.dto';
import { Page } from 'src/page/page.dto';

@Controller('products')
@ApiTags('products')
@ApiExtraModels(Page) // 👈 required to generate types for Page
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiCreatedResponse({ type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto) {
    return new ProductEntity(
      await this.productsService.create(createProductDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: [ProductEntity] })
  async findAll() {
    const products = await this.productsService.findAll();
    return products.map((product) => new ProductEntity(product));
  }

  @Get('page')
  @ApiPageResponse(ProductEntity)
  async findPage(@Query() connectionArgs: ConnectionArgs) {
    return this.productsService.findPage(connectionArgs);
  }

  @Get('drafts')
  @ApiCreatedResponse({ type: [ProductEntity] })
  async findDrafts() {
    const drafts = await this.productsService.findDrafts();
    return drafts.map((product) => new ProductEntity(product));
  }

  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.findOne(id));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: ProductEntity })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return new ProductEntity(
      await this.productsService.update(id, updateProductDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param('id') id: string) {
    return new ProductEntity(await this.productsService.remove(id));
  }
}
