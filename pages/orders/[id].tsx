import { GetServerSideProps, NextPage } from 'next'
import { useState, useEffect, FC } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";

import { CreditCardOffOutlined, CreditScoreOutlined, DangerousOutlined, DangerousSharp, DangerousTwoTone } from "@mui/icons-material"
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography, Modal, Button } from "@mui/material"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layout"
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder, IOrderItem } from '../../interfaces/order';
import { useRouter } from 'next/router';
import { jvcApi } from '../../api';

export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED";
};


interface Props {
    order: IOrder
}


const OrderPage: NextPage<Props> = ({ order }) => {
  
    const router = useRouter();
    const { shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px'
      };
      
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const ModalAdv = () => {
        return(
            <>
                
            </>
        )
    }

    const onOrderCompleted = async ( details: OrderResponseBody ) => {

        if ( details.status !== 'COMPLETED' ) {
            return alert('No hay pago en Paypal');
        }

        setIsPaying(true);

        try {
            
            const { data } = await jvcApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order.id
            });

            router.reload();

        } catch (error) {
            setIsPaying(false);
            alert('Error');
        }

    }


    return (
        <ShopLayout title='Resumen de la orden' pageDescription={'Resumen de la orden'}>
            <Typography variant='h1' component='h1'>Orden: { order.id }</Typography>

            {
                order.isPaid
                ? (
                    <Chip 
                        sx={{ my: 2 }}
                        label="Orden ya fue pagada"
                        variant='outlined'
                        color="success"
                        icon={ <CreditScoreOutlined /> }
                    />
                ):
                (
                    <Chip 
                        sx={{ my: 2 }}
                        label="Pendiente de pago"
                        variant='outlined'
                        color="error"
                        icon={ <CreditCardOffOutlined /> }
                    />
                )
            }

            

            <Grid container className='fadeIn'>
                <Grid item xs={ 12 } sm={ 7 }>
                    <CartList products={  order.orderItems } />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos': 'producto'})</Typography>
                            <Divider sx={{ my:1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            
                            <Typography>{ shippingAddress.firstname } { shippingAddress.lastname }</Typography>
                            <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }`: '' }</Typography>
                            <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                            <Typography>{ shippingAddress.country }</Typography>
                            <Typography>{ shippingAddress.phone }</Typography>

                            <Divider sx={{ my:1 }} />


                            <OrderSummary 
                                orderValues={{
                                    numberOfItems: order.numberOfItems,
                                    subTotal: order.subTotal,
                                    total: order.total,
                                    tax: order.tax,
                                }} 
                            />

                            <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>
                                {/* TODO */}

                                <Box 
                                    display='flex' 
                                    justifyContent='center' 
                                    className="fadeIn"
                                    sx={{ display: isPaying ? 'flex' : 'none' }}
                                >
                                    <CircularProgress color='info' />
                                </Box>


                                <Box flexDirection='column' sx={{ display: isPaying ? 'none' : 'flex', flex: 1}}> 
                                {
                                    order.isPaid
                                    ? (
                                        <Chip 
                                            sx={{ my: 2 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />

                                    ):(
                                        <PayPalButtons 
                                            onClick={ handleOpen }
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${order.total}`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                
                                                return actions.order!.capture().then((details) => {
                                                    
                                                    onOrderCompleted( details )

                                                    // console.log({details})
                                                    // const name = details.payer.name!.given_name;
                                                    // alert(`Transaction completed by ${name}`);
                                                });
                                            }}
                                        />
                                    )
                                }

                                {/* MODAL DE ADVERTENCIA */}
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                    <Box sx={style} >
                                        
                                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                                            <DangerousTwoTone sx={{ fontSize: '30px', }} />  Advertencia
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Los pagos en linea se encuentran deshabilitados, por lo que le recomendamos usar otro medio de pago
                                        </Typography>
                                    </Box>
                                    </Modal>
                                </Box>

                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </ShopLayout>
    )
}



export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = 0 } = query;
    const session: any = await getSession({ req })

    if( !session ){ 
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${ id }`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString() )
    
    if( !order ){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }


    if( order.user !== session.user.idUser){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }


    return {
        props: {
            order
        }
    }
}



export default OrderPage