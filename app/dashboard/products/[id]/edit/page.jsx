'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUpload, FiSave, FiX, FiPlus, FiTrash } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Link from 'next/link';

const units = [
  { value: 'unit', label: 'יחידה' },
  { value: 'kg', label: 'ק"ג' },
  { value: 'gram', label: 'גרם' },
  { value: 'liter', label: 'ליטר' },
  { value: 'ml', label: 'מ"ל' },
  { value: 'box', label: 'קופסה' },
  { value: 'pack', label: 'חבילה' }
];

export default function EditProductPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    salePercentage: 0,
    stock: '',
    category: '',
    subcategory: '',
    images: [],
    isPopular: false,
    featuresHe: [],
    featuresAr: [],
    unit: 'unit',
    unitAmount: 1,
  });

  const [newFeature, setNewFeature] = useState({ he: '', ar: '' });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const product = await response.json();
      
      setFormData({
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        price: product.price,
        salePercentage: product.salePercentage || 0,
        stock: product.stock,
        category: product.category?._id || '',
        subcategory: product.subcategory || '',
        images: product.images || [],
        isPopular: product.isPopular || false,
        featuresHe: product.featuresHe || [],
        featuresAr: product.featuresAr || [],
        unit: product.unit || 'unit',
        unitAmount: product.unitAmount || 1,
      });

      if (product.category) {
        setSelectedCategory(product.category);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('טעינת המוצר נכשלה');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('טעינת הקטגוריות נכשלה');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find(cat => cat._id === categoryId);
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subcategory: '' // Reset subcategory when category changes
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.he || !newFeature.ar) {
      toast.error('יש להזין את המאפיין בעברית ובערבית');
      return;
    }

    setFormData(prev => ({
      ...prev,
      featuresHe: [...prev.featuresHe, newFeature.he],
      featuresAr: [...prev.featuresAr, newFeature.ar]
    }));

    setNewFeature({ he: '', ar: '' });
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      featuresHe: prev.featuresHe.filter((_, i) => i !== index),
      featuresAr: prev.featuresAr.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'נדרש שם בעברית';
    if (!formData.nameAr) newErrors.nameAr = 'נדרש שם בערבית';
    if (!formData.description) newErrors.description = 'נדרש תיאור בעברית';
    if (!formData.descriptionAr) newErrors.descriptionAr = 'נדרש תיאור בערבית';
    if (!formData.price) newErrors.price = 'נדרש מחיר';
    if (!formData.category) newErrors.category = 'נדרשת קטגוריה';
    // if (!formData.subcategory) newErrors.subcategory = 'נדרשת תת-קטגוריה';
    if (!formData.stock) newErrors.stock = 'נדרש מלאי';
    if (formData.images.length === 0) newErrors.images = 'נדרשת לפחות תמונה אחת';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const uploadErrors = [];

    try {
      const uploadPromises = files.map(async (file) => {
        try {
          // Add size validation
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error(`הקובץ ${file.name} גדול מדי (מקסימום 5MB)`);
          }

          // Add type validation
          if (!file.type.startsWith('image/')) {
            throw new Error(`הקובץ ${file.name} אינו תמונה`);
          }

          const url = await uploadToCloudinary(file);
          return url;
        } catch (error) {
          uploadErrors.push(`נכשלה העלאת ${file.name}: ${error.message}`);
          return null;
        }
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);

      if (uploadedUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));

        if (uploadErrors.length === 0) {
          toast.success('התמונות הועלו בהצלחה');
        } else {
          toast.warning('חלק מהתמונות לא הועלו');
          console.error('Upload errors:', uploadErrors);
        }
      } else {
        toast.error('לא הועלו תמונות');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('העלאת התמונות נכשלה');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      toast.success('המוצר עודכן בהצלחה');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'עדכון המוצר נכשל');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">טוען...</div>;
  }

  return (
    <div className="container mx-auto p-4" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">עריכת מוצר</h1>
          <Link
            href="/dashboard/products"
            className="text-gray-600 hover:text-gray-900"
          >
            <FiX className="w-6 h-6" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם המוצר
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                שם בערבית
              </label>
              <input
                type="text"
                name="nameAr"
                value={formData.nameAr}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.nameAr && <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור בעברית
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                תיאור בערבית
              </label>
              <textarea
                name="descriptionAr"
                value={formData.descriptionAr}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.descriptionAr && <p className="text-red-500 text-sm mt-1">{errors.descriptionAr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                קטגוריה
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">בחר קטגוריה</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {selectedCategory?.subcategories?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תת-קטגוריה (לא חובה)
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">{formData.subcategory ? 'הסר תת-קטגוריה' : 'בחר תת-קטגוריה'}</option>
                  {selectedCategory.subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מחיר
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
                step="0.01"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                אחוז הנחה
              </label>
              <input
                type="number"
                name="salePercentage"
                value={formData.salePercentage}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                יחידת מידה
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כמות יחידות במוצר
              </label>
              <input
                type="number"
                name="unitAmount"
                value={formData.unitAmount}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מלאי
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                min="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Features Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              מאפיינים (לא חובה)
            </label>
            
            {/* Add New Feature */}
            <div className="flex gap-4 items-end mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">מאפיין בעברית</label>
                <input
                  type="text"
                  value={newFeature.he}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, he: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="הכנס מאפיין בעברית"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">מאפיין בערבית</label>
                <input
                  type="text"
                  value={newFeature.ar}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, ar: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="הכנס מאפיין בערבית"
                />
              </div>
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>

            {/* Features List */}
            {formData.featuresHe.length > 0 && (
              <div className="space-y-2">
                {formData.featuresHe.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex gap-4">
                      <span>{feature}</span>
                      <span className="text-gray-300">|</span>
                      <span dir="rtl">{formData.featuresAr[index]}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              תמונות
            </label>
            
            {/* Image Upload */}
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <label className="flex-1">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      multiple
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={uploadingImages}
                    />
                    <div className="h-32 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center bg-white hover:bg-blue-50 transition-colors">
                      <div className="text-center">
                        <FiUpload className="mx-auto h-8 w-8 text-blue-500" />
                        <span className="mt-2 block text-sm text-gray-600">
                          לחץ להעלאת תמונות
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          PNG, JPG עד 5MB
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
                {uploadingImages && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                    <span className="mr-2 text-sm text-gray-600">מעלה...</span>
                  </div>
                )}
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>

            {/* Images Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group aspect-square border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`Product image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiTrash className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        תמונה ראשית
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 ml-2"
            />
            <label className="text-sm font-medium text-gray-700">
              מוצר פעיל
            </label>
          </div> */}

          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/products"
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              ביטול
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <FiSave />
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  מעדכן...
                </>
              ) : (
                'שמור שינויים'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 