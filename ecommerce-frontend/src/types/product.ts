export interface Product {
    productID: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryID?: number;
    imageURL?: string;
    createdAt: string;
}