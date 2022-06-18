import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { message: string }

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getProductBySlug( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}


const getProductBySlug = async( req: NextApiRequest, res: NextApiResponse ) => {

    const productRoute = req.url?.split('/')[3]

    const prisma = new PrismaClient()
    await prisma.$connect()
    
    const product = await prisma.product.findUnique({
        where: { slug: productRoute }
    })

    if( product === null ){
        return res.status(404).json({
            message: 'Producto no encontrado'
        })
    }
    prisma.$disconnect()

    return res.status(200).json( product );
}