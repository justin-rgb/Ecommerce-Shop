import type { NextPage } from 'next'
import { Typography } from '@mui/material';
import { ShopLayout } from '../components/layout';
import { ProductList } from '../components/products';
// import { initialData } from '../database/products';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading } from '../components/ui/FullScreenLoading';


const Home: NextPage = () => {

    const { data, isLoading, isError } = useProducts('/products')

    return (
        <ShopLayout title={"JVCShop - Home"} pageDescription={'Best products on world'}  >

            <Typography variant='h1' component='h1'> Tienda </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}> Todos los productos </Typography>
            {
                isLoading
                ? <FullScreenLoading />
                : <ProductList products={ data.products } />
            }
        </ShopLayout>
    )
}

export default Home
