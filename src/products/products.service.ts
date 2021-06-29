import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from './../prisma/prisma.service';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { Prisma } from '@prisma/client';
import { ConnectionArgs } from 'src/page/connection-args.dto';
import { Page } from 'src/page/page.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  findAll() {
    return this.prisma.product.findMany({ where: { published: true } });
  }

  async findPage(connectionArgs: ConnectionArgs) {
    const where: Prisma.ProductWhereInput = {
      published: true,
    };
    const productPage = await findManyCursorConnection(
      (args) =>
        this.prisma.product.findMany({
          ...args,
          where: where,
        }),
      () =>
        this.prisma.product.count({
          where: where,
        }),
      connectionArgs, // 👈 use connection arguments
      {
        recordToEdge: (record) => ({
          node: new ProductEntity(record), // 👈 instance to transform price
        }),
      },
    );

    return new Page<ProductEntity>(productPage); // 👈 instance as this object is returned
  }

  findDrafts() {
    return this.prisma.product.findMany({ where: { published: false } });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id: id } });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id: id },
      data: updateProductDto,
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id: id } });
  }
}
