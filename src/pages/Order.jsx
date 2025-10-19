import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Check, X, Clock, Package, ChevronDown, Calendar, User, Home, DollarSign } from 'lucide-react';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockOrders = [
                {
                    id: 1,
                    userId: 1,
                    userName: "Nguyễn Văn A",
                    userEmail: "nguyenvana@email.com",
                    roomId: 5,
                    roomNumber: "301",
                    roomType: "Suite",
                    hotelName: "Sunrise Hotel",
                    checkIn: "2025-11-01",
                    checkOut: "2025-11-05",
                    totalPrice: 500.00,
                    status: "PENDING",
                    createdAt: "2025-10-19T10:30:00",
                    updatedAt: "2025-10-19T10:30:00"
                },
                {
                    id: 2,
                    userId: 2,
                    userName: "Trần Thị B",
                    userEmail: "tranthib@email.com",
                    roomId: 3,
                    roomNumber: "205",
                    roomType: "Double",
                    hotelName: "Ocean View Hotel",
                    checkIn: "2025-11-10",
                    checkOut: "2025-11-15",
                    totalPrice: 750.00,
                    status: "CONFIRMED",
                    createdAt: "2025-10-19T11:00:00",
                    updatedAt: "2025-10-19T11:30:00"
                },
                {
                    id: 3,
                    userId: 1,
                    userName: "Nguyễn Văn A",
                    userEmail: "nguyenvana@email.com",
                    roomId: 7,
                    roomNumber: "102",
                    roomType: "Single",
                    hotelName: "City Center Hotel",
                    checkIn: "2025-12-01",
                    checkOut: "2025-12-03",
                    totalPrice: 300.00,
                    status: "COMPLETED",
                    createdAt: "2025-10-19T12:00:00",
                    updatedAt: "2025-10-19T12:30:00"
                },
                {
                    id: 4,
                    userId: 3,
                    userName: "Lê Văn C",
                    userEmail: "levanc@email.com",
                    roomId: 2,
                    roomNumber: "401",
                    roomType: "Family",
                    hotelName: "Mountain Resort",
                    checkIn: "2025-11-20",
                    checkOut: "2025-11-25",
                    totalPrice: 850.00,
                    status: "CANCELLED",
                    createdAt: "2025-10-19T13:00:00",
                    updatedAt: "2025-10-19T13:30:00"
                },
                {
                    id: 5,
                    userId: 4,
                    userName: "Phạm Thị D",
                    userEmail: "phamthid@email.com",
                    roomId: 9,
                    roomNumber: "503",
                    roomType: "Suite",
                    hotelName: "Luxury Grand Hotel",
                    checkIn: "2025-10-25",
                    checkOut: "2025-10-28",
                    totalPrice: 1200.00,
                    status: "PENDING",
                    createdAt: "2025-10-19T14:00:00",
                    updatedAt: "2025-10-19T14:00:00"
                }
            ];
            setOrders(mockOrders);
            setFilteredOrders(mockOrders);
            setIsLoading(false);
        }, 1000);
    };

    useEffect(() => {
        filterOrders();
    }, [selectedStatus, searchTerm, orders]);

    const filterOrders = () => {
        let filtered = orders;

        // Filter by status
        if (selectedStatus !== 'ALL') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.roomNumber.includes(searchTerm) ||
                order.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toString().includes(searchTerm)
            );
        }

        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const updatedOrders = orders.map(order =>
                order.id === orderId
                    ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
                    : order
            );
            setOrders(updatedOrders);
            setIsLoading(false);
            setShowModal(false);
            setSelectedOrder(null);
        }, 500);
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
            COMPLETED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            PENDING: <Clock className="w-4 h-4" />,
            CONFIRMED: <Check className="w-4 h-4" />,
            COMPLETED: <Package className="w-4 h-4" />,
            CANCELLED: <X className="w-4 h-4" />
        };
        return icons[status];
    };

    const getStatusText = (status) => {
        const texts = {
            PENDING: 'Chờ duyệt',
            CONFIRMED: 'Đã xác nhận',
            COMPLETED: 'Hoàn thành',
            CANCELLED: 'Đã hủy'
        };
        return texts[status];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn đặt phòng</h1>
                    <p className="text-gray-600">Xem và quản lý tất cả các đơn đặt phòng trong hệ thống</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Tổng đơn</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                            </div>
                            <Check className="w-8 h-8 text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <Package className="w-8 h-8 text-green-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Đã hủy</p>
                                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                            </div>
                            <X className="w-8 h-8 text-red-400" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, email, phòng, khách sạn..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2">
                            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStatus === status
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status === 'ALL' ? 'Tất cả' : getStatusText(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Không tìm thấy đơn đặt phòng nào</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Mã đơn
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Khách hàng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Khách sạn & Phòng
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày đặt
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tổng tiền
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                                <div className="text-xs text-gray-500">{formatDateTime(order.createdAt)}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                                                        <div className="text-xs text-gray-500">{order.userEmail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{order.hotelName}</div>
                                                <div className="text-xs text-gray-500">Phòng {order.roomNumber} - {order.roomType}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(order.checkIn)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {formatDate(order.checkOut)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {calculateNights(order.checkIn, order.checkOut)} đêm
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{formatPrice(order.totalPrice)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Chi tiết
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Chi tiết đơn đặt phòng #{selectedOrder.id}</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedOrder(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Trạng thái</span>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusIcon(selectedOrder.status)}
                                    {getStatusText(selectedOrder.status)}
                                </span>
                            </div>

                            {/* Customer Info */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Thông tin khách hàng
                                </h3>
                                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Họ tên:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedOrder.userName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Email:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedOrder.userEmail}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">ID khách hàng:</span>
                                        <span className="text-sm font-medium text-gray-900">#{selectedOrder.userId}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hotel & Room Info */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Home className="w-5 h-5" />
                                    Thông tin khách sạn & phòng
                                </h3>
                                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Khách sạn:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedOrder.hotelName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Số phòng:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedOrder.roomNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Loại phòng:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedOrder.roomType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">ID phòng:</span>
                                        <span className="text-sm font-medium text-gray-900">#{selectedOrder.roomId}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Info */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    Thông tin đặt phòng
                                </h3>
                                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Ngày nhận phòng:</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDate(selectedOrder.checkIn)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Ngày trả phòng:</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDate(selectedOrder.checkOut)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Số đêm:</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {calculateNights(selectedOrder.checkIn, selectedOrder.checkOut)} đêm
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-200">
                                        <span className="text-sm text-gray-600">Ngày tạo đơn:</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDateTime(selectedOrder.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDateTime(selectedOrder.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Thông tin thanh toán
                                </h3>
                                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold text-gray-900">Tổng tiền:</span>
                                        <span className="font-bold text-blue-600">{formatPrice(selectedOrder.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {selectedOrder.status === 'PENDING' && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Duyệt đơn đặt phòng</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Check className="w-5 h-5" />
                                            Xác nhận đơn
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                            Từ chối đơn
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.status === 'CONFIRMED' && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cập nhật trạng thái</h3>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'COMPLETED')}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Package className="w-5 h-5" />
                                            Hoàn thành đơn
                                        </button>
                                        <button
                                            onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                            Hủy đơn
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order;