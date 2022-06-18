import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { seedDatabase } from '../../database';

type Data = {
    message: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if( process.env.NODE_ENV === 'production' ){
        return res.status(401).json({ message: 'No tiene acceso' })
    }

    const prisma = new PrismaClient()

    // await prisma.product.deleteMany()
    // await prisma.genders.createMany({
    //     data: [
    //         { gender: 'men' },
    //         { gender: 'women' },
    //         { gender: 'kid' },
    //         { gender: 'unisex' }
    //     ]
    // })

    // await prisma.productType.createMany({
    //     data: [
    //         { Type: 'shirts' },
    //         { Type: 'pants'},
    //         { Type: 'hoodies' },
    //         { Type: 'hats' }
    //     ]
    // })

    // await prisma.product.createMany({
    //     data: initialData.products
    // })

    

    // await prisma.role.createMany({
    //     data:[
    //         { idRole: 0, roleName: 'client' },
    //         { idRole: 1, roleName: 'admin' }
    //     ]
    // })

    await prisma.user.deleteMany()
    await prisma.user.createMany({
        data: seedDatabase.initialData.users
    })

    // const data = await prisma.product.findMany()
    prisma.$disconnect()
    
    res.status(200).json({ message: 'Proceso correctamente' })
}