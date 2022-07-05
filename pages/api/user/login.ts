import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = 
|{ message: string}
| {
    token: string;
    user: {
        idUser: number;
        name: string;
        email: string;
        role: any;
    }
}

const Prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch(req.method){
        case 'POST':
            return loginUser(req, res)
    
        
        default:
            res.status(400).json({
                message: 'Bad Request'
            })

    }


}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email= '', password= '' } = req.body;
    await Prisma.$connect()
    const user = await Prisma.user.findUnique({ 
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
     })    
    Prisma.$disconnect()

    if (!user){
        return res.status(400).json({ message: 'Correo o contraseña no validos  - Email' })
    }

    if( !bcrypt.compareSync( password, user.password) ){
        return res.status(400).json({ message: 'Correo o contraseña no validos - Password' })
    }
    
    const { name, idUser, Role } = user;
    const token = jwt.signToken( idUser, email )

    return res.status(200).json({
        token,
        user: {
            idUser, 
            email, 
            name,
            role: Role
        }
    })

}
