import { FC, ReactNode, useEffect, useReducer } from 'react';
import { ICartProduct } from '../../interfaces/cart';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie'

export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

interface Props {
   children?: ReactNode
}


const CART_INITIAL_STATE: CartState = {
    cart: Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0
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

      console.log(orderSummary);
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

    return (

      <CartContext.Provider value={{
          ...state,


          addProductToCart,
          updateCartQuantity,
          removeCartProduct
      }}>

        { children }

      </CartContext.Provider>

    )
}