// src/graphql/resolvers/index.ts

import { prisma } from '@/lib/prisma';

export const resolvers = {
  Query: {
    searchProduk: async (_: unknown, args: { keyword: string }) => {
      return prisma.produk.findMany({
        where: {
          nama: {
            contains: args.keyword.toLowerCase(), // ✅ lowercased keyword
          },
        },
      });
    },

    searchPelatihan: async (_: unknown, args: { keyword: string }) => {
      return prisma.pelatihan.findMany({
        where: {
          judul: {
            contains: args.keyword.toLowerCase(), // ✅ lowercased keyword
          },
        },
      });
    },
  },
};
