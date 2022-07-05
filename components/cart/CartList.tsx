import NextLink from 'next/link'
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { FC, useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context';
import { ItemCounter } from '../ui';
import { ICartProduct } from '../../interfaces/cart';
import { IOrderItem } from '../../interfaces';


interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantity = (product : ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product )
    }

    const [displayReady, setDisplayReady] = useState(false)
    useEffect( () => {
        setDisplayReady(true)
    },[])

    const productsToShow = products ? products : cart
    console.log(productsToShow)

    return (
        <>
            {   
                displayReady === true ?
                    (                
                    productsToShow.map( product => (
                        <Grid container spacing={2} key={ product.slug + product.size } sx={{ mb:1 }}>
                            <Grid item xs={3}>
                                {/* TODO: llevar a la página del producto */}
                                <NextLink href={`/product/${ product.slug }`} passHref>
                                    <Link>
                                        <CardActionArea>
                                            <CardMedia 
                                                image={ product.image }
                                                component='img'
                                                sx={{ borderRadius: '5px' }}
                                            />
                                        </CardActionArea>
                                    </Link>
                                </NextLink>
                            </Grid>
                            <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1'>{ product.title }</Typography>
                                    <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>

                                    {
                                        editable 
                                        ? (
                                            <ItemCounter 
                                                currentValue={ product.quantity }
                                                maxValue={ 10 } 
                                                updatedQuantity={ ( value ) => onNewCartQuantity(product as ICartProduct, value) }
                                            />
                                        )
                                        : (
                                            <Typography variant='h5'>{ product.quantity } { product.quantity > 1 ? 'productos':'producto' }</Typography>
                                        )
                                    }
                                    
                                </Box>
                            </Grid>
                            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                                <Typography variant='subtitle1'>{ `$${ product.price }` }</Typography>
                                
                                {
                                    editable && (
                                        <Button 
                                            variant='text' 
                                            color='secondary' 
                                            onClick={ () => removeCartProduct( product as ICartProduct ) }
                                            sx={{
                                                backgroundColor: '#BB2121'
                                            }}
                                        >
                                            Remover
                                        </Button>
                                    )
                                }
                            </Grid>
                        </Grid>
                    ))
                
                ): <> </>
            }
        </>

    )
}
