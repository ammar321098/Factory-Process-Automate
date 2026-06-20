// 'use client';

// import React, { useState } from 'react';
// import { useMockApi } from '@/lib/useMockApi';
// import { useToast } from '@/components/Toast';
// import { User, Role, Module } from '@/lib/mocks';
// import { 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye, 
//   EyeOff, 
//   User as UserIcon, 
//   Mail, 
//   Shield,
//   CheckCircle,
//   XCircle,
//   Calendar,
//   UserPlus
// } from 'lucide-react';

// interface UserFormProps {
//   user?: User | null;
//   onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'createdBy'>) => void;
//   onCancel: () => void;
// }

// const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
//   const { roles, modules } = useMockApi();
//   const [formData, setFormData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     password: '',
//     role: user?.role || '',
//     department: user?.department || '',
//     isActive: user?.isActive ?? true,
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showPassword, setShowPassword] = useState(false);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!user && !formData.password.trim()) {
//       newErrors.password = 'Password is required';
//     }

//     if (!formData.role) {
//       newErrors.role = 'Role is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (validateForm()) {
//       const userData = {
//         ...formData,
//         password: formData.password || user?.password || '',
//         lastLogin: user?.lastLogin,
//       };
//       onSubmit(userData);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Full Name *
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
//               errors.name ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
//             }`}
//             placeholder="Enter full name"
//           />
//           {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//         </div>

//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Email Address *
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
//               errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
//             }`}
//             placeholder="Enter email address"
//           />
//           {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Password {!user && '*'}
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
//                 errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
//               }`}
//               placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-4 w-4 text-gray-400" />
//               ) : (
//                 <Eye className="h-4 w-4 text-gray-400" />
//               )}
//             </button>
//           </div>
//           {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//         </div>

//         <div>
//           <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Role *
//           </label>
//           <select
//             id="role"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
//               errors.role ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
//             }`}
//           >
//             <option value="">Select a role</option>
//             {roles.map(role => (
//               <option key={role.id} value={role.name}>
//                 {role.name.replace('_', ' ').toUpperCase()}
//               </option>
//             ))}
//           </select>
//           {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
//         </div>

//         <div>
//           <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Department
//           </label>
//           <input
//             type="text"
//             id="department"
//             name="department"
//             value={formData.department}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//             placeholder="Enter department"
//           />
//         </div>

//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="isActive"
//             name="isActive"
//             checked={formData.isActive}
//             onChange={handleChange}
//             className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
//           />
//           <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
//             Active User
//           </label>
//         </div>
//       </div>

//       <div className="flex justify-end space-x-3 pt-4">
//         <button
//           type="button"
//           onClick={onCancel}
//           className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//         >
//           {user ? 'Update User' : 'Create User'}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default function UserManagement() {
//   const { users, roles, modules, createUser, updateUser, deleteUser, getRolesForUser, getModulesForRole } = useMockApi();
//   const { showToast, ToastContainer } = useToast();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCreateUser = () => {
//     setEditingUser(null);
//     setIsModalOpen(true);
//   };

//   const handleEditUser = (user: User) => {
//     setEditingUser(user);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = (userData: Omit<User, 'id' | 'createdAt' | 'createdBy'>) => {
//     try {
//       if (editingUser) {
//         updateUser(editingUser.id, userData);
//         showToast('User updated successfully', 'success');
//       } else {
//         createUser({
//           ...userData,
//           createdAt: new Date().toISOString(),
//           createdBy: 'admin', // In a real app, this would be the current user
//         });
//         showToast('User created successfully', 'success');
//       }
//       setIsModalOpen(false);
//       setEditingUser(null);
//     } catch (error) {
//       showToast('An error occurred', 'error');
//     }
//   };

//   const handleDeleteUser = (user: User) => {
//     if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
//       try {
//         deleteUser(user.id);
//         showToast('User deleted successfully', 'success');
//         if (selectedUser?.id === user.id) {
//           setSelectedUser(null);
//         }
//       } catch (error) {
//         showToast('An error occurred', 'error');
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingUser(null);
//   };

//   const getUserModules = (user: User) => {
//     const userRoles = getRolesForUser(user.id);
//     const accessibleModules = userRoles.flatMap(role => getModulesForRole(role.id));
//     return accessibleModules;
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
//           <p className="text-gray-600 dark:text-gray-400">Manage system users and their permissions</p>
//         </div>
//         <button
//           onClick={handleCreateUser}
//           className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//         >
//           <UserPlus className="w-5 h-5" />
//           <span>Add User</span>
//         </button>
//       </div>

//       {/* Search */}
//       <div className="flex items-center space-x-4">
//         <div className="flex-1 max-w-md">
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Users List */}
//         <div className="lg:col-span-2">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users ({filteredUsers.length})</h3>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 dark:bg-gray-700">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Last Login
//                     </th>
//                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                   {filteredUsers.map((user) => (
//                     <tr 
//                       key={user.id} 
//                       className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
//                         selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
//                       }`}
//                       onClick={() => setSelectedUser(user)}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             {user.avatar ? (
//                               <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
//                             ) : (
//                               <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
//                                 <UserIcon className="h-5 w-5 text-primary-600" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
//                             <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
//                             {user.department && (
//                               <div className="text-xs text-gray-400 dark:text-gray-500">{user.department}</div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
//                           {user.role.replace('_', ' ').toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           user.isActive 
//                             ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
//                             : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
//                         }`}>
//                           {user.isActive ? (
//                             <>
//                               <CheckCircle className="w-3 h-3 mr-1" />
//                               Active
//                             </>
//                           ) : (
//                             <>
//                               <XCircle className="w-3 h-3 mr-1" />
//                               Inactive
//                             </>
//                           )}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                         <div className="flex justify-center space-x-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleEditUser(user);
//                             }}
//                             className="text-primary-600 hover:text-primary-900"
//                             title="Edit User"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDeleteUser(user);
//                             }}
//                             className="text-red-600 hover:text-red-900"
//                             title="Delete User"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* User Details */}
//         <div className="lg:col-span-1">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 User Details
//                 {selectedUser && (
//                   <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
//                     {selectedUser.name}
//                   </span>
//                 )}
//               </h3>
//             </div>
            
//             <div className="p-6">
//               {selectedUser ? (
//                 <div className="space-y-6">
//                   {/* User Info */}
//                   <div className="text-center">
//                     {selectedUser.avatar ? (
//                       <img 
//                         className="h-20 w-20 rounded-full mx-auto mb-4" 
//                         src={selectedUser.avatar} 
//                         alt={selectedUser.name} 
//                       />
//                     ) : (
//                       <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
//                         <UserIcon className="h-10 w-10 text-primary-600" />
//                       </div>
//                     )}
//                     <h4 className="text-lg font-medium text-gray-900 dark:text-white">{selectedUser.name}</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
//                     {selectedUser.department && (
//                       <p className="text-sm text-gray-400 dark:text-gray-500">{selectedUser.department}</p>
//                     )}
//                   </div>

//                   {/* Status */}
//                   <div className="flex items-center justify-center">
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
//                       selectedUser.isActive 
//                         ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
//                         : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
//                     }`}>
//                       {selectedUser.isActive ? (
//                         <>
//                           <CheckCircle className="w-4 h-4 mr-2" />
//                           Active
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="w-4 h-4 mr-2" />
//                           Inactive
//                         </>
//                       )}
//                     </span>
//                   </div>

//                   {/* Role */}
//                   <div>
//                     <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</h5>
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
//                       {selectedUser.role.replace('_', ' ').toUpperCase()}
//                     </span>
//                   </div>

//                   {/* Last Login */}
//                   <div>
//                     <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Login</h5>
//                     <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}
//                     </div>
//                   </div>

//                   {/* Module Access */}
//                   <div>
//                     <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Module Access</h5>
//                     <div className="space-y-2">
//                       {getUserModules(selectedUser).map(module => (
//                         <div key={module.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//                           <Shield className="w-4 h-4 mr-2 text-green-500" />
//                           {module.name}
//                         </div>
//                       ))}
//                       {getUserModules(selectedUser).length === 0 && (
//                         <p className="text-sm text-gray-400 dark:text-gray-500">No module access assigned</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500 dark:text-gray-400">
//                   <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
//                   <p>Select a user to view details</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-screen items-center justify-center p-4">
//             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>
            
//             <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
//               <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                     {editingUser ? 'Edit User' : 'Create New User'}
//                   </h3>
//                   <button
//                     onClick={handleCloseModal}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
                
//                 <UserForm
//                   user={editingUser}
//                   onSubmit={handleSubmit}
//                   onCancel={handleCloseModal}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// }

