
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { SHOP_CONSTANTS } from '../../../database';
import { IGender, IProduct } from '../../../interfaces/products';

type Data = {
    message: string
    | IProduct[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return getProducts( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
    
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse) => {
    
    const { g = 'all' } = req.query;

    let condition;

    if( g !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${g}`) ){
        condition =  { g }
        console.log(condition)
    }

    const prisma = new PrismaClient();

    const products = await prisma.product.findMany({
        select: { 
            title: true,
            images: true,
            price: true,
            inStock: true,
            slug: true,
            id: true
        },
        where: {  gender: condition?.g.toString() }
    })

    console.log(products)

    await prisma.$disconnect()

    return res.status(200).json({
        condition,
        products
    });

}