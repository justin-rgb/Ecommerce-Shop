import useSWR from 'swr';
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../components/layout'
import { IOrder, IUser } from '../../interfaces';


const columns:GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 200 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        width: 120,
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid
                ? ( <Chip variant='outlined' label="Pagada" color="success" /> )
                : ( <Chip variant='outlined' label="Pendiente" color="error" /> )
        }
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={ `/admin/orders/${ row.id }` } target="_blank" rel="noreferrer" style={{ color: 'white' }}>
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300 },

];




const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if ( !data && !error ) return (<></>);
    
    console.log(data);

    const rows = data!.map( order => ({
            id    : order.id,
            email : order.User?.email,
            name  : order.User?.name,
            total : order.total,
            isPaid: order.isPaid,
            noProducts: order.numberOfItems,
            createdAt: new Date(order.createdAt as string).getHours() 
            + ':' + new Date(order.createdAt as string).getMinutes()
            + ':' + new Date(order.createdAt as string).getMilliseconds()
            + ' - ' + new Date(order.createdAt as string).toLocaleDateString() 
        }) 
    );


  return (
    <AdminLayout 
        title={'Ordenes'} 
        subTitle={'Mantenimiento de ordenes'}
        icon={ <ConfirmationNumberOutlined /> }
    >
         <Grid container className='fadeIn'>
            <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                <DataGrid 
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />

            </Grid>
        </Grid>
        
    </AdminLayout>
  )
}

export default OrdersPage