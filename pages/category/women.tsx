import { Typography } from "@mui/material"
import { NextPage } from "next"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"



const WomenPage: NextPage = () => {
  
    const { data, isLoading, isError } = useProducts('/products?g=women')

    return (
        <ShopLayout title={'TesloShop - Women'} pageDescription={'Mejores productos para mujeres'}  >

            <Typography variant='h1' component='h1'> Mujeres </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}> Todos los productos </Typography>
            {
                isLoading
                ? <FullScreenLoading />
                : <ProductList products={ data.products } />
            }
        </ShopLayout>
    )

}

export default WomenPage