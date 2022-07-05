import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IOrder } from '../../../interfaces';

type Data = 
| { message: string } 
|  IOrder[]

const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {

        case 'GET':
            return getOrders(req, res);

        default:
            return res.status(400).json({ message: 'Bad request'});

    }


}

const getOrders = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    await prisma.$connect()
    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            User: {
                select: {
                    name: true,
                    email: true,
                }
            }
        }
    })
    await prisma.$disconnect()

    return res.status(200).json( orders as any )

}