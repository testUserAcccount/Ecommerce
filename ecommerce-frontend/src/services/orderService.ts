import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';
const API_URL = `${API_BASE_URL}/api/orders`;

export interface OrderItem {
    orderItemID: number;
    orderID: number;
    productID: number;
    quantity: number;
    price: number;
    product: {
        productID: number;
        name: string;
        price: number;
        imageURL?: string;
    };
}

export interface Order {
    orderID: number;
    userID: number;
    orderStatus: string;
    totalAmount: number;
    orderDate: string;
    orderItems: OrderItem[];
    user: {
        userID: number;
        firstName: string;
        lastName: string;
        email: string;
        address?: string;
        phoneNumber?: string;
    };
}

export const checkout = async (userId: number, paymentMethod: string): Promise<{ orderId: number }> => {
    const response = await axios.post(`${API_URL}/checkout`, {
        userId,
        paymentMethod
    });
    return response.data;
};

export const getOrderDetails = async (orderId: number): Promise<Order> => {
    const response = await axios.get(`${API_URL}/${orderId}`);
    return response.data;
};

export const getUserOrders = async (userId: number): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
};