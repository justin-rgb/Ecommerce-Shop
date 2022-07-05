import { ISize, IUser } from './';

export interface IOrder {

    id?             : string;
    orderId?        : number;
    user?           : IUser | string;
    orderItems      : IOrderItem[];
    shippingAddress : ShippingAddress;
    paymentResult?  : string;

    User? : IUserSecondary;

    numberOfItems   : number;
    subTotal        : number;
    tax             : number;
    total           : number;
    transactionId?  : string;


    isPaid          : boolean;
    paidAt?         : string;
    createdAt?       : string;
    updatedAt?       : string;
}


export interface IOrderItem {
    id       : number;
    title    : string;
    size     : ISize;
    quantity : number;
    slug     : string;
    image    : string;
    price    : number;
    gender   : string;
}


export interface ShippingAddress {
    firstname: string;
    lastname : string;
    address  : string;
    address2?: string;
    zip      : string;
    city     : string;
    country  : string;
    phone    : string;
}

export interface IUserSecondary {
    name: string;
    email: string;
}
