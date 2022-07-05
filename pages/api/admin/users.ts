import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from '../../../interfaces';
import { IUserRole } from '../../../interfaces/user';

type Data = 
| { message: string }
| IUser[]


const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getUsers(req, res);

        case 'PUT':
            return updateUser(req, res);

        default:
            return res.status(400).json({ message: 'Bad request' })

    }


}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) =>  {

    await prisma.$connect()
    const users = await prisma.user.findMany({
        select: {
            email: true,
            createdAt: true,
            idUser: true,
            name: true,
            role: true,
            updatedAt: true,
        }
    })
    await prisma.$disconnect()

    return res.status(200).json( users as any );


}



const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) =>  {
    
    const { userId = -1, role = -1 } = req.body;
    
    const validRoles = [0,1,2,3];
    if ( !validRoles.includes(role) ) {
        return res.status(400).json({ message: 'Rol no permitido: ' + validRoles.join(', ') })
    }

    await prisma.$connect()
    const user = await prisma.user.findUnique({
        where: {
            idUser: userId
        }
    });

    if ( !user ) {
        await prisma.$disconnect();
        return res.status(404).json({ message: 'Usuario no encontrado: ' + userId });
    }

    await prisma.user.update({
        where: {
            idUser: user.idUser   
        },
        data: {
            role
        }
    })

    await prisma.$disconnect()
    return res.status(200).json({ message: 'Usuario actualizado' });   

}