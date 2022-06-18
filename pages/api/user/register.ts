import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';

import { jwt, validations } from '../../../utils';
import { PrismaClient } from '@prisma/client';

type Data = 
| { message: string }
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: number;
    }
}

const Prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return registerUser(req, res)

        default:
            res.status(400).json({
                message: 'Bad request'
            })
    }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };

    // VALIDACIONES
    if ( password.length < 6 ) {
        return res.status(400).json({
            message: 'La contraseña debe de ser de 6 caracteres'
        });
    }

    if ( name.length < 2 ) {
        return res.status(400).json({
            message: 'El nombre debe de ser de 2 caracteres'
        });
    }
    
    if ( !validations.isValidEmail( email ) ) {
        return res.status(400).json({
            message: 'El correo no tiene formato de correo'
        });
    }
    
    // CONEXION A BD
    await Prisma.$connect()

    // USUARIO A BUSCAR
    const user = await Prisma.user.findUnique({
        where: {
            email
        }
    })
    

    if ( user ) {
        return res.status(400).json({
            message:'No puede usar ese correo'
        })
    }


    const newUser = await Prisma.user.create({
        data: {
            email: email.toLocaleLowerCase(),
            password: bcrypt.hashSync( password ),
            role: 0,
            name
        }
    })

    // DESCONEXION A BD
    await Prisma.$disconnect()

    const { role, idUser } = newUser;
    const token = jwt.signToken( idUser , email );

    return res.status(200).json({
        token, //jwt
        user: {
            email, 
            role, 
            name,
        }
    })


}