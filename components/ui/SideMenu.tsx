import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { useContext, useState } from 'react';
import { AuthContext, UIContext } from "../../context"
import { useRouter } from "next/router"


export const SideMenu = () => {
    const router = useRouter()
    const { isMenuOpen, toggleSideMenu } = useContext(UIContext)
    const [searchTerm, setSearchTerm] = useState('')
    const { isLoggedIn, user, logout } = useContext(AuthContext)

    const userRolesWithPrivileges = ['admin', 'super-user', 'SEO']

    const onSearchTerm = () => {
        if( searchTerm.length === 0 ) return ;
        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = ( url: string) => {
        toggleSideMenu()
        router.push(url)
    }

    return (
        
        <Drawer
            open={ isMenuOpen }
            onClose={ toggleSideMenu }
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>
                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm}
                            onChange={ e => setSearchTerm(e.target.value) }
                            onKeyUp={ e => e.key === 'Enter' ? onSearchTerm() : null }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ onSearchTerm }
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>


                    {
                         isLoggedIn === true ? (
                            <>
                                <ListItem button>
                                    <ListItemIcon>
                                        <AccountCircleOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItem>

                                <ListItem button onClick={ () => navigateTo('/orders/history')} >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItem>
                            </>
                         ):(
                            <p></p>
                         )
                    }
                    

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }} 
                        onClick={ () => navigateTo('/category/men') } 
                    >
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItem>

                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' }}} 
                        onClick={ () => navigateTo('/category/women') } 
                    >
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItem>


                    <ListItem 
                        button 
                        sx={{ display: { xs: '', sm: 'none' } }} 
                        onClick={ () => navigateTo('/category/kid') } 
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItem>

                    
                    {
                        isLoggedIn ? (
                            <ListItem button onClick={ logout }>
                                <ListItemIcon>
                                    <LoginOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItem>
                        ): (
                            <ListItem 
                                button
                                onClick={ () => navigateTo(`/auth/login?p=${router.asPath}`) } 
                            >
                                <ListItemIcon>
                                    <VpnKeyOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItem>
                        )
                    }
                    


                    {/* PANEL ADMIN */}
                    {
                        isLoggedIn === true && userRolesWithPrivileges.includes(user?.role.roleName as string) ?(
                            <>
                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItem 
                                    button
                                    onClick={ () => navigateTo(`/admin`) }
                                >
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>

                                <ListItem 
                                    button
                                    onClick={ () => navigateTo(`/admin/products`) }    
                                >
                                    <ListItemIcon>
                                        <CategoryOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItem>

                                <ListItem 
                                    button
                                    onClick={ () => navigateTo('/admin/orders')}
                                >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItem>

                                <ListItem 
                                    button
                                    onClick={ () => navigateTo('/admin/users')}
                                >
                                    <ListItemIcon>
                                        <AdminPanelSettings/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        ):(
                            <p></p>
                        )
                    }
                    
                </List>
            </Box>
        </Drawer>

    )
}
