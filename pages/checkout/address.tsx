import { FC, useContext } from 'react';
import { GetServerSideProps } from 'next'
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import { ShopLayout } from '../../components/layout/ShopLayout';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { countries } from '../../utils';
import { useForm } from 'react-hook-form';
import { CartContext } from '../../context';

type FormData = {
    firstname: string;
    lastname: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}

const getAddressFromCookies = (): FormData => {
    return {
        firstname: Cookies.get('firstname') || '',
        lastname: Cookies.get('lastname') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
    }
}

interface Props {
    country: string;
}

const Address: FC<Props> = ({ country }) => {

    const { updateAddress } = useContext(CartContext);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    const onSubmitAddress = async ( data :FormData) => {
        updateAddress(data)
        router.push( '/checkout/summary' )
    } 

    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar direccion de destino' >
            <form onSubmit={ handleSubmit(onSubmitAddress) } noValidate>
            <Typography variant='h1' component='h1'> Direccion </Typography>

            <Grid container spacing={ 2 } sx={{ mt: 2 }}>
            
                <Grid item xs={12} sm={ 6 }>
                    <TextField 
                        color="info" 
                        label='Nombre' 
                        variant="filled" 
                        fullWidth
                        {
                            ...register('firstname', {
                                required: 'Este campo es obligatorio'
                            })
                        }
                        error={ !!errors.firstname }
                        helperText={ errors.firstname?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField 
                        color="info" 
                        label='Apellido' 
                        variant="filled" 
                        fullWidth 
                        {
                            ...register('lastname', {
                                required: 'Este campo es obligatorio'
                            })
                        }
                        error={ !!errors.lastname }
                        helperText={ errors.lastname?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={ 6 }>
                    <TextField  
                        color="info" 
                        label='Dirección' 
                        variant="filled" 
                        fullWidth 
                        {
                            ...register('address', {
                                required: 'Este campo es obligatorio',
                                minLength: { value: 10, message: 'La direccion debe contener al menos 15 carácteres' }
                            })
                        }
                        error={ !!errors.address }
                        helperText={ errors.address?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField 
                        color="info" 
                        label='Dirección 2 (opcional)' 
                        variant="filled" 
                        fullWidth
                        {
                            ...register('address2', {
                                required: false
                            })
                        }
                        error={ !!errors.address2 }
                        helperText={ errors.address2?.message }
                    />
                </Grid>

                <Grid item xs={12} sm={ 6 }>
                    <TextField 
                        color="info" 
                        label='Código Postal' 
                        variant="filled" 
                        fullWidth 
                        {
                            ...register('zip', {
                                required: 'Este campo es obligatorio'
                            })
                        }
                        error={ !!errors.zip }
                        helperText={ errors.zip?.message }
                    />
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField 
                        color="info" 
                        label='Ciudad' 
                        variant="filled" 
                        fullWidth 
                        {
                            ...register('city', {
                                required: 'Este campo es obligatorio'
                            })
                        }
                        error={ !!errors.city }
                        helperText={ errors.city?.message }
                    />
                </Grid>
                
                <Grid item xs={12} sm={ 6 }>
                    <FormControl fullWidth>
                        <TextField
                            select
                            variant="filled"
                            label="País"
                            color="info"
                            defaultValue={ country ? country : countries[0].code }
                            {
                                ...register('country', {
                                    required: false
                                })
                            }
                            error={ !!errors.country }
                            // helperText={ errors.country?.message }
                        >
                            {
                                countries.map( country => (
                                    <MenuItem 
                                        key={ country.code }
                                        value={ country.code }
                                    > { country.name } </MenuItem>
                                ))
                            }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={ 6 }>
                    <TextField 
                        color="info" 
                        label='Teléfono' 
                        variant="filled" 
                        fullWidth 
                        {
                            ...register('phone', {
                                required: 'Este campo es obligatorio'
                            })
                        }
                        error={ !!errors.phone }
                        helperText={ errors.phone?.message }
                    />
                </Grid>

            </Grid>


            <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                <Button 
                    color="secondary" 
                    className="circular-btn" 
                    size="large"
                    sx={{ backgroundColor: '#3A64D8' }}
                    type="submit"
                >
                    Revisar pedido
                </Button>
            </Box>
            </form>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    // const { token = '', country = '' } = req.cookies;
    // let isValidToken = false;

    // try{
    //     await jwt.isValidToken(token)
    //     isValidToken = true;
    // }catch(error){
    //     isValidToken = false;
    // }

    // if( !isValidToken ){
    //     return {
    //         redirect: {
    //             destination: '/auth/login?p=/checkout/address',
    //             permanent: false,
    //         }
    //     }
    // }

    const { country = '' } = req.cookies;

    return {
        props: {
            country
        }
    }
}


export default Address