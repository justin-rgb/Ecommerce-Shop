import { useState, useEffect } from 'react';
import { PeopleOutline } from '@mui/icons-material'
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, Select, MenuItem } from '@mui/material';

import { AdminLayout } from '../../components/layout'
import { IUser } from '../../interfaces';
import { jvcApi } from '../../api';




const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data])
    

    if ( !data && !error ) return (<></>);

    const onRoleUpdated = async( userId: number, newRole: number ) => {

        const previosUsers = users.map( user => ({ ...user }));
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user.idUser ? newRole : user.role
        }));

        setUsers(updatedUsers as any);

        try {
            console.log(userId, newRole);
            await jvcApi.put('/admin/users', { userId, role: newRole });

        } catch (error) {
            setUsers( previosUsers );
            console.log(error);
            alert('No se pudo actualizar el role del usuario');
        }

    }


    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 300 },
        { field: 'name', headerName: 'Nombre completo', width: 300 },
        {
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridValueGetterParams) => {
                return (
                    <Select
                        value={ row.role }
                        label="Rol"
                        onChange={ ({ target }) => 
                            onRoleUpdated( row.id, target.value )
                        }
                        sx={{ width: '100%' }}
                    >
                        <MenuItem value={0}> Client </MenuItem>
                        <MenuItem value={1}> Admin </MenuItem>
                        <MenuItem value={2}> Super User </MenuItem>
                        <MenuItem value={3}> SEO </MenuItem>
                    </Select>
                )
            }
        },
        {
            field: 'updateTime',
            headerName: 'Ult Actualizado',
            width: 300
        }
    ];

    const rows = users.map( user => ({
        id: user.idUser,
        email: user.email,
        name: user.name,
        role: user.role,
        updateTime: new Date(user.updatedAt).toLocaleDateString() 
        + ' - ' + new Date(user.updatedAt).getHours() 
        + ':' + new Date(user.updatedAt).getMinutes()
        + ':' + new Date(user.updatedAt).getMilliseconds()
    }))


  return (
    <AdminLayout 
        title={'Usuarios'} 
        subTitle={'Mantenimiento de usuarios'}
        icon={ <PeopleOutline /> }
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

export default UsersPage;