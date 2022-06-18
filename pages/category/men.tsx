import { Typography } from "@mui/material"
import { NextPage } from "next"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"



const MenPage: NextPage = () => {
  
    const { data, isLoading, isError } = useProducts('/products?g=men')

    return (
        <ShopLayout title={'TesloShop - Men'} pageDescription={'Mejores productos para hombres'}  >

            <Typography variant='h1' component='h1'> Hombres </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}> Todos los productos </Typography>
            {
                isLoading
                ? <FullScreenLoading />
                : <ProductList products={ data.products } />
            }
        </ShopLayout>
    )

}

export default MenPage