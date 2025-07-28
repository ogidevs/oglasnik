import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdById, deleteAd } from '../services/adService';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
import { FaUser, FaTag, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAdById(id)
            .then(res => setAd(res.data))
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleDelete = async () => {
        if (window.confirm("Da li ste sigurni da želite da obrišete ovaj oglas?")) {
            try {
                await toast.promise(deleteAd(id), {
                    loading: 'Brisanje oglasa...',
                    success: 'Oglas uspešno obrisan!',
                    error: 'Greška pri brisanju.'
                });
                navigate('/');
            } catch (error) {}
        }
    };

    if (loading) return <Spinner />;
    if (!ad) return <p>Oglas nije pronađen.</p>;

    const isOwnerOrAdmin = user && (user.username === ad.korisnikUsername || user.role === 'ROLE_ADMIN');
    
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">{ad.naslov}</h1>
            <div className="flex items-center space-x-4 text-gray-500 mb-6">
                <span className="flex items-center"><FaTag className="mr-2"/>{ad.kategorijaNaziv}</span>
                <span className="flex items-center"><FaUser className="mr-2"/>{ad.korisnikUsername}</span>
                <span className="flex items-center"><FaCalendarAlt className="mr-2"/>{new Date(ad.datumKreiranja).toLocaleDateString()}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={ad.slikeUrl?.[0] || 'https://placehold.co/600x400?text=Nema+Slike'} alt={ad.naslov} className="w-full h-auto rounded-lg shadow-md" />
                </div>
                <div>
                    <p className="text-3xl font-bold text-indigo-600 mb-6">{ad.cena} €</p>
                    <h2 className="text-2xl font-semibold mb-2">Opis</h2>
                    <p className="text-gray-700 whitespace-pre-wrap">{ad.opis}</p>
                    
                    {isOwnerOrAdmin && (
                        <div className="mt-8 flex space-x-4">
                            <Link to={`/ads/edit/${ad.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
                                <FaEdit className="mr-2"/> Izmeni
                            </Link>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center">
                                <FaTrash className="mr-2"/> Obriši
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdDetailsPage;