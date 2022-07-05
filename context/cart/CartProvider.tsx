import { FC, ReactNode, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie'
import { jvcApi } from '../../api';
import { IOrder } from '../../interfaces/order';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAdress?: ShippingAddress;
}

export interface ShippingAddress {

  firstname: string;
  lastname: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;

}

interface Props {
   children?: ReactNode
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAdress: undefined
}


export const CartProvider:FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer , CART_INITIAL_STATE);

    useEffect(() => {
      
      try {
          const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): []
          dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProducts });
      } catch (error) {
          dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] });
      }

    },[]);

        
    useEffect(() => {
      Cookie.set('cart', JSON.stringify( state.cart ));
    }, [state.cart]);



    useEffect( () => {

      if( Cookie.get('firstname') ){
        
        const shippingAddress = {
          firstname: Cookie.get('firstname') || '',
          lastname: Cookie.get('lastname') || '',
          address: Cookie.get('address') || '',
          address2: Cookie.get('address2') || '',
          zip: Cookie.get('zip') || '',
          city: Cookie.get('city') || '',
          country: Cookie.get('country') || '',
          phone: Cookie.get('phone') || '',
        }
  
        dispatch({ type: '[Cart] - LoadAddress from cookies', payload: shippingAddress })
      
      }

    },[])


    
    useEffect( () => {
      
      const numberOfItems = state.cart.reduce( (prev, current) => current.quantity + prev, 0)
      const subTotal = state.cart.reduce( (prev, current) => (current.price * current.quantity) + prev, 0 )
      const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE);

      const orderSummary = {
        numberOfItems,
        subTotal,
        tax: subTotal * taxRate,
        total: subTotal * ( taxRate + 1 )
      }

      dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })

    },[state.cart])




    const addProductToCart = ( product: ICartProduct ) => {
      // dispatch({ type: '[Cart] - Add Product', payload: product })
      
      const productInCart = state.cart.some( p => p.id === product.id )
      if( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product] })       
      
      const productInCartButDifferentSize = state.cart.some( p => p.id === product.id && p.size === product.size )
      if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product] })       
    
      const updatedProducts = state.cart.map( p => {
        
        if( p.id !== product.id ) return p;
        if( p.size !== product.size ) return p;

        p.quantity += product.quantity;
        return p;
      })

      dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts })
    }

    const updateCartQuantity = ( product: ICartProduct ) => {
      dispatch({ type: '[Cart] - Change cart product quantity', payload: product })
    }

    const removeCartProduct = ( product: ICartProduct ) => {

      dispatch({ type: '[Cart] - Remove product in cart', payload: product})
    }

    const updateAddress = ( address: ShippingAddress ) => {
      
      Cookie.set('firstname', address.firstname)
      Cookie.set('lastname', address.lastname)
      Cookie.set('address', address.address)
      Cookie.set('address2', address.address2 || '')
      Cookie.set('zip', address.zip)
      Cookie.set('city', address.city)
      Cookie.set('country', address.country)
      Cookie.set('phone', address.phone)


      dispatch({ type: '[Cart] - Update address', payload: address })
    }


    const createOrder = async (): Promise<{ hasError: boolean; message: string;}> => {

      if( !state.shippingAdress ){
        throw new Error('No hay direccion de entrega')
      }

      const body: IOrder = {

          orderItems: state.cart.map( p => ({
            ...p,
            size: p.size!
            })
          ),

          shippingAddress: state.shippingAdress,
          numberOfItems: state.numberOfItems,
          subTotal: state.subTotal,
          tax: state.tax,
          total: state.total,
          isPaid: false
      }

      try {
        
        const { data } = await jvcApi.post<IOrder>('/orders', body);
        dispatch({ type: '[Cart] - Order complete' })
        
        return {
          hasError: false,
          message: data.id!
        }

      } catch (error) {

        if(axios.isAxiosError(error)){
          
          const { message }: any = error.response?.data
          return {
            hasError: true,
            message
          }
        }

        return {
          hasError: true,
          message: 'Error importante, contacte al administrador'
        }

      }
    }

    return (

      <CartContext.Provider value={{
          ...state,


          addProductToCart,
          updateCartQuantity,
          removeCartProduct,
          updateAddress,

          createOrder
      }}>

        { children }

      </CartContext.Provider>

    )
}