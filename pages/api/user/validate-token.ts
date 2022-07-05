import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { jwt } from '../../../utils';
import { PrismaClient } from '@prisma/client';

type Data = 
| { message: string }
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: any;
    }
}

const Prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return checkJWT(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}


const checkJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { token = ''  } = req.cookies;

    let userId = 0;

    try {

        userId = await jwt.isValidToken( token );

    } catch (error) {
        return res.status(401).json({
            message: 'Token de autorización no es válido'
        })   
    }


    await Prisma.$connect();
    const user = await Prisma.user.findUnique({
        where: {
            idUser: userId
        },
        include: {
            Role: {
                select: {
                    roleName: true
                }
            }
        }
    })

    await Prisma.$disconnect()

    if ( !user ) {
        return res.status(400).json({ message: 'No existe usuario con ese id' })
    }

    const { idUser, email, Role, name } = user;

    return res.status(200).json({
        message: 'Token renovado',
        token: jwt.signToken( idUser, email ),
        user: {
            email, 
            role: Role, 
            name
        }
    })


}