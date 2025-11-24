import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Star, ArrowLeft, Send, CheckCircle, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import reviewService from '../services/reviewService';
import axios from 'axios';
import axiosInstance from '../api/config/axiosInstance';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const location = useLocation();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  

  useEffect(() => {
    if (location.state) {
      setRoomInfo(location.state);
      
    } else {
      console.log('No state provided, bookingId:', bookingId);
      toast.error('Thông tin đặt phòng không hợp lệ');
      navigate('/my-booking');
    }
  }, [location.state, bookingId, navigate]);


  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      const reviewData = {
        userId: userId,
        roomId: roomInfo?.roomId,
        rating: rating,
        comment: comment.trim()
      };
      console.log(userId)
      console.log(roomInfo?.roomId)

      let response;
  
      if (isEditing && existingReview) {
        response = await reviewService.updateReview(existingReview.id, reviewData);
        toast.success('Đánh giá của bạn đã được cập nhật thành công!');
      } else {
        response = await reviewService.submitReview(reviewData);
        toast.success('Đánh giá của bạn đã được gửi thành công!');
      }

      console.log('Review submitted:', response);
      
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate('/my-booking');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || '');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isEditing ? 'Cập nhật thành công!' : 'Cảm ơn bạn!'}
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {isEditing 
                ? 'Đánh giá của bạn đã được cập nhật thành công.'
                : 'Đánh giá của bạn đã được gửi thành công.'
              }
            </p>
            <p className="text-gray-500 mb-8">
              Chúng tôi trân trọng sự đóng góp của bạn để cải thiện dịch vụ.
            </p>
            <button
              onClick={() => navigate('/my-booking')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Quay lại đặt phòng của tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá trải nghiệm của bạn'}
            </h1>
            {existingReview && !isEditing && (
              <button
                onClick={handleEditToggle}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Chỉnh sửa
              </button>
            )}
          </div>
          
          <p className="text-gray-600">
            {isEditing 
              ? 'Cập nhật đánh giá của bạn để giúp chúng tôi cải thiện dịch vụ tốt hơn.'
              : 'Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ và giúp những khách hàng khác có được lựa chọn tốt nhất.'
            }
          </p>
        </div>

        {roomInfo && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Thông tin đặt phòng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phòng</p>
                <p className="font-semibold text-gray-900">Room {roomInfo.roomName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mã đặt phòng</p>
                <p className="font-semibold text-gray-900">#{bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày nhận phòng</p>
                <p className="font-semibold text-gray-900">{roomInfo.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày trả phòng</p>
                <p className="font-semibold text-gray-900">{roomInfo.checkOut}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                Bạn đánh giá trải nghiệm này như thế nào?
              </label>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!isEditing && existingReview}
                    className={`p-2 transition-all duration-200 transform hover:scale-110 ${
                      (hoverRating || rating) >= star 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    } ${(!isEditing && existingReview) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                  >
                    <Star 
                      className="w-12 h-12" 
                      fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-gray-600">
                  {rating === 0 ? 'Chọn số sao' : 
                   rating === 1 ? 'Rất tệ' :
                   rating === 2 ? 'Tệ' :
                   rating === 3 ? 'Bình thường' :
                   rating === 4 ? 'Tốt' : 'Rất tốt'}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <label htmlFor="comment" className="block text-lg font-semibold text-gray-900 mb-4">
                Chia sẻ chi tiết trải nghiệm của bạn
              </label>
              
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Hãy chia sẻ những điều bạn thích về phòng, dịch vụ, hoặc những gì chúng tôi có thể cải thiện..."
                className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                maxLength={1000}
                disabled={!isEditing && existingReview}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  Đánh giá của bạn sẽ được hiển thị công khai
                </span>
                <span className={`text-sm ${
                  comment.length > 800 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {comment.length}/1000
                </span>
              </div>
            </div>

            {!existingReview || isEditing ? (
              <>
                <div className="bg-blue-50 rounded-xl p-4 mb-8">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    💡 Mẹo viết đánh giá hữu ích:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Mô tả chi tiết về chất lượng phòng và dịch vụ</li>
                    <li>• Đề cập đến những điểm bạn ấn tượng hoặc cần cải thiện</li>
                    <li>• Đánh giá khách quan và trung thực</li>
                    <li>• Tránh sử dụng ngôn ngữ không phù hợp</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || !comment.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Đang cập nhật...' : 'Đang gửi...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {isEditing ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  Bạn đã đánh giá phòng này. Nhấn "Chỉnh sửa" để cập nhật đánh giá.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;