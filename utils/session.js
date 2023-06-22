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

module.exports = {
    createNewSession
};