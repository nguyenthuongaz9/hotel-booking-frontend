import React, { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Edit, Trash2, User, Mail, Phone, Calendar, Shield, ChevronDown, Plus, X, Check, Clock, Building } from 'lucide-react';
import { userService } from '../../services/UserService';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    useEffect(() => {
        fetchUsers();
    }, [pagination.page, pagination.size]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getAllUsers(
                pagination.page, 
                pagination.size, 
                'createdAt', 
                'desc', 
                searchTerm
            );
            
            console.log('API Response:', response);
            
            if (response && response.content) {
                const formattedUsers = response.content.map(user => ({
                    id: user.id,
                    full_name: user.name || user.fullName || 'Chưa có tên',
                    email: user.email,
                    phone: user.phone || 'Chưa có số điện thoại',
                    role: user.role?.toLowerCase() || 'customer',
                    created_at: user.createdAt || user.createdDate || new Date().toISOString(),
                    updated_at: user.updatedAt || user.modifiedDate || new Date().toISOString()
                }));
                
                console.log('Formatted users:', formattedUsers);
                
                setUsers(formattedUsers);
                setFilteredUsers(formattedUsers);
                
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.totalPages || 0,
                    totalElements: response.totalElements || 0
                }));
            } else {
                console.log('No content in response');
                setUsers([]);
                setFilteredUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setFilteredUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterUsers = useCallback(() => {
        console.log('=== FILTER FUNCTION CALLED ===');
        console.log('Current users:', users.length);
        console.log('Selected role:', selectedRole);
        
        if (!users || users.length === 0) {
            console.log('No users available for filtering');
            setFilteredUsers([]);
            return;
        }

        let result;
        if (selectedRole === 'ALL') {
            result = [...users];
            console.log('Showing ALL users:', result.length);
        } else {
            result = users.filter(user => user.role === selectedRole);
            console.log(`Filtered by ${selectedRole}:`, result.length);
        }
        
        setFilteredUsers(result);
    }, [users, selectedRole]);

    useEffect(() => {
        console.log('=== FILTER EFFECT TRIGGERED ===');
        console.log('Users length:', users.length, 'Selected role:', selectedRole);
        filterUsers();
    }, [selectedRole, filterUsers]);

    useEffect(() => {
        console.log('=== USERS CHANGED EFFECT ===');
        console.log('New users length:', users.length);
        if (users.length > 0) {
            filterUsers();
        }
    }, [users, filterUsers]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '') {
                setPagination(prev => ({ ...prev, page: 0 }));
                fetchUsers();
            } else {
                setPagination(prev => ({ ...prev, page: 0 }));
                fetchUsers();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const deleteUser = async (userId) => {
        setIsLoading(true);
        try {
            await userService.deleteUser(userId);
            await fetchUsers();
            toast.success('Delete user successfully');
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Lỗi khi xóa người dùng: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = async (userData) => {
        setIsLoading(true);
        try {
            const apiData = {
                name: userData.full_name,
                phone: userData.phone,
                role: userData.role.toUpperCase()
            };

            await userService.updateUserAdmin(userData.id, apiData);
            
            toast.success('Update user successfully');
            await fetchUsers();
            setShowEditModal(false);
            setEditingUser(null);

        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Lỗi khi cập nhật người dùng: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const createUser = async (userData) => {
        setIsLoading(true);
        try {
            const apiData = {
                name: userData.full_name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role.toUpperCase(),
                password: userData.password
            };

            await userService.registerUser(apiData);
            
            await fetchUsers();
            setShowEditModal(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Lỗi khi tạo người dùng: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'bg-purple-100 text-purple-800 border-purple-200',
            customer: 'bg-blue-100 text-blue-800 border-blue-200',
            user: 'bg-blue-100 text-blue-800 border-blue-200',
            hotel_manager: 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getRoleIcon = (role) => {
        const icons = {
            admin: <Shield className="w-4 h-4" />,
            customer: <User className="w-4 h-4" />,
            user: <User className="w-4 h-4" />,
            hotel_manager: <Building className="w-4 h-4" />
        };
        return icons[role] || <User className="w-4 h-4" />;
    };

    const getRoleText = (role) => {
        const texts = {
            admin: 'Quản trị viên',
            customer: 'Khách hàng',
            user: 'Người dùng',
            hotel_manager: 'Quản lý khách sạn'
        };
        return texts[role] || role;
    };

    const formatDateTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const stats = {
        total: users.length,
        admin: users.filter(u => u.role === 'admin').length,
        customer: users.filter(u => u.role === 'customer' || u.role === 'user').length,
        hotel_manager: users.filter(u => u.role === 'hotel_manager').length,
        recent: users.filter(u => {
            try {
                const userDate = new Date(u.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return userDate > weekAgo;
            } catch (error) {
                return false;
            }
        }).length
    };

    const openEditModal = (user = null) => {
        setEditingUser(user);
        setShowEditModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            full_name: formData.get('full_name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            role: formData.get('role'),
        };

        if (editingUser) {
            userData.id = editingUser.id;
            updateUser(userData);
        } else {
            userData.password = formData.get('password');
            createUser(userData);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    console.log('=== RENDER STATE ===');
    console.log('Users:', users.length);
    console.log('Filtered Users:', filteredUsers.length);
    console.log('Selected Role:', selectedRole);
    console.log('Stats:', stats);

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 lg:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <div className="mb-4 lg:mb-0">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
                            <p className="text-gray-600">Quản lý và theo dõi tất cả người dùng trong hệ thống</p>
                        </div>
                       
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border-l-4 border-gray-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600 mb-1">Tổng người dùng</p>
                                <p className="text-lg lg:text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <User className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border-l-4 border-purple-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600 mb-1">Quản trị viên</p>
                                <p className="text-lg lg:text-2xl font-bold text-purple-600">{stats.admin}</p>
                            </div>
                            <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-purple-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border-l-4 border-blue-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600 mb-1">Khách hàng</p>
                                <p className="text-lg lg:text-2xl font-bold text-blue-600">{stats.customer}</p>
                            </div>
                            <User className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border-l-4 border-orange-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600 mb-1">Quản lý KS</p>
                                <p className="text-lg lg:text-2xl font-bold text-orange-600">{stats.hotel_manager}</p>
                            </div>
                            <Building className="w-6 h-6 lg:w-8 lg:h-8 text-orange-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 lg:p-6 border-l-4 border-green-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600 mb-1">Tuần này</p>
                                <p className="text-lg lg:text-2xl font-bold text-green-600">{stats.recent}</p>
                            </div>
                            <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4 lg:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                            {['ALL', 'admin', 'customer', 'user', 'hotel_manager'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm lg:text-base ${selectedRole === role
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {role === 'ALL' ? 'Tất cả' : getRoleText(role)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32 lg:h-64">
                            <div className="animate-spin rounded-full h-8 w-8 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-8 lg:py-12">
                            <User className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-sm lg:text-lg">
                                {users.length === 0 ? 'Không có người dùng nào' : 'Không tìm thấy người dùng phù hợp với bộ lọc'}
                            </p>
                            {users.length > 0 && (
                                <button
                                    onClick={() => setSelectedRole('ALL')}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Hiển thị tất cả người dùng
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Người dùng
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                            Liên hệ
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                            Ngày tạo
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 lg:px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                                                        <div className="text-xs text-gray-500 lg:hidden">{user.email}</div>
                                                        <div className="text-xs text-gray-500 lg:hidden">ID: #{user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-4 hidden sm:table-cell">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Phone className="w-3 h-3" />
                                                    {user.phone}
                                                </div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                                                <div className="text-sm text-gray-900">{formatDateTime(user.created_at)}</div>
                                                <div className="text-xs text-gray-500">Cập nhật: {formatDateTime(user.updated_at)}</div>
                                            </td>
                                            <td className="px-4 lg:px-6 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                    {getRoleIcon(user.role)}
                                                    {getRoleText(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-4 lg:px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {pagination.totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Hiển thị <span className="font-medium">{(pagination.page * pagination.size) + 1}</span> đến{' '}
                                        <span className="font-medium">
                                            {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                                        </span> trong{' '}
                                        <span className="font-medium">{pagination.totalElements}</span> kết quả
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 0}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages - 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Chi tiết người dùng</h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedUser(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg lg:text-xl font-semibold text-gray-900">{selectedUser.full_name}</h3>
                                    <p className="text-gray-600 text-sm lg:text-base">{selectedUser.email}</p>
                                    <span className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getRoleColor(selectedUser.role)}`}>
                                        {getRoleIcon(selectedUser.role)}
                                        {getRoleText(selectedUser.role)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Thông tin liên hệ
                                </h4>
                                <div className="space-y-2 bg-gray-50 rounded-lg p-3 lg:p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Email:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedUser.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Số điện thoại:</span>
                                        <span className="text-sm font-medium text-gray-900">{selectedUser.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">ID người dùng:</span>
                                        <span className="text-sm font-medium text-gray-900">#{selectedUser.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Thông tin thời gian
                                </h4>
                                <div className="space-y-2 bg-gray-50 rounded-lg p-3 lg:p-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Ngày tạo:</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDateTime(selectedUser.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Cập nhật lần cuối:</span>
                                        <span className="text-sm font-medium text-gray-900">{formatDateTime(selectedUser.updated_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 lg:p-6 flex items-center justify-between">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingUser(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    defaultValue={editingUser?.full_name || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={editingUser?.email || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={editingUser?.phone || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                                <select
                                    name="role"
                                    defaultValue={editingUser?.role || 'customer'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="customer">Khách hàng</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingUser(null);
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    {editingUser ? 'Cập nhật' : 'Tạo mới'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="text-center">
                            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
                            <p className="text-gray-600 mb-6">
                                Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser.full_name}</strong>? Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => deleteUser(selectedUser.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default UserManagement;