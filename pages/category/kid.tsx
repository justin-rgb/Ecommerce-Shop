import { Typography } from "@mui/material"
import { NextPage } from "next"
import { ShopLayout } from "../../components/layout"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks"



const KidPage: NextPage = () => {
  
    const { data, isLoading, isError } = useProducts('/products?g=kid')

    return (
        <ShopLayout title={'JVCShop - Kids'} pageDescription={'Mejores productos para niños'}  >

            <Typography variant='h1' component='h1'> Niños </Typography>
            <Typography variant='h2' sx={{ mb: 1 }}> Todos los productos </Typography>
            {
                isLoading
                ? <FullScreenLoading />
                : <ProductList products={ data.products } />
            }
        </ShopLayout>
    )

}

export default KidPage