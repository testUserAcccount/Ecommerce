import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Category } from '../types/category';
import { createCategory, getCategory, updateCategory } from '../services/categoryService';

const CategoryForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        categoryName: '',
        description: ''
    });

    useEffect(() => {
        if (id) {
            fetchCategory(parseInt(id));
        }
    }, [id]);

    const fetchCategory = async (categoryId: number) => {
        try {
            setLoading(true);
            const category = await getCategory(categoryId);
            setFormData({
                categoryName: category.categoryName,
                description: category.description || ''
            });
        } catch (err) {
            setError('Failed to load category');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (id) {
                await updateCategory(parseInt(id), formData);
            } else {
                await createCategory(formData);
            }
            navigate('/admin/categories');
        } catch (err) {
            setError('Failed to save category');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading && id) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body">
                            <h2 className="card-title mb-4">
                                {id ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="mb-3">
                                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="categoryName"
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-dark"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {id ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            id ? 'Update Category' : 'Create Category'
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger"
                                        onClick={() => navigate('/admin/categories')}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;