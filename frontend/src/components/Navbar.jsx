import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaUserCircle, FaSignOutAlt, FaPlusCircle, FaListAlt, FaTools } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold text-indigo-600">Oglasnik</Link>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'ROLE_ADMIN' && (
                                    <Link to="/admin" className="flex items-center text-gray-600 hover:text-indigo-600">
                                        <FaTools className="mr-1" /> Admin
                                    </Link>
                                )}
                                <Link to="/my-ads" className="flex items-center text-gray-600 hover:text-indigo-600">
                                    <FaListAlt className="mr-1" /> Moji Oglasi
                                </Link>
                                <Link to="/ads/new" className="flex items-center text-gray-600 hover:text-indigo-600">
                                    <FaPlusCircle className="mr-1" /> Postavi Oglas
                                </Link>
                                <div className="flex items-center text-gray-800">
                                    <FaUserCircle className="mr-2" />
                                    <span>{user.username}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                                    <FaSignOutAlt className="mr-1" /> Odjavi se
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Prijava</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;