import { Product } from './product';

export interface CartProduct {
    productID: number;
    name: string;
    price: number;
    imageURL?: string;
}

export interface CartItem {
    cartItemID: number;
    cartID: number;
    productID: number;
    quantity: number;
    addedAt: string;
    product: CartProduct;
}

export interface Cart {
    cartID: number;
    userID: number;
    createdAt: string;
    cartItems: CartItem[];
}