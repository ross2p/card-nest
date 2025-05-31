import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

// const softDeleteExtension = Prisma.defineExtension({
//   name: 'softDelete',
//   model: {
//     $allModels: {
//       async delete(args) {
//         return this.update({
//           ...args,
//           data: {
//             deletedAt: new Date(),
//           },
//         });
//       },
//       async deleteMany(args) {
//         return this.updateMany({
//           ...args,
//           data: {
//             deletedAt: new Date(),
//           },
//         });
//       },
//     },
//   },
// });
//
// const findAndCountExtension = Prisma.defineExtension({
//   name: 'findAndCount',
//   model: {
//     $allModels: {
//       async findAndCount(args) {
//         const [data, count] = await Promise.all([
//           this.findMany(args),
//           this.count({ where: args.where }),
//         ]);
//         return { data, count };
//       },
//     },
//   },
// });

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Database connected.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected.');
  }
}
