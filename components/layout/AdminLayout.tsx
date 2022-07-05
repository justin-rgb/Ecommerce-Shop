import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { AdminNavbar } from '../admin';

import { SideMenu } from '../ui';
import Head from 'next/head';


interface Props {
    title: string;
    subTitle: string;
    icon?: JSX.Element;
    children?: React.ReactNode
}

export const AdminLayout:FC<Props> = ({ children, title, subTitle, icon }) => {
  return (
    <>
        <Head>
            <title> {title+' | JVC Shop' } </title>
        </Head>

        <nav>
            <AdminNavbar />
        </nav>

        <SideMenu />

        <main style={{
            margin: '80px auto',
            maxWidth: '1440px',
            padding: '0px 30px'
        }}>

            <Box display="flex" flexDirection='column'>
                <Typography variant='h1' component='h1'>
                    { icon }
                    {' '} { title }
                </Typography>
                <Typography variant='h2' sx={{ mb: 1 }}>{ subTitle }</Typography>

            </Box>

            <Box className='fadeIn'>
                { children }
            </Box>

        </main>


    </>
  )

}