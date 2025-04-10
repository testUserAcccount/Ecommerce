import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types/category';
import { getCategories, deleteCategory } from '../services/categoryService';

const AdminCategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to load categories');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this category? This action cannot be undone if the category has no products.')) {
            setDeletingId(id);
            try {
                await deleteCategory(id);
                setCategories(categories.filter(category => category.categoryID !== id));
            } catch (err) {
                setError('Failed to delete category. Make sure it has no associated products.');
                console.error('Error:', err);
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Category Management</h2>
                <Link to="/admin/categories/add" className="btn btn btn-sm btn-outline-dark">
                    <i className="bi bi-plus-lg me-2"></i>Add New Category
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
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.categoryID}>
                                <td>{category.categoryID}</td>
                                <td>{category.categoryName}</td>
                                <td>{category.description}</td>
                                <td>
                                    <div className="btn-group">
                                        <Link 
                                            to={`/admin/categories/edit/${category.categoryID}`}
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            Edit
                                        </Link>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(category.categoryID)}
                                            disabled={deletingId === category.categoryID}
                                        >
                                            {deletingId === category.categoryID ? 'Deleting...' : 'Delete'}
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

export default AdminCategoryList;