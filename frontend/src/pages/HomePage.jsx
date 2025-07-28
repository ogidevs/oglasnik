import React, { useState, useEffect } from 'react';
import { getAllAds } from '../services/adService';
import { getAllCategories } from '../services/categoryService';
import AdCard from '../components/AdCard';
import Spinner from '../components/Spinner';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';

const HomePage = () => {
    const [ads, setAds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ keyword: '', categoryId: '' });
    
    // State za paginaciju
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // EFEKAT #1: Sluša promene na stranici i filterima i DOHVATA OGLASE
    useEffect(() => {
        // Ova funkcija će se pokrenuti svaki put kad se currentPage ili filters promene
        const fetchAdsData = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    size: 8,
                    keyword: filters.keyword,
                    categoryId: filters.categoryId,
                };
                // Šaljemo parametre samo ako imaju vrednost
                if (!params.keyword) delete params.keyword;
                if (!params.categoryId) delete params.categoryId;
                
                const res = await getAllAds(params);
                setAds(res.data.content);
                setTotalPages(res.data.totalPages);
            } catch (error) {
                // Interceptor će prikazati grešku
            } finally {
                setLoading(false);
            }
        };

        fetchAdsData();
    }, [currentPage, filters]); // <-- Zavisnosti: pokreni ponovo kad se ovo promeni

    // EFEKAT #2: Dohvata kategorije SAMO JEDNOM, pri prvom učitavanju
    useEffect(() => {
        getAllCategories()
            .then(res => setCategories(res.data))
            .catch(() => {}); // Grešku handle-uje interceptor
    }, []); // Prazan niz, izvršava se samo jednom

    const handleFilterInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        // Kada se filteri primene, uvek se vraćamo na prvu stranicu.
        // Promena currentPage će automatski pokrenuti gornji useEffect.
        setCurrentPage(0); 
    };
    
    const handlePageChange = (newPage) => {
        // Menjamo samo stanje. useEffect će odraditi ostatak.
        setCurrentPage(newPage);
    };
    
    return (
        <div>
            <form onSubmit={handleFilterSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:flex-grow">
                    <input
                        type="text"
                        name="keyword"
                        value={filters.keyword}
                        onChange={handleFilterInputChange}
                        placeholder="Npr. 'Golf 7' ili 'iPhone'"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterInputChange}
                    className="w-full sm:w-auto p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Sve kategorije</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.naziv}</option>)}
                </select>
                <button 
                    type="submit" 
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Pretraži
                </button>
            </form>
            
            {loading ? <Spinner /> : (
                <>
                    {ads.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-xl text-gray-600">Nema oglasa koji odgovaraju pretrazi.</h3>
                            <p className="text-gray-400 mt-2">Pokušajte da promenite filtere.</p>
                        </div>
                    )}
                    
                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-10 space-x-2 sm:space-x-4">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 0}
                                className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <FaChevronLeft className="mr-2" /> Prethodna
                            </button>
                            <span className="font-semibold text-gray-700">
                                {currentPage + 1} / {totalPages}
                            </span>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage >= totalPages - 1}
                                className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                Sledeća <FaChevronRight className="ml-2" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;