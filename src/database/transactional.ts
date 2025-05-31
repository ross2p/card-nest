import { Prisma } from '@prisma/client';
import { DatabaseClient } from './database-client.service';
import { BaseRepository } from './repository.service';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const prisma: DatabaseClient = this.prisma || this.prismaService;

      return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const repositories = Object.values(this).filter(
          (dep) => dep instanceof BaseRepository
        ) as BaseRepository[];

        for (const repo of repositories) {
          repo.setTransaction(tx);
        }

        const result = await originalMethod.apply(this, args);

        for (const repo of repositories) {
          repo.clearTransaction();
        }

        return result;
      });
    };

    return descriptor;
  };
}
