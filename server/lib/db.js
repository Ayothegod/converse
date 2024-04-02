const { PrismaClient } = require('@prisma/client');

const prismaClientSingleton = () => {
  return new PrismaClient();
};

global.prismaGlobal = global.prismaGlobal || prismaClientSingleton();

const prisma = global.prismaGlobal;

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = prisma;

module.exports = prisma;