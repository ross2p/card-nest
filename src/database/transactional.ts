import { DatabaseService } from './database.service';
import { Prisma } from '@prisma/client';

export async function executeTransaction<T>(
  prisma: DatabaseService,
  transactionCallback: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return transactionCallback(tx);
  });
}
