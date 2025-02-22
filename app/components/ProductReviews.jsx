'use client';
import { useState, useEffect } from 'react';
import { FiStar, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function ProductReviews({ productId }) {
  const [isClient, setIsClient] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: '',
  });

  useEffect(() => {
    setIsClient(true);
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      // Handle empty reviews array
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Set empty array instead of showing error
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      const data = await response.json();
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '', name: '' });
      toast.success('تم إضافة التقييم بنجاح');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('فشل إضافة التقييم');
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">التقييمات</h2>
      
      {/* Review Form */}
      <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-4">أضف تقييمك</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">التقييم</label>
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                className={`p-2 ${
                  newReview.rating >= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <FiStar className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">الاسم</label>
          <input
            type="text"
            value={newReview.name}
            onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">التعليق</label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            className="w-full p-2 border rounded-lg h-24"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
        >
          إرسال التقييم
        </button>
      </form>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-4">جاري التحميل...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">{review.name}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
        </div>
      )}
    </div>
  );
} 