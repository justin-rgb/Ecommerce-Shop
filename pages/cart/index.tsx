import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layout";
import { useEffect, useContext } from 'react';
import { useRouter } from "next/router";
import { CartContext } from "../../context";


const CartPage = () => {
  
    const { cart, isLoaded } = useContext(CartContext)
    const router = useRouter()

    useEffect( () => {
        if( isLoaded && cart.length < 1 ){
            router.replace('/cart/empty')
        }
    },[ cart, isLoaded, router ])

    if( !isLoaded ){
        return( <> </> )
    }

    return (
        <ShopLayout title='Carrito - 3' pageDescription={'Carrito de compras de la tienda'}>
            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container marginTop={2}>

                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList editable />
                </Grid>

                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my:1 }} />

                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>

                                <Button color="info" 
                                    className='circular-btn' fullWidth
                                    sx={{ backgroundColor: '#3A64D8' }}
                                    href='/checkout/address'
                                >
                                    Checkout
                                </Button>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}

export default CartPage;