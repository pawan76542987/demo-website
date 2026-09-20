import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Star } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { reviewService } from '../../services/reviewService';

export const ReviewModal = ({
  isOpen,
  onClose,
  product,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.warning('Please provide a comment for your review');
      return;
    }

    try {
      setLoading(true);
      const res = await reviewService.createReview(product._id, {
        rating,
        title,
        comment
      });
      if (res.success) {
        toast.success('Thank you! Your verified review has been published.');
        if (onReviewSubmitted) onReviewSubmitted(res.review);
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Write a Product Review"
      subtitle={`Verified purchase review for ${product?.name || 'this item'}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Overall Rating (1 to 5 Stars)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 focus:outline-none transition transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-bold text-slate-700 ml-2">
              {rating} / 5 Stars
            </span>
          </div>
        </div>

        {/* Review Headline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Review Title / Headline
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Exceptional quality and super fast delivery!"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white outline-none transition"
          />
        </div>

        {/* Review Comments */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Your Detailed Feedback *
          </label>
          <textarea
            rows="4"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike about this product? How was the performance or fit?"
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:bg-white outline-none transition resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-sm"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
