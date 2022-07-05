
import { createContext } from 'react'; 
import { ICartProduct } from '../../interfaces/cart';
import { ShippingAddress } from './';

interface ContextProps {
   isLoaded: boolean;
   cart: ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;
   shippingAdress?: ShippingAddress;
   
   addProductToCart: (product: ICartProduct) => void
   updateCartQuantity: (product: ICartProduct) => void
   removeCartProduct: (product: ICartProduct) => void
   updateAddress: (address: ShippingAddress) => void

   createOrder: () => Promise<{ hasError: boolean; message: string;}>
}

export const CartContext = createContext( {} as ContextProps );