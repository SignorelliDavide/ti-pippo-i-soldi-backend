const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createNewUser(nameInput, emailInput, passwordInput) {
    try {
        const hashedPassword = await bcrypt.hash(passwordInput, 10);
        const newUser = await prisma.user.create({
            data: {
                name: nameInput,
                email: emailInput,
                password: hashedPassword,
            },
        });

        console.log('New user created:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error during the creation of the user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function findByEmail(emailInput) {
    const found = await prisma.user.findUnique({
        where: {
            email: emailInput,
        },
    });
    return found;
}

async function findById(id) {
  const found = await prisma.user.findUnique({
      where: {
          id,
      },
  });
  return found;
}

module.exports = {
    createNewUser,
    findByEmail,
    findById
};
