import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces'

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data =
|{ message: string }
| IProduct[]
| IProduct;

const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        
        case 'POST':
            return createProduct( req, res );
    
        case 'PUT': 
            return updateProduct( req, res);

        default:
            res.status(400).json({ message: 'Bad Request' })
    }
    
    

}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    prisma.$connect()

    const products = await prisma.product.findMany({
        orderBy: {
            title: 'asc'
        }
    })

    prisma.$disconnect()

    // TODO: 
    const updatedProducts = products.map( product => {
        
        product.images = product.images.map( image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product;
    })


    res.status(200).json( updatedProducts as [] )
}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { images = [] } = req.body as IProduct;

    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes' });
    }
    
    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    
    try {
        await prisma.$connect()
        const productInDB = await prisma.product.findUnique({
            where: {
                slug: req.body.slug
            }
        })
        if ( productInDB ) {
            await prisma.$disconnect()
            return res.status(400).json({ message: 'Ya existe un producto con ese slug' });
        }
        
        const product = await prisma.product.create({
            data: {
                ...req.body,
                inStock: Number(req.body.inStock),
                price: Number(req.body.price),
            }
        })
        await prisma.$disconnect()

        res.status(201).json( product as IProduct );


    } catch (error) {
        console.log(error);
        await prisma.$disconnect()
        return res.status(400).json({ message: 'Revisar logs del servidor' });
    }

}


const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { id  = -1, images = [] } = req.body as IProduct;

    if ( images.length < 2 ) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imágenes' });
    }

    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    try {
        
        await prisma.$connect()

        const product = await prisma.product.findUnique({
            where: {
                id: id
            }
        })
        if ( !product ) {
            await prisma.$disconnect()
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        }

        // TODO: eliminar fotos en Cloudinary
        // https://res.cloudinary.com/cursos-udemy/image/upload/v1645914028/nct31gbly4kde6cncc6i.jpg
        product.images.forEach( async(image) => {
            if ( !images.includes(image) ){
                // Borrar de cloudinary
                const [ fileId, extension ] = image.substring( image.lastIndexOf('/') + 1 ).split('.')
                console.log({ image, fileId, extension });
                await cloudinary.uploader.destroy( fileId );
            }
        });


        await prisma.product.update({
            where: {
                id: product.id
            },
            data: req.body
        })
        await prisma.$disconnect()
        

        return res.status(200).json( product as IProduct );
        
    } catch (error) {
        console.log(error);
        await prisma.$disconnect()
        return res.status(400).json({ message: 'Revisar la consola del servidor' });
    }

}

