import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useRouter } from "next/router";

import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layout"
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { countries } from "../../utils";


const SummaryPage = () => {

    const router = useRouter()
    const { shippingAdress, numberOfItems, createOrder } = useContext( CartContext )

    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    useEffect( () => {
        if( !Cookies.get('firstname')){
            router.push('/checkout/address')
        }
    },[router])

    const onCreateOrder = async () => {
        setIsPosting(true)

        const { hasError, message } = await createOrder()
        console.log(message);
        if( hasError ){
            setIsPosting(false)
            setErrorMessage( message )
            return;
        }

        router.replace(`/orders/${message}`)
    }



    if( !shippingAdress ) return <></>

    const { firstname, lastname, address, city, country, phone, zip, address2 } = shippingAdress

    return (
        
        <ShopLayout title='Resumen de orden' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>

            <Grid container>
                <Grid item xs={ 12 } sm={ 7 } sx={{ marginTop: '15px'}} >
                    <CartList />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems <= 1 ? 'productos': 'productos' })</Typography>
                            <Divider sx={{ my:1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link color='#FFFFF' underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            
                            <Typography> { firstname } { lastname }  </Typography>
                            <Typography> {address} { address2 ? `${address2}` : '' }  </Typography>
                            <Typography> { city }, {zip} </Typography>
                            <Typography> { countries.find( e => e.code === country )?.name } ({country}) </Typography>
                            <Typography> { phone } </Typography>

                            <Divider sx={{ my:1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    <Link underline='always' color='#FFFFF'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection="column" >
                                <Button 
                                    sx={{ backgroundColor: '#3A64D8' }}
                                    color="secondary" className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrder }
                                    disabled={ isPosting }
                                >
                                    Confirmar Orden
                                </Button>

                                <Chip 
                                    color="error"
                                    label={ errorMessage }
                                    sx={{ display: errorMessage ? 'flex' : 'none', marginTop: 2 }}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>

    )
}

export default SummaryPage