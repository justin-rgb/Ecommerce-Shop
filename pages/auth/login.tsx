import { AuthLayout } from "../../components/layout"
import { Box, Button, Grid, Link, TextField, Typography, Chip } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from "react-hook-form";
import { validations } from "../../utils";
import jvcApi from '../../api/api';
import { ErrorOutline } from "@mui/icons-material";
import { useState } from 'react';


type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)

    const onLoginUser = async ( { email, password }: FormData ) => {
        
        setShowError(false)

        try{
            const { data } = await jvcApi.post('/user/login', { email, password } )
            const { token, user } = data;
            console.log( token, user );
        }catch( error ){
            console.log('Error en las credenciales');
            setShowError(true)
            setTimeout( () => setShowError(false), 3000 )
        }


    }

    return (
    
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={ handleSubmit(onLoginUser) } noValidate >
                <Box sx={{ width: 350, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Iniciar Sesión</Typography>
                            <Chip 
                                label="Usuario / Contraseña invalidos"
                                color="error"
                                icon={ <ErrorOutline /> }
                                className="fadeIn"
                                sx={{
                                    width: '100%',
                                    display: showError ? 'flex' : 'none'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                type="email"
                                label="Correo" 
                                variant="filled" 
                                fullWidth  
                                color="info" 
                                { 
                                    ...register('email', {
                                        required: 'Este campo es requerido',
                                        validate: validations.isEmail
                                    }) 
                                }
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Contraseña" 
                                type='password' 
                                variant="filled" 
                                fullWidth 
                                color="info"
                                { 
                                    ...register('password', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                    }) 
                                }
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit" 
                                sx={{ backgroundColor: '#3A64D8' }}  
                                color="secondary" 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href="/auth/register" passHref>
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>

    )
}

export default LoginPage