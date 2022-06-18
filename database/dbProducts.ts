import { PrismaClient } from "@prisma/client"
import { IProduct } from "../interfaces";

const prisma = new PrismaClient();

export const getProductBySlug = async (slug: string): Promise<IProduct> => {

    return await getProduct(slug)
    .catch( err => {
        throw err
    })
    .finally( async () => {
        await prisma.$disconnect()
    })
}

const getProduct = async ( slug: string ) => {
    prisma.$connect()
    const product = await prisma.product.findUnique({
        where: {
            slug: slug
        }
    })
    if( !product ) return null;
    return JSON.parse( JSON.stringify(product) )
}


interface ProductSlug {
    slug: string;
}

export const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
    await prisma.$connect()
    const slugs = prisma.product.findMany({
        select: {
            slug: true,
            id: true
        }
    })
    await prisma.$disconnect()
    return slugs;
}

export const getProductsByTerm = async ( term: string) => {

    term = term.toString().toLowerCase();

    await prisma.$connect()
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { description: { contains: term, mode: 'insensitive' } },
                { gender: { contains: term, mode: 'insensitive' } },
                { slug: { contains: term, mode: 'insensitive' } },
                { title: { contains: term, mode: 'insensitive' } },
                { type: { contains: term, mode: 'insensitive' } },
            ]
        },
        select: {
            id: true,
            title: true,
            images: true,
            price: true,
            inStock: true,
            slug: true
        }
    })

    await prisma.$disconnect();
    return products;

}

export const getAllProducts = async () => {

    await prisma.$connect()
    const products = await prisma.product.findMany({
        select: {
            id: true,
            title: true,
            images: true,
            price: true,
            inStock: true,
            slug: true
        }
    })
    await prisma.$disconnect()
    return products;

}
