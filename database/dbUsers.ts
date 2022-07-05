import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces';

const prisma = new PrismaClient()

export const checkUserEmailPassword = async( email: string, password: string ) => {

    await prisma.$connect()
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            Role: {
                select: {
                    roleName: true
                }
            }
        }
    });
    await prisma.$disconnect()

    if ( !user ) {
        return null;
    }

    if ( !bcrypt.compareSync( password, user.password! ) ) {
        return null;
    }

    const { Role , name, idUser } = user;

    return {
        id: idUser,
        email: email.toLocaleLowerCase(),
        role: Role,
        name,
    }
}


// Esta función crea o verifica el usuario de OAuth
export const oAuthToDbUser = async( oAuthEmail: string, oAuthName: string ) => {

    await prisma.$connect()

    const user = await prisma.user.findUnique({
        where: {
            email: oAuthEmail
        },
        include: {
            Role: {
                select: {
                    roleName: true
                }
            }
        }
    })

    if ( user ) {
        await prisma.$disconnect()
        const { idUser, name, email, Role } = user;
        return { idUser, name, email, role: Role };
    }

    const newUser = await prisma.user.create({
        data: {
            email: oAuthEmail,
            name: oAuthName,
            password: '@',
            role: 0
        },
        include: {
            Role: {
                select: {
                    roleName: true
                }
            }
        }
    })
    
    await prisma.$disconnect()

    const { idUser, name, email, Role } = newUser;
    return { idUser, name, email, role: Role };

}