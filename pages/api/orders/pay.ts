
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IPaypal } from '../../../interfaces';

type Data = {
    message: string
}

const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return payOrder(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad Request' })
    }
    
}


const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64')
    const body = new URLSearchParams('grant_type=client_credentials');

    try{

        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        } )

        return data.access_token;

    }catch(error){
        if( axios.isAxiosError(error)){
            console.log(error.response?.data)
        } else {
            console.log(error)
        }

        return null;
    }

}


const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const paypalBearerToken = await getPaypalBearerToken()

    if( !paypalBearerToken ){
        return res.status(400).json({ message: 'No se pudo generar el token de paypal' })
    }

    const { transactionId = '', orderId = '' } = req.body;

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${ transactionId }`, {
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    })

    if( data.status !== 'COMPLETED'){
        return res.status(401).json({ message: 'Orden no reconocida' })
    }

    await prisma.$connect()
    const dbOrder = await prisma.order.findUnique({
        where: {
            id: orderId
        }
    })

    if( !dbOrder ){
        await prisma.$disconnect()
        return res.status(400).json({ message: 'Orden no existe en nuestra base de datos'})
    }


    if ( dbOrder.total !== Number(data.purchase_units[0].amount.value) ) {
        await prisma.$disconnect();
        return res.status(400).json({ message: 'Los montos de PayPal y nuestra orden no son iguales' });
    }


    await prisma.order.update({
        where: {
            id: dbOrder.id
        },
        data: {
            isPaid: true,
            transactionId: transactionId
        }
    })
    await prisma.$disconnect()

    return res.status(200).json({ message: 'Orden pagada' })
}

