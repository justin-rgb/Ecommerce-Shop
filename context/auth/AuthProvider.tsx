import { useSession, signOut } from "next-auth/react"
import { FC, ReactNode, useEffect, useReducer } from 'react';


import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces/user';
import jvcApi from '../../api/api';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router';


export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

interface Props {
   children?: ReactNode
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}


export const AuthProvider:FC<Props> = ({ children }) => {

    const { status, data } = useSession()
    const [state, dispatch] = useReducer( authReducer , AUTH_INITIAL_STATE);
    const router = useRouter()

    useEffect(() => {
        
        if ( status === 'authenticated' ) {
        //   console.log({user: data?.user});
          dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        }
      
    }, [ status, data ])
    

    // useEffect(() => {
    //     checkToken()
    // }, [])
    

    const checkToken = async () => {
        
        if( !Cookies.get('token') ) return;

        try{ 
            const { data } = await jvcApi.get('/user/validate-token')
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user})
        }catch(error){
            Cookies.remove('token')
        }
       

    }


    const loginUser = async ( email: string, password: string ): Promise<boolean> => {

        try{
            const { data } = await jvcApi.post('/user/login', { email, password })
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user})
            return true;
        }catch( error ){
            return false;
        }

    }

    const registerUser = async( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
        try{
            const { data } = await jvcApi.post('/user/register', {name, email, password })
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user})
            return {
                hasError: false
            }
        }catch( error ){
            if(axios.isAxiosError(error)){
                return {
                    hasError: true,
                    message: error.message
                }
            }

            return {
                hasError: true,
                message: 'No se puede crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = () => {
        Cookies.remove('cart')
        Cookies.remove('firstname')
        Cookies.remove('lastname')
        Cookies.remove('address')
        Cookies.remove('address2')
        Cookies.remove('zip')
        Cookies.remove('city')
        Cookies.remove('country')
        Cookies.remove('phone')       
        
        signOut();
        // router.reload()
        // Cookies.remove('token')
    }



    return (

      <AuthContext.Provider value={{
          ...state,


          loginUser,
          registerUser,
          logout
      }}>

        { children }

      </AuthContext.Provider>

    )
}