import React, { useState, useEffect } from 'react';
import { database, functions } from '../../firebase'; // Make sure to import functions
import { ref, onValue, remove, set } from 'firebase/database';
import { httpsCallable } from 'firebase/functions'; // Import httpsCallable
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: null, username: '', email: '', password: '' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            const loadedUsers = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
            setUsers(loadedUsers);
        });
    }, []);

    // This function is no longer called from the UI, but is kept for potential future use
    const handleAddUser = () => {
        setIsEditing(false);
        setCurrentUser({ id: null, username: '', email: '', password: '' });
        setIsPasswordVisible(false);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setIsEditing(true);
        setCurrentUser({ ...user, password: '' });
        setIsPasswordVisible(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    
    const handleSaveUser = async (e) => {
        e.preventDefault();

        if (isEditing) {
            // Logic for updating a user's info (password is no longer handled here)
            const userRef = ref(database, `users/${currentUser.id}`);
            await set(userRef, {
                username: currentUser.username,
                email: currentUser.email,
                registrationDate: currentUser.registrationDate,
                lastUpdated: new Date().toLocaleDateString('en-US')
            });
            alert("User details updated successfully!");
        } else {
            // Logic for ADDING a new user (currently unreachable from the UI)
            if (!currentUser.email || !currentUser.password || !currentUser.username) {
                alert("Please fill out all fields.");
                return;
            }
            try {
                const createNewUserCallable = httpsCallable(functions, 'createNewUser');
                await createNewUserCallable({
                    email: currentUser.email,
                    password: currentUser.password,
                    username: currentUser.username,
                });
                alert("User created successfully! They can now log in.");
            } catch (error) {
                console.error("Error creating user:", error);
                alert(`Failed to create user: ${error.message}`);
            }
        }
        handleCloseModal();
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure? This will delete the user's data from the database.")) {
            const userRef = ref(database, `users/${userId}`);
            await remove(userRef);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Users</h1>
            </div>

            <div className="bg-[#2D3748] rounded-lg p-1">
                <h2 className="p-4 text-xl font-semibold">Registered Users</h2>
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-600">
                            <th className="p-4">ID</th>
                            <th className="p-4">Username</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Registration Date</th>
                            <th className="p-4">Last Updated</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                        <tr key={user.id} className="border-b border-gray-700 hover:bg-[#3a475a]">
                            <td className="p-4">{index + 1}</td>
                            <td className="p-4">{user.username || 'N/A'}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.registrationDate}</td>
                            <td className="p-4">{user.lastUpdated || 'N/A'}</td>
                            <td className="p-4 flex gap-4">
                                <button onClick={() => handleEditUser(user)} className="text-yellow-400 hover:underline">Edit</button>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-400 hover:underline">Delete</button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-[#1F2937] p-8 rounded-lg w-full max-w-lg text-white">
                        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSaveUser}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Username</label>
                                <input
                                    type="text" name="username" value={currentUser.username}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2D3748] p-2 rounded border border-gray-600"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">Email</label>
                                <input
                                    type="email" name="email" value={currentUser.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2D3748] p-2 rounded border border-gray-600"
                                    required
                                />
                            </div>
                            
                            {/* Password field is now hidden when editing */}
                            {!isEditing && (
                                <div className="mb-6 relative">
                                    <label className="block mb-2 text-sm font-medium">Password</label>
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'} name="password" value={currentUser.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2D3748] p-2 rounded border border-gray-600 pr-10"
                                        required
                                    />
                                    <button
                                        type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                        className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-400 hover:text-white"
                                    >
                                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            )}
                            
                            {isEditing && (
                                <div className="mb-6 mt-6 border-t border-gray-600 pt-4 text-sm text-gray-400">
                                    <p><span className="font-semibold">Registered on:</span> {currentUser.registrationDate}</p>
                                    <p><span className="font-semibold">Last Updated:</span> {currentUser.lastUpdated || 'N/A'}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 mt-2">
                                <button type="button" onClick={handleCloseModal} className="bg-gray-600 py-2 px-4 rounded hover:bg-gray-700">Cancel</button>
                                <button type="submit" className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;