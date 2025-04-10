import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { Category } from '../types/category';
import { toast } from 'react-toastify';
import '../assets/styles/ProductForm.css';


interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryID: number;
    image?: FileList;
}

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, formState: { errors, isDirty }, setValue, reset, watch } = useForm<ProductFormData>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stockQuantity: 0,
            categoryID: 0
        }
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const navigate = useNavigate();
    
    // Warn about unsaved changes
    const formValues = watch();
    const formIsDirty = isDirty || (previewImage && !previewImage.startsWith('http'));

    // Custom hook to show prompt when navigating away with unsaved changes
    // Note: usePrompt is not available in React Router v6, you would need to implement a custom solution
    // This is a placeholder to show the concept
    // usePrompt('You have unsaved changes. Are you sure you want to leave?', formIsDirty);
    
    // Fetch categories when component mounts
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (err) {
                setError('Failed to load categories');
                console.error(err);
            }
        };
        
        loadCategories();
        
        // If editing, load product data
        if (id) {
            loadProductData(parseInt(id));
        }
    }, [id]);
    
    const loadProductData = async (productId: number) => {
        setLoading(true);
        try {
            const product = await getProductById(productId);
            setValue('name', product.name);
            setValue('description', product.description);
            setValue('price', product.price);
            setValue('stockQuantity', product.stockQuantity);
            setValue('categoryID', product.categoryID || 0);
            
            if (product.imageURL) {
                setPreviewImage(product.imageURL);
            }
            
            setLoading(false);
            // Reset the dirty state after loading data
            reset({
                name: product.name,
                description: product.description,
                price: product.price,
                stockQuantity: product.stockQuantity,
                categoryID: product.categoryID
            });
        } catch (err) {
            setError('Failed to load product data');
            console.error(err);
            setLoading(false);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('price', data.price.toString());
            formData.append('stockQuantity', data.stockQuantity.toString());
            formData.append('categoryID', data.categoryID.toString());
            
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }

            if (id) {
                await updateProduct(parseInt(id), formData);
                toast.success(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="bi bi-check-circle me-2"></i>
                        <div>Product updated successfully!</div>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 3000,
                        style: {
                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                            color: 'white'
                        }
                    }
                );
            } else {
                await createProduct(formData);
                toast.success(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <i className="bi bi-check-circle me-2"></i>
                        <div>Product created successfully!</div>
                    </div>,
                    {
                        position: "top-right",
                        autoClose: 3000,
                        style: {
                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                            color: 'white'
                        }
                    }
                );
            }
            
            navigate('/admin/products');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save product';
            setError(errorMessage);
            toast.error(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i className="bi bi-exclamation-circle me-2"></i>
                    <div>{errorMessage}</div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 5000,
                    style: {
                        background: '#dc3545',
                        color: 'white'
                    }
                }
            );
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        if (formIsDirty && !window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
        navigate('/admin/products');
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <p className="text-center mt-2">Loading product data...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{
                                color: '#1e2a3a',
                                position: 'relative',
                                paddingBottom: '15px'
                            }}>
                                {id ? 'Edit Product' : 'Add New Product'}
                                <div style={{
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '60px',
                                    height: '3px',
                                    background: 'linear-gradient(to right, #1e2a3a, #2d4356)'
                                }}></div>
                            </h2>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                                <div className="mb-4">
                                    <label htmlFor="name" className="form-label fw-bold">Product Name</label>
                                    <input
                                        type="text"
                                        className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        {...register('name', { required: 'Product name is required' })}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #ced4da'
                                        }}
                                    />
                                    {errors.name && (
                                        <div className="invalid-feedback">{errors.name.message}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="form-label fw-bold">Description</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="description"
                                        rows={4}
                                        {...register('description', { required: 'Description is required' })}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #ced4da',
                                            resize: 'vertical'
                                        }}
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">{errors.description.message}</div>
                                    )}
                                </div>

                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="price" className="form-label fw-bold">Price</label>
                                        <div className="input-group">
                                            <span className="input-group-text" style={{
                                                background: '#1e2a3a',
                                                color: 'white',
                                                border: 'none'
                                            }}>₹</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className={`form-control form-control-lg ${errors.price ? 'is-invalid' : ''}`}
                                                id="price"
                                                {...register('price', { 
                                                    required: 'Price is required',
                                                    min: { value: 0.01, message: 'Price must be greater than 0' }
                                                })}
                                                style={{ borderRadius: '0 8px 8px 0' }}
                                            />
                                        </div>
                                        {errors.price && (
                                            <div className="invalid-feedback d-block">{errors.price.message}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="stockQuantity" className="form-label fw-bold">Stock Quantity</label>
                                        <input
                                            type="number"
                                            className={`form-control form-control-lg ${errors.stockQuantity ? 'is-invalid' : ''}`}
                                            id="stockQuantity"
                                            {...register('stockQuantity', { 
                                                required: 'Stock quantity is required',
                                                min: { value: 0, message: 'Stock quantity cannot be negative' }
                                            })}
                                            style={{
                                                borderRadius: '8px',
                                                border: '1px solid #ced4da'
                                            }}
                                        />
                                        {errors.stockQuantity && (
                                            <div className="invalid-feedback">{errors.stockQuantity.message}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="categoryID" className="form-label fw-bold">Category</label>
                                    <select
                                        className={`form-control form-control-lg ${errors.categoryID ? 'is-invalid' : ''}`}
                                        id="categoryID"
                                        {...register('categoryID', { required: 'Category is required' })}
                                        style={{
                                            borderRadius: '8px',
                                            border: '1px solid #ced4da'
                                        }}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category.categoryID} value={category.categoryID}>
                                                {category.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryID && (
                                        <div className="invalid-feedback">{errors.categoryID.message}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="image" className="form-label fw-bold">Product Image</label>
                                    <div className="custom-file-upload" style={{
                                        border: '2px dashed #ced4da',
                                        borderRadius: '8px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        backgroundColor: '#f8f9fa',
                                        cursor: 'pointer'
                                    }}>
                                        <input
                                            type="file"
                                            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                            id="image"
                                            accept="image/*"
                                            {...register('image')}
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="image" style={{ cursor: 'pointer', margin: 0 }}>
                                            <i className="bi bi-cloud-upload fs-3 mb-2"></i>
                                            <div>Drag and drop an image or click to select</div>
                                            <small className="text-muted">
                                                Recommended: 800x600px (Max: 5MB)
                                            </small>
                                        </label>
                                    </div>
                                    {errors.image && (
                                        <div className="invalid-feedback d-block">{errors.image.message}</div>
                                    )}
                                    
                                    {previewImage && (
                                        <div className="mt-3 text-center">
                                            <img 
                                                src={previewImage.startsWith('data:') ? previewImage : `${process.env.REACT_APP_API_URL || 'http://localhost:5288'}${previewImage}`} 
                                                alt="Product preview" 
                                                className="img-thumbnail"
                                                style={{
                                                    maxHeight: '200px',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex gap-3 mt-5">
                                    <button 
                                        type="submit" 
                                        className="btn btn-lg flex-grow-1"
                                        disabled={submitting}
                                        style={{
                                            background: 'linear-gradient(to right, #1e2a3a, #2d4356)',
                                            color: 'white',
                                            border: 'none',
                                            transition: 'opacity 0.3s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                {id ? 'Updating Product...' : 'Adding Product...'}
                                            </>
                                        ) : id ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-lg btn-outline-secondary"
                                        onClick={handleCancel}
                                        disabled={submitting}
                                        style={{
                                            borderRadius: '8px',
                                            transition: 'all 0.3s'
                                        }}
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

export default ProductForm;