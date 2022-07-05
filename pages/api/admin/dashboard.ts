import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    numberOfOrders: number;
    paidOrders: number; // isPad true
    notPaidOrders: number;
    numberOfClients: number; // role: client
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // productos con 10 o menos
}

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    prisma.$connect()

    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    ] = await Promise.all([
        prisma.order.count(),
        prisma.order.count({
            where: {
                isPaid: true
            }
        }),
        prisma.user.count({
            where: {
                role: 0
            }
        }),
        prisma.product.count(),
        prisma.product.count({
            where: {
                inStock: 0
            }
        }),
        prisma.product.count({
            where: {
                inStock: {
                    lte: 10
                }
            }
        })
    ])
    
    prisma.$disconnect()
    res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    })
}