import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../../services/RoomService';

export const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingImages, setUploadingImages] = useState(false);

  const [room, setRoom] = useState({
    roomNumber: '',
    type: 'SINGLE',
    pricePerNight: '',
    description: '',
    location: '',
    capacity: 1,
    amenities: [],
    isAvailable: true,
    images: []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  const availableAmenities = [
    "FREE_WIFI",
    "FREE_BREAKFAST", 
    "ROOM_SERVICE",
    "MOUNTAIN_VIEW",
    "POOL_ACCESS"
  ];

  const roomTypes = [
    'SINGLE',
    'DOUBLE', 
    'SUITE',
    'FAMILY'
  ];

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const roomData = await roomService.getRoomById(id);
        setRoom({
          ...roomData,
          amenities: roomData.amenities || [],
          images: roomData.images || []
        });
      } catch (error) {
        console.error('Error fetching room:', error);
        setMessage({
          type: 'error',
          text: 'Unable to load room information'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoom(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };

  const handleAmenityChange = (amenity) => {
    setRoom(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleUploadImages = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploadingImages(true);
      
      const updatedRoom = await roomService.addImagesToRoom(id, selectedFiles);
      
      setRoom(prev => ({
        ...prev,
        images: updatedRoom.images || []
      }));

      setSelectedFiles([]);
      
      setMessage({
        type: 'success',
        text: 'Images uploaded successfully!'
      });

    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to upload images'
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await roomService.deleteImage(id, imageId);
      
      setRoom(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
      
      setMessage({
        type: 'success',
        text: 'Image deleted successfully!'
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete image'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (!room.roomNumber.trim()) {
        throw new Error('Please enter room number');
      }

      if (!room.pricePerNight || room.pricePerNight <= 0) {
        throw new Error('Please enter valid room price');
      }

      if (!room.capacity || room.capacity <= 0) {
        throw new Error('Please enter valid capacity');
      }

      const roomData = {
        roomNumber: room.roomNumber,
        type: room.type,
        pricePerNight: Number(room.pricePerNight),
        description: room.description,
        location: room.location,
        capacity: Number(room.capacity),
        amenities: room.amenities,
        isAvailable: room.isAvailable
      };

      await roomService.updateRoom(id, roomData);

      setMessage({
        type: 'success',
        text: 'Room updated successfully!'
      });

      setTimeout(() => {
        navigate('/owner/list-room');
      }, 1500);

    } catch (error) {
      console.error('Error updating room:', error);
      setMessage({
        type: 'error',
        text: error.message || error.response?.data?.message || 'An error occurred while updating the room'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/owner/list-room');
  };

  const formatAmenityName = (amenity) => {
    const names = {
      'FREE_WIFI': 'Free WiFi',
      'FREE_BREAKFAST': 'Free Breakfast',
      'ROOM_SERVICE': 'Room Service',
      'MOUNTAIN_VIEW': 'Mountain View',
      'POOL_ACCESS': 'Pool Access'
    };
    return names[amenity] || amenity;
  };

  const formatRoomType = (type) => {
    const types = {
      'SINGLE': 'Single Room',
      'DOUBLE': 'Double Room', 
      'SUITE': 'Suite',
      'FAMILY': 'Family Room'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Edit Room
                </h1>
                <p className="text-blue-100 mt-1">
                  Update room information for {room.roomNumber}
                </p>
              </div>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-blue-100 border border-blue-300 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Number */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Number *
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={room.roomNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 101, 202A..."
                />
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  name="type"
                  value={room.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>
                      {formatRoomType(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night (VND) *
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={room.pricePerNight}
                  onChange={handleNumberChange}
                  required
                  min="0"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500000"
                />
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity (people) *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={room.capacity}
                  onChange={handleNumberChange}
                  required
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={room.location || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Floor 1, Area A..."
                />
              </div>

              {/* Availability */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={room.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Room available for booking
                </label>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={room.description || ''}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the room, view, special features..."
                />
              </div>

              {/* Amenities */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={room.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {formatAmenityName(amenity)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Images
                </label>
                
                {/* File upload section */}
                <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4"
                    >
                      Select Images
                    </label>
                    <p className="text-sm text-gray-500 mb-4">
                      Select multiple images to upload
                    </p>

                    {/* Selected files preview */}
                    {selectedFiles.length > 0 && (
                      <div className="w-full">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Selected Files ({selectedFiles.length})
                        </h4>
                        <div className="space-y-2 mb-4">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-sm text-gray-600 truncate flex-1">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSelectedFile(index)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleUploadImages}
                          disabled={uploadingImages}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {uploadingImages ? 'Uploading...' : 'Upload Images'}
                        </button>

                      </div>
                    )}
                  </div>
                </div>

                {/* Current images - SỬA LẠI PHẦN NÀY */}
                {room.images && room.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {room.images.map((image) => (
                      <div key={image.id} className="relative bg-gray-100 rounded-lg overflow-hidden">
                        {/* Ảnh */}
                        <img
                          src={`${import.meta.env.VITE_API_IMAGE_UPLOADS}/${image.image}`}
                          alt={image.name}
                          className="w-full h-32 object-cover"
                        
                        />
                        
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Delete image"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        
                        {/* Tên file */}
                        <div className="p-2 bg-white border-t border-gray-200">
                          <p className="text-xs text-gray-600 truncate">{image.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2">No images uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving || uploadingImages}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || uploadingImages}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Update Room
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};