import React, { useState, useEffect } from 'react';
import { getMyAds } from '../services/adService';
import AdCard from '../components/AdCard';
import Spinner from '../components/Spinner';

const MyAdsPage = () => {
    const [myAds, setMyAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getMyAds()
            .then(res => setMyAds(res.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Moji oglasi</h1>
            {myAds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {myAds.map(ad => <AdCard key={ad.id} ad={ad} />)}
                </div>
            ) : (
                <p>Niste postavili nijedan oglas.</p>
            )}
        </div>
    );
};

export default MyAdsPage;