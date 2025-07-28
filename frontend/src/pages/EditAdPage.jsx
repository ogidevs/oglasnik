import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getAdById, updateAd } from '../services/adService';
import { useAuth } from '../hooks/useAuth';
import { uploadFiles } from '../services/fileService';
import { getAllCategories } from '../services/categoryService';
import Spinner from '../components/Spinner';
import { FaUpload } from 'react-icons/fa';
import SortableImage from '../components/SortableImage';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

const EditAdPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    
    const [allImages, setAllImages] = useState([]);

    const loadAdData = useCallback(async () => {
        try {
            const [adRes, catRes] = await Promise.all([getAdById(id), getAllCategories()]);
            const ad = adRes.data;

            if (ad.korisnikUsername !== user.username && user.role !== 'ROLE_ADMIN') {
                throw new Error("Nemate dozvolu za izmenu ovog oglasa.");
            }
            
            setValue('naslov', ad.naslov);
            setValue('opis', ad.opis);
            setValue('cena', ad.cena);
            setValue('kategorijaId', catRes.data.find(c => c.naziv === ad.kategorijaNaziv)?.id);
            
            setCategories(catRes.data);
            
            const existingImages = (ad.slikeUrl || []).map(url => ({
                id: `existing-${url}`,
                url: url,
                type: 'existing'
            }));
            setAllImages(existingImages);

        } catch (error) {
            toast.error("Oglas nije pronađen ili nemate dozvolu za izmenu.");
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, setValue, navigate, user.username, user.role]);

    useEffect(() => {
        loadAdData();
    }, [loadAdData]);
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + allImages.length > 5) {
            toast.error("Možete imati najviše 5 slika ukupno.");
            return;
        }

        const newImageObjects = files.map(file => {
            const previewUrl = URL.createObjectURL(file);
            return {
                id: `new-${previewUrl}`,
                url: previewUrl,
                type: 'new',
                file: file
            };
        });
        setAllImages(prev => [...prev, ...newImageObjects]);
    };

    const removeImage = (idToRemove) => {
        setAllImages(prev => prev.filter(image => image.id !== idToRemove));
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setAllImages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                // arrayMove is a handy utility from dnd-kit to reorder arrays
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const filesToUpload = allImages
                .filter(img => img.type === 'new')
                .map(img => img.file);
            
            let newUploadedUrls = [];
            if (filesToUpload.length > 0) {
                const uploadToast = toast.loading('Upload novih slika...');
                const uploadResponse = await uploadFiles(filesToUpload);
                newUploadedUrls = uploadResponse.data;
                toast.dismiss(uploadToast);
            }
            
            const newUploadedUrlsCopy = [...newUploadedUrls];
            const finalImageUrls = allImages.map(img => {
                if (img.type === 'existing') {
                    return img.url;
                } else {
                    return newUploadedUrlsCopy.shift();
                }
            });

            const adData = {
                ...data,
                cena: parseFloat(data.cena),
                kategorijaId: data.kategorijaId,
                slikeUrl: finalImageUrls,
            };
            
            await toast.promise(updateAd(id, adData), {
                loading: 'Ažuriranje oglasa...',
                success: 'Oglas uspešno ažuriran!',
                error: 'Greška pri ažuriranju.',
            });

            navigate(`/ads/${id}`);
        } catch (error) {
            // Interceptor handles errors
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Izmeni oglas</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="naslov" className="block text-sm font-medium text-gray-700">Naslov</label>
                    <input type="text" id="naslov" {...register('naslov', { required: "Naslov je obavezan" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    {errors.naslov && <p className="text-red-500 text-xs mt-1">{errors.naslov.message}</p>}
                </div>
                <div>
                    <label htmlFor="opis" className="block text-sm font-medium text-gray-700">Opis</label>
                    <textarea id="opis" rows="5" {...register('opis', { required: "Opis je obavezan" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                    {errors.opis && <p className="text-red-500 text-xs mt-1">{errors.opis.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="cena" className="block text-sm font-medium text-gray-700">Cena (€)</label>
                        <input type="number" step="0.01" id="cena" {...register('cena', { required: "Cena je obavezna", valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        {errors.cena && <p className="text-red-500 text-xs mt-1">{errors.cena.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="kategorijaId" className="block text-sm font-medium text-gray-700">Kategorija</label>
                        <select id="kategorijaId" {...register('kategorijaId', { required: "Kategorija je obavezna" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.naziv}</option>)}
                        </select>
                        {errors.kategorijaId && <p className="text-red-500 text-xs mt-1">{errors.kategorijaId.message}</p>}
                    </div>
                </div>

                {/* DND-Kit: Image management section */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Slike (Max 5, prevucite za promenu redosleda)</label>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={allImages.map(img => img.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 my-4 p-2 bg-gray-50 rounded-lg min-h-[148px]">
                                {allImages.map((image, index) => (
                                    <SortableImage
                                        key={image.id}
                                        image={image}
                                        index={index}
                                        removeImage={removeImage}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                     
                    {allImages.length < 5 && (
                        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Dodaj još slika</span>
                                        <input id="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">Preostalo mesta: {5 - allImages.length}</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isSubmitting ? <Spinner /> : 'Sačuvaj izmene'}
                </button>
            </form>
        </div>
    );
};

export default EditAdPage;