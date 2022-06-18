import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layout';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { jvcApi } from '../../api';
import { ErrorOutline } from '@mui/icons-material';
import { validations } from '../../utils';

type FormData = {
    name    : string;
    email   : string;
    password: string;
};


const RegisterPage = () => {
    
    const router = useRouter();
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [ showError, setShowError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');

    const onRegisterForm = async( {  name, email, password }: FormData ) => {
        
        setShowError(false)

        try{

            const { data } = await jvcApi.post('/user/register', { name, email, password } )
            const { token, user } = data;
            console.log( token, user );

        }catch( error ){
            
            console.log('Ha ocurrido un error');
            setShowError(true)
            setTimeout( () => setShowError(false), 3000 )
        }
    }




    return (
        
        <AuthLayout title={'Registrarse'}>
            <form onSubmit={ handleSubmit(onRegisterForm) } noValidate >
                <Box sx={{ width: 350, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Crear cuenta</Typography>
                            <Chip 
                                label="Usuario / Contraseña ya existe"
                                color="error"
                                icon={ <ErrorOutline /> }
                                className="fadeIn"
                                sx={{
                                    width: '100%',
                                    display: showError ? 'flex' : 'none',
                                    marginTop: '10px'
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label="Nombre completo" 
                                variant="filled" 
                                fullWidth  
                                color="info"
                                { 
                                    ...register('name', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 2, message: 'Minimo 2 caracteres' }
                                    }) 
                                }
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
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
                                sx={{ backgroundColor: '#3A64D8' }} 
                                color="secondary" 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                                type='submit'    
                            >
                                Registrarse
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href="/auth/login" passHref>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage