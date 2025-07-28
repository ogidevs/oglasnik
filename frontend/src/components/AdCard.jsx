import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaTag } from 'react-icons/fa';

const AdCard = ({ ad }) => (
    <Link to={`/ads/${ad.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <img
            src={ad.slikeUrl?.[0] || 'https://placehold.co/600x400?text=Nema+Slike'}
            alt={ad.naslov}
            className="w-full h-48 object-cover"
        />
        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 truncate">{ad.naslov}</h3>
            <p className="text-xl font-semibold text-indigo-600 my-2">{ad.cena} €</p>
            <div className="flex items-center text-sm text-gray-500">
                <FaTag className="mr-2" />
                <span>{ad.kategorijaNaziv}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaUser className="mr-2" />
                <span>{ad.korisnikUsername}</span>
            </div>
        </div>
    </Link>
);

export default AdCard;