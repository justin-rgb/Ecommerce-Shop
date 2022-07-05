import { useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Box, Button, Link, Toolbar, Typography } from '@mui/material';

import { UIContext } from '../../context';
import { MenuOutlined } from '@mui/icons-material';

export const AdminNavbar = () => {

    const { toggleSideMenu } = useContext( UIContext );

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography color={'info'} variant='h6'>JVC |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>  
                </NextLink>

                <Box flex={ 1 } />

                <Button
                    onClick={ toggleSideMenu }
                    sx={{
                        backgroundColor: 'black',
                        color:'white'
                    }}
                >
                    <MenuOutlined />
                </Button>

            </Toolbar>
        </AppBar>
    )
}