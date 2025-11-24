import { useState, useEffect } from "react";
import { roomService } from "../../services/RoomService";
import { useNavigate } from "react-router-dom"; 

const ListRoom = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("roomNumber");
  const [sortOrder, setSortOrder] = useState("asc");
  const itemsPerPage = 8;

  const fetchRooms = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await roomService.getRooms({
        page: page - 1,
        size: itemsPerPage,
        search: searchTerm,
        sortBy,
        sortOrder,
      });

      console.log("API Response:", response);

      setRooms(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError("Không thể tải danh sách phòng");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, sortOrder]);

  const handleEditRoom = (roomId) => {
    navigate(`/owner/rooms/edit/${roomId}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchRooms(page);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSortDirectionToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Liên hệ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getSortDisplayName = () => {
    const sortNames = {
      roomNumber: "Số phòng",
      price: "Giá",
      capacity: "Sức chứa",
      createdAt: "Ngày tạo",
      type: "Loại phòng",
    };
    return sortNames[sortBy] || "Số phòng";
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹
      </button>,
    );

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
        >
          1
        </button>,
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2 text-gray-500">
            ...
          </span>,
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 leading-tight border border-gray-300 ${
            currentPage === i
              ? "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
              : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          {i}
        </button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2 text-gray-500">
            ...
          </span>,
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
        >
          {totalPages}
        </button>,
      );
    }

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ›
      </button>,
    );

    return pages;
  };

  if (loading && rooms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải danh sách phòng...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Danh Sách Phòng
        </h1>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
            <input
              type="text"
              placeholder="Tìm kiếm theo số phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex gap-2 items-center">
            <div className="text-sm text-gray-600 whitespace-nowrap">
              Đang sắp xếp theo:{" "}
              <span className="font-semibold">{getSortDisplayName()}</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="roomNumber">Số phòng</option>
              <option value="price">Giá</option>
              <option value="capacity">Sức chứa</option>
              <option value="type">Loại phòng</option>
              <option value="createdAt">Ngày tạo</option>
            </select>
            <button
              onClick={handleSortDirectionToggle}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-1"
            >
              <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              <span>{sortOrder === "asc" ? "Tăng" : "Giảm"}</span>
            </button>
          </div>
        </div>

        {loading && rooms.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-center">
            Đang tải dữ liệu...
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {rooms.length === 0 && !loading ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              Không có phòng nào được tìm thấy
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortBy("roomNumber");
                setSortOrder("asc");
                fetchRooms(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Hiển thị tất cả phòng
            </button>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 bg-gray-200">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={`${import.meta.env.VITE_API_IMAGE_UPLOADS}/${room.images[0].image}`}
                    alt={room.roomNumber}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/300/200";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <span>Chưa có ảnh</span>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      room.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.isAvailable ? "Có sẵn" : "Đã thuê"}
                  </span>
                </div>
                
                {/* Thêm nút chỉnh sửa ở góc trên bên trái */}
                <button
                  onClick={() => handleEditRoom(room.id)}
                  className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 group"
                  title="Chỉnh sửa phòng"
                >
                  <svg 
                    className="w-4 h-4 text-gray-600 group-hover:text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Phòng {room.roomNumber}
                </h3>
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  {room.type?.toLowerCase() || "Standard"}
                </p>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {room.description || "Không có mô tả"}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Giá:</span>
                    <span className="text-red-600 font-semibold">
                      {formatCurrency(room.pricePerNight)}/đêm
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Sức chứa:</span>
                    <span className="text-gray-900">{room.capacity} người</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!room.isAvailable}
                  >
                    {room.isAvailable ? "Đặt ngay" : "Đã hết"}
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalElements)} của{" "}
            {totalElements} phòng
          </div>

          <div className="flex items-center space-x-0">
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListRoom;