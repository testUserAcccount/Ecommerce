import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { getProducts, deleteProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5288';

const AdminProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const [productData, categoryData] = await Promise.all([
                getProducts(),
                getCategories()
            ]);
            setProducts(productData);
            setCategories(categoryData);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setDeletingId(id);
        try {
            await deleteProduct(id);
            await fetchData(); // Refresh the list
        } catch (err) {
            setError('Failed to delete product');
        } finally {
            setDeletingId(null);
        }
    };

    const getImageUrl = (imageURL: string | undefined) => {
        if (!imageURL) return 'https://via.placeholder.com/100';
        return imageURL.startsWith('/') ? `${API_BASE_URL}${imageURL}` : imageURL;
    };

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(c => c.categoryID === categoryId);
        return category ? category.categoryName : 'Unknown Category';
    };

    if (loading) {
        return <div className="d-flex justify-content-center mt-5">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Management</h2>
                <Link to="/admin/products/add" className="btn btn btn-sm btn-outline-dark">
                    <i className="bi bi-plus-lg me-2"></i>Add New Product
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.productID}>
                                <td style={{ width: '100px' }}>
                                    <img 
                                        src={getImageUrl(product.imageURL)} 
                                        alt={product.name}
                                        className="img-thumbnail"
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>Rs {product.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${
                                        product.stockQuantity > 10 ? 'bg-success' :
                                        product.stockQuantity > 0 ? 'bg-warning' :
                                        'bg-danger'
                                    }`}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td>{getCategoryName(product.categoryID || 0)}</td>
                                <td>
                                    <div className="btn-group">
                                        <Link 
                                            to={`/admin/products/edit/${product.productID}`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(product.productID)}
                                            disabled={deletingId === product.productID}
                                        >
                                            {deletingId === product.productID ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;