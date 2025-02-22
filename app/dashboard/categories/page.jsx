'use client';
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, categoryId: null });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    image: '',
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    nameAr: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('טעינת הקטגוריות נכשלה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory 
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      toast.success(editingCategory ? 'הקטגוריה עודכנה בהצלחה' : 'הקטגוריה נוספה בהצלחה');
      fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'שמירת הקטגוריה נכשלה');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || category.name,
      nameAr: category.nameAr,
      description: category.description || category.description,
      descriptionAr: category.descriptionAr,
      image: category.image,
      subcategories: category.subcategories || []
    });
    setShowForm(true);
  };

  const handleDelete = (categoryId) => {
    setDeleteModal({ isOpen: true, categoryId });
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/categories/${deleteModal.categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      toast.success('تم حذف الفئة بنجاح');
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل في حذف الفئة');
    } finally {
      setDeleteModal({ isOpen: false, categoryId: null });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      image: '',
      subcategories: []
    });
    setNewSubcategory({
      name: '',
      nameAr: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.name || !newSubcategory.nameAr) {
      toast.error('יש למלא את שם תת-הקטגוריה בעברית ובערבית');
      return;
    }

    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { ...newSubcategory }]
    }));

    setNewSubcategory({
      name: '',
      nameAr: ''
    });
  };

  const handleRemoveSubcategory = (index) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      // Add size validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('הקובץ גדול מדי (מקסימום 5MB)');
      }

      // Add type validation
      if (!file.type.startsWith('image/')) {
        throw new Error('הקובץ חייב להיות תמונה');
      }

      const url = await uploadToCloudinary(file);
      setFormData(prev => ({
        ...prev,
        image: url
      }));
      toast.success('התמונה הועלתה בהצלחה');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'העלאת התמונה נכשלה');
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול קטגוריות</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-2"
        >
          <FiPlus />
          הוסף קטגוריה חדשה
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">שם בעברית</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">שם בערבית</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">תיאור בעברית</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">תיאור בערבית</label>
                <textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">תמונה (אופציונלי)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  {formData.image ? (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Category preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain"
                        priority
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md z-10"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="h-32 w-full border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="text-center">
                          <FiUpload className="mx-auto h-8 w-8 text-gray-400" />
                          <span className="mt-2 block text-sm text-gray-500">
                            לחץ להעלאת תמונה
                          </span>
                          <span className="mt-1 block text-xs text-gray-400">
                            PNG, JPG עד 5MB
                          </span>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  )}
                </div>
                {uploadingImage && (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                    <span className="mr-2 text-sm text-gray-500">מעלה...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Subcategories Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">תתי-קטגוריות</h3>
              
              {/* Add New Subcategory */}
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">שם בעברית</label>
                  <input
                    type="text"
                    value={newSubcategory.name}
                    onChange={(e) => setNewSubcategory(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">שם בערבית</label>
                  <input
                    type="text"
                    value={newSubcategory.nameAr}
                    onChange={(e) => setNewSubcategory(prev => ({ ...prev, nameAr: e.target.value }))}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  הוסף
                </button>
              </div>

              {/* Subcategories List */}
              {formData.subcategories.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-3">תתי-קטגוריות קיימות</h4>
                  <div className="space-y-2">
                    {formData.subcategories.map((sub, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex gap-4">
                          <span>{sub.name}</span>
                          {/* <span className="text-gray-500">|</span>
                          <span dir="rtl">{sub.nameAr}</span> */}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ביטול
              </button>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              >
                {editingCategory ? 'עדכן' : 'הוסף'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-300">
            {category.image && (
              <div className="relative h-48">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-contain"
                  priority
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              
              {/* Display Subcategories */}
              {category.subcategories?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">תתי-קטגוריות:</h4>
                  <div className="space-y-1">
                    {category.subcategories.map((sub, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {sub.name} 
                        {/* | {sub.nameAr} */}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-black hover:text-primary-dark"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={confirmDelete}
        title="מחיקת קטגוריה"
        message="האם אתה בטוח שברצונך למחוק קטגוריה זו? לא ניתן לבטל פעולה זו."
      />
    </div>
  );
} 