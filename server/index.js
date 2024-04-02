const prisma = require("./lib/db");


async function main() {
  // ... you will write your Prisma Client queries here
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'aladauys@prisma.io'
    },
  })
  console.log(user);
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log("done");
    
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })