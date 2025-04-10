import axios from 'axios';
import { Category } from '../types/category';

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288/api/categories';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';
const API_URL = `${API_BASE_URL}/api/categories`;

const axiosInstance = axios.create({
    baseURL: API_URL,
});

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategory = async (id: number): Promise<Category> => {
    try {
        const response = await axiosInstance.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category:', error);
        throw error;
    }
};

export const createCategory = async (category: Omit<Category, 'categoryID'>): Promise<Category> => {
    try {
        // Transform the data to match backend property names
        const transformedData = {
            CategoryName: category.categoryName,
            Description: category.description
        };
        const response = await axiosInstance.post('', transformedData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<void> => {
    try {
        // Transform the data to match backend property names
        const transformedData = {
            Id: id,
            CategoryName: category.categoryName,
            Description: category.description
        };
        await axiosInstance.put(`/${id}`, transformedData);
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

export const deleteCategory = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/${id}`);
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
    }
};