import React, { useState, useEffect } from "react";
import { X, Star, StarOff } from "lucide-react";
import { API_ENDPOINTS } from "../../../API_ENDPOINTS";

export default function RateUsModal({ closeModal, userId }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExistingReview();
  }, [userId]);

  const fetchExistingReview = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_ENDPOINTS.SYSTEM_REVIEW}/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setExistingReview(data);
        setRating(data.rating);
        setDescription(data.description);
      }
    } catch (err) {
      console.error("Error fetching existing review:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (description.trim() === "") {
      setError("Please provide feedback");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        user_id: userId,
        rating,
        description
      };

      const response = await fetch(API_ENDPOINTS.SYSTEM_REVIEW_, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      const data = await response.json();
      setSuccess(true);
      
      // Update the existing review in state
      setExistingReview({
        ...existingReview,
        rating,
        description
      });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            <span className="ml-3">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">
          {existingReview ? "Update Your Rating" : "Rate Your Experience"}
        </h2>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {existingReview ? "Your rating has been updated!" : "Thank you for your feedback!"}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-700 mb-2">How would you rate our service?</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  {(hoveredRating || rating) >= star ? (
                    <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <Star className="h-8 w-8 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 text-gray-600 font-medium">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
              Share your experience
            </label>
            <textarea
              id="feedback"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what you liked or what we can improve..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex justify-center items-center disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              existingReview ? "Update Rating" : "Submit Rating"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}