const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createNewSession(id1) {
    try {
        const newSession = await prisma.session.create({
            data: {
                user1Id: id1,
            },
        });
        console.log('New session created');
        return newSession;
    } catch (error) {
        console.error('Error during the creation of the session:', error);
    }
}
async function findByUser(id) {
    const found = await prisma.session.findMany({
        where: {
            user1Id: id,
        },
    });
    console.log(found)
    if (found.length == 0) {
        const found2 = await prisma.session.findMany({
            where: {
                user2Id: id,
            },
        });
        return found2;
    }
    return found;
}

module.exports = {
    createNewSession,
    findByUser
};