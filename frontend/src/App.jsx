import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import React, { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdDetailsPage = lazy(() => import('./pages/AdDetailsPage'));
const CreateAdPage = lazy(() => import('./pages/CreateAdPage'));
const EditAdPage = lazy(() => import('./pages/EditAdPage'));
const MyAdsPage = lazy(() => import('./pages/MyAdsPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" reverseOrder={false} />
                <Navbar />
                <main className="container mx-auto p-4">
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            {/* Javne rute */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/ads/:id" element={<AdDetailsPage />} />

                            {/* Zaštićene rute (za sve ulogovane) */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/ads/new" element={<CreateAdPage />} />
                                <Route path="/ads/edit/:id" element={<EditAdPage />} />
                                <Route path="/my-ads" element={<MyAdsPage />} />
                            </Route>
                            
                            {/* Admin rute */}
                            <Route element={<ProtectedRoute adminOnly />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </main>
            </Router>
        </AuthProvider>
    );
}
export default App;