import { Typography } from '@mui/material';
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layout';
import { ProductList } from '../components/products';
import { initialData } from '../database/products';


const Home: NextPage = () => {
    return (
        <ShopLayout title={'TesloShop - Home'} pageDescription={'Best products on world'}  >

            <Typography variant='h1' component='h1'> Tienda </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}> Todos los productos </Typography>

            <ProductList 
                products={ initialData.products as any }
            />


        </ShopLayout>
    )
}

export default Home
