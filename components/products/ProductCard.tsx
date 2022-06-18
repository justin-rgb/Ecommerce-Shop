import { FC, useMemo, useState } from "react"
import { Grid, Card, Link, CardActionArea, CardMedia, Typography, Box, Chip } from "@mui/material"
import NextLink from 'next/link'
import { IProduct } from "../../interfaces"

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {
  
    const [isHovered, setIsHovered] = useState(false);
    const [isImageLoaded, setisImageLoaded] = useState(false)

    const productImage = useMemo(() => {
        return isHovered
          ? `/products/${ product.images[1] }`
          : `/products/${ product.images[0] }`;

    }, [isHovered, product.images])

    return (
        <Grid item 
            xs={6} 
            sm={ 4 }
            onMouseEnter={ () => setIsHovered(true) } 
            onMouseLeave={ () => setIsHovered(false) } 
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={ false }>
                    <Link>

                        <CardActionArea>
                            {
                                (product.inStock === 0) &&
                                    <Chip 
                                        color="primary"
                                        label="No hay disponibles"
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '0.5px' }}
                                    />
                            }
                            <CardMedia 
                                component='img'
                                className='fadeIn'
                                image={ productImage }
                                alt={ product.title }
                                onLoad={ () => setisImageLoaded(true) }
                            />

                        </CardActionArea>
                    </Link>
                </NextLink>
                
            </Card>

            <Box sx={{ mt: 1, display: isImageLoaded ? 'block' : 'none'  }} className='fadeIn'>
                <Typography fontWeight={700}>{ product.title }</Typography>
                <Typography fontWeight={500}> Precio: { `$${product.price}` }</Typography>
            </Box>
        </Grid>
    )
}
