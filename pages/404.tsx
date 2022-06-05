import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../components/layout/ShopLayout';

const Custom404 = () => {
    return (

        <ShopLayout title='Page not found' pageDescription='Pagina no encontrada'>

            <Box 
                display='flex' 
                justifyContent='center' 
                alignItems='center' 
                height='calc(100vh - 200px)'
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}    
            >
                <Typography variant='h1' component='h1' fontWeight={300} fontSize={80} >  404 |  </Typography>
                <Typography marginLeft={2} > No encontramos ninguna página aquí </Typography>
            </Box>

        </ShopLayout>

    ) 
}

export default Custom404