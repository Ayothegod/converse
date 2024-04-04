import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// global.prismaGlobal = global.prismaGlobal || prismaClientSingleton();
// const prisma = global.prismaGlobal;

// if (process.env.NODE_ENV !== "production") global.prismaGlobal = prisma;
const prisma = new PrismaClient()

export const adapter = new PrismaAdapter(prisma.session, prisma.user)

export default prisma;


