import { PrismaClient } from '@prisma/client';
import { IOrder, IOrderItem } from '../interfaces';



const prisma = new PrismaClient()

export const getOrderById = async( id: string ):Promise<IOrder| null> => {

    await prisma.$connect()
    const order = await prisma.order.findUnique({
        where: {
            id
        }
    })
    await prisma.$disconnect()

    if ( !order ) {
        return null;
    }

    // const orderClone: string = JSON.stringify( order )
    // const order2 = JSON.parse( orderClone )

    return JSON.parse(JSON.stringify( order ));
}


export const getOrdersByUser = async( userId: number ): Promise<IOrder[]> => {

    await prisma.$connect()
    const orders = await prisma.order.findMany({
        where: {
            user: userId
        },
        orderBy: {
            createdAt: 'asc'
        }
    })
    await prisma.$disconnect()

    return JSON.parse(JSON.stringify(orders));
}
