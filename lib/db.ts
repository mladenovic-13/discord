import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// get the prisma client instance from globalThis
export const db = globalThis.prisma || new PrismaClient();

// if there is no existing prisma client instance, create one
// this is used in development to prevent hot-reloading issues
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
