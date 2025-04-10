import axios from 'axios';
import { Product } from '../types/product';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';
const API_URL = `${API_BASE_URL}/api/products`;

const axiosInstance = axios.create({
    baseURL: API_URL,
});

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosInstance.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const createProduct = async (formData: FormData): Promise<Product> => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id: number, formData: FormData): Promise<void> => {
    try {
        await axios.put(`${API_URL}/${id}`, formData);
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/${id}`);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};