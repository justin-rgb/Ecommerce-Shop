import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch( req.method ) {
        case 'GET':
            return searchProducts( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}


const searchProducts = async( req: NextApiRequest, res: NextApiResponse ) => {

    let { q = '' } = req.query;
    q = q.toString().toLowerCase()


    const prisma = new PrismaClient()
    await prisma.$connect()
    
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { tags: { has: q } }
            ]
        },
        select: {
            title: true,
            images: true,
            price: true,
            inStock: true,
            slug: true,
            tags: true
        }
    })
    
    if( products.length === 0 ){
        return res.status(400).json({
            message: 'No se encontraron productos'
        });
    }

    prisma.$disconnect()
    return res.status(200).json(products);

}