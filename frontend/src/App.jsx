import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdDetailsPage from './pages/AdDetailsPage';
import CreateAdPage from './pages/CreateAdPage';
import EditAdPage from './pages/EditAdPage';
import MyAdsPage from './pages/MyAdsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster position="top-right" reverseOrder={false} />
                <Navbar />
                <main className="container mx-auto p-4">
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
                </main>
            </Router>
        </AuthProvider>
    );
}
export default App;