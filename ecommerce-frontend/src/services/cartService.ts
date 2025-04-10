import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';
const API_URL = `${API_BASE_URL}/api/cart`;

export interface CartItem {
  cartItemID: number;
  cartID: number;
  productID: number;
  quantity: number;
  addedAt: string;
  product: {
    productID: number;
    name: string;
    price: number;
    imageURL?: string;
  };
}

export interface Cart {
  cartID: number;
  userID: number;
  createdAt: string;
  cartItems: CartItem[];
}

export const getUserCart = async (userId: number): Promise<Cart> => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const addToCart = async (userId: number, productId: number, quantity: number): Promise<void> => {
  await axios.post(`${API_URL}/items`, {
    userId,
    productId,
    quantity
  });
};

export const updateCartItem = async (cartItemId: number, quantity: number): Promise<void> => {
  await axios.put(`${API_URL}/items/${cartItemId}`, {
    CartItemId: cartItemId,  // Changed from cartItemId to CartItemId
    Quantity: quantity      // Changed from quantity to Quantity
  });
};

export const removeFromCart = async (cartItemId: number): Promise<void> => {
  await axios.delete(`${API_URL}/items/${cartItemId}`);
};

export const clearCart = async (cartId: number): Promise<void> => {
  await axios.delete(`${API_URL}/${cartId}/clear`);
};