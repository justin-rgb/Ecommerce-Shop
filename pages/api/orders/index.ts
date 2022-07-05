
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { IOrder, ShippingAddress } from '../../../interfaces';

type Data = 
| { message: string }
| IOrder;


const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method) {
        case 'POST':
            return createOrder( req, res )
    
        default:
            return res.status(400).json({ message: 'Bad request'})
    }
    
}


const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    

    const { orderItems, total, numberOfItems, tax, subTotal } = req.body as IOrder;
    const body = req.body as IOrder;

    // Vericar que tengamos un usuario
    const session: any = await getSession({ req });
    if ( !session ) {
        return res.status(401).json({message: 'Debe de estar autenticado para hacer esto'});
    }


    // Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product.id );
    await prisma.$connect()

    const dbProducts = await prisma.product.findMany({
        where: {
            id: {
                in: productsIds
            }
        }
    })
    

    try {
        const subTotalItem = orderItems.reduce( ( prev, current ) => {

            const currentPrice = dbProducts.find( prod => prod.id === current.id )?.price;
            if ( !currentPrice ) {
                throw new Error('Verifique el carrito de nuevo, producto no existe');
            }

            return (currentPrice * current.quantity) + prev
        }, 0 );


        const taxRate =  Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotalItem * ( taxRate + 1 );

        if ( total !== backendTotal ) {
            throw new Error('El total de los productos no concuerda con el carrito');
        }

        // Todo bien hasta este punto
        const userId = session.user.idUser;
        
        const newOrder = await prisma.order.create({
            data: {
                user: userId,
                orderItems: orderItems as any,
                shippingAddress: body.shippingAddress as any ,
                numberOfItems,
                isPaid: false,
                subTotal,
                tax,
                total: Math.round(total * 100)/100 //Redondear a 2 decimales
            }
        })
        await prisma.$disconnect()
        // console.log(newOrder)
        return res.status(201).json( newOrder as any );
    
    } catch (error:any) {
        await prisma.$disconnect()

        // console.log(error.message);

        return res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        })
    }

}
