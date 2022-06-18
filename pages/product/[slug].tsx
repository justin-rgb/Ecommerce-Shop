import { Box, Button, Chip, Grid, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from '../../components/ui/ItemCounter';
import { IProduct, ISize } from '../../interfaces/products';
import { NextPage } from "next";
import { getProductBySlug, getAllProductSlugs } from '../../database/dbProducts';
import { GetStaticPaths, GetStaticProps } from 'next'
import { ICartProduct } from "../../interfaces/cart";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { CartContext } from '../../context/cart/CartContext';


interface Props {
    product: IProduct;
}


const ProductPage: NextPage<Props> = ({ product }) => {

    const router = useRouter()
    const { addProductToCart } = useContext(CartContext)

    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        id: product.id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
    })

    const selectedSize = ( size: ISize ) => {
        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            size: size
        })  
        )
    }

    const onUpdatedQuantity = ( newQuantity: number ) => {
        setTempCartProduct( currentProduct => ({
            ...currentProduct,
            quantity: newQuantity
        })  
        )
    }
    
    const onAddProduct = () => {
        
        if( !tempCartProduct.size ) return;
        //TODO: llamar la accion del context
        addProductToCart(tempCartProduct)
    }

    return (

        <ShopLayout title={ product.title } pageDescription={ product.description }>
    
            <Grid container spacing={3}  >

                <Grid item xs={12} sm={ 7 }>
                    <ProductSlideShow 
                        images={ product.images }
                    />
                </Grid>

                <Grid item xs={ 12 } sm={ 5 }>
                <Box display='flex' flexDirection='column'>

                    {/* titulos */}
                    <Typography variant='h1' component='h1'>{ product.title }</Typography>
                    <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>

                    {/* Cantidad */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant='subtitle2'>Cantidad</Typography>
                            <ItemCounter 
                                currentValue={ tempCartProduct.quantity }
                                updatedQuantity={ onUpdatedQuantity } 
                                maxValue={ product.inStock > 5 ? 5 : product.inStock }
                            />
                        <SizeSelector
                            selectedSize={ tempCartProduct.size }
                            sizes={ product.sizes }
                            onSelectedSize={ selectedSize }
                        />
                    </Box>


                    {/* Agregar al carrito */}
                    {
                        (product.inStock > 0)
                        ? (
                            <Button 
                                color="secondary" 
                                className='circular-btn'
                                onClick={ onAddProduct }
                                sx={{
                                    backgroundColor: '#3A64D8'
                                }}
                            >
                                {
                                    tempCartProduct.size
                                    ? 'Agregar al carrito' 
                                    : 'Seleccione una talla'
                                }
                            </Button>
                        ):(
                            <Chip label="No hay disponibles" color="error" variant='outlined' />
                        )
                    }
                    
                    {/* Descripción */}
                    <Box sx={{ mt:3 }}>
                        <Typography variant='subtitle2'>Descripción</Typography>
                        <Typography variant='body2'>{ product.description }</Typography>
                    </Box>

                </Box>
                </Grid>


            </Grid>

        </ShopLayout>
    
    )
}

// No Usar SSR
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//     const { slug } = params as { slug: string }
//     const product = await getProductBySlug(slug)
//     if( !product ){
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }
//     return {
//         props: {
//             product
//         }
//     }
// }

export const getStaticPaths: GetStaticPaths = async (ctx) => {

    const productSlugs = await getAllProductSlugs()

    return {
        paths: productSlugs.map( ({ slug }) => ({
            params: {
                slug
            }
        }) ),
        fallback: "blocking"
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug = '' } = params as { slug: string}
    const product = await getProductBySlug(slug)

    if( !product ){
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            revalidate: 60 * 60 * 24
        }
    }
    return {
        props: {
            product
        }
    }
}


export default ProductPage; 