import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getAdById, updateAd } from '../services/adService';
import { uploadFiles } from '../services/fileService';
import { getAllCategories } from '../services/categoryService';
import Spinner from '../components/Spinner';
import { FaUpload, FaTrash } from 'react-icons/fa';

const EditAdPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    
    // Slike
    const [existingImageUrls, setExistingImageUrls] = useState([]); // Slike koje su već na serveru
    const [newImageFiles, setNewImageFiles] = useState([]); // Novi fajlovi za upload
    const [newImagePreviews, setNewImagePreviews] = useState([]); // Prikaz novih fajlova

    const loadAdData = useCallback(async () => {
        try {
            const [adRes, catRes] = await Promise.all([getAdById(id), getAllCategories()]);
            const ad = adRes.data;
            
            // Popuni formu
            setValue('naslov', ad.naslov);
            setValue('opis', ad.opis);
            setValue('cena', ad.cena);
            setValue('kategorijaId', catRes.data.find(c => c.naziv === ad.kategorijaNaziv)?.id);
            
            setCategories(catRes.data);
            setExistingImageUrls(ad.slikeUrl || []);
        } catch (error) {
            toast.error("Oglas nije pronađen ili nemate dozvolu za izmenu.");
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, setValue, navigate]);

    useEffect(() => {
        loadAdData();
    }, [loadAdData]);
    
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingImageUrls.length + newImageFiles.length > 5) {
            toast.error("Možete imati najviše 5 slika ukupno.");
            return;
        }
        setNewImageFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (index) => {
        setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    };
    
    const removeNewImage = (index) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let newUploadedUrls = [];
            // 1. Uploaduj samo nove slike, ako postoje
            if (newImageFiles.length > 0) {
                const uploadToast = toast.loading('Upload novih slika...');
                const uploadResponse = await uploadFiles(newImageFiles);
                newUploadedUrls = uploadResponse.data;
                toast.dismiss(uploadToast);
            }
            
            // 2. Spoji postojeće i nove URL-ove
            const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];
            if (finalImageUrls.length === 0) {
                toast.error("Oglas mora imati bar jednu sliku.");
                setIsSubmitting(false);
                return;
            }

            // 3. Ažuriraj oglas
            const adData = {
                ...data,
                cena: parseFloat(data.cena),
                kategorijaId: parseInt(data.kategorijaId),
                slikeUrl: finalImageUrls,
            };
            
            await toast.promise(updateAd(id, adData), {
                loading: 'Ažuriranje oglasa...',
                success: 'Oglas uspešno ažuriran!',
                error: 'Greška pri ažuriranju.',
            });

            navigate(`/ads/${id}`);
        } catch (error) {
            // Interceptor
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Izmeni oglas</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Forma je ista kao za CreateAdPage */}
                <div>
                    <label htmlFor="naslov" className="block text-sm font-medium text-gray-700">Naslov</label>
                    <input type="text" id="naslov" {...register('naslov', { required: "Naslov je obavezan" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"/>
                    {errors.naslov && <p className="text-red-500 text-xs mt-1">{errors.naslov.message}</p>}
                </div>
                <div>
                    <label htmlFor="opis" className="block text-sm font-medium text-gray-700">Opis</label>
                    <textarea id="opis" rows="5" {...register('opis', { required: "Opis je obavezan" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                    {errors.opis && <p className="text-red-500 text-xs mt-1">{errors.opis.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="cena" className="block text-sm font-medium text-gray-700">Cena (€)</label>
                        <input type="number" step="0.01" id="cena" {...register('cena', { required: "Cena je obavezna", valueAsNumber: true })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        {errors.cena && <p className="text-red-500 text-xs mt-1">{errors.cena.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="kategorijaId" className="block text-sm font-medium text-gray-700">Kategorija</label>
                        <select id="kategorijaId" {...register('kategorijaId', { required: "Kategorija je obavezna" })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.naziv}</option>)}
                        </select>
                        {errors.kategorijaId && <p className="text-red-500 text-xs mt-1">{errors.kategorijaId.message}</p>}
                    </div>
                </div>

                {/* Upravljanje slikama */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Slike (Max 5)</label>
                    {/* Postojeće slike */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                        {existingImageUrls.map((url, index) => (
                             <div key={url} className="relative group">
                                <img src={url} alt="postojeća slika" className="h-32 w-full object-cover rounded-md" />
                                <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                        {/* Nove slike */}
                        {newImagePreviews.map((preview, index) => (
                             <div key={preview} className="relative group">
                                <img src={preview} alt="preview" className="h-32 w-full object-cover rounded-md border-2 border-blue-500" />
                                <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                     {/* Dugme za dodavanje novih */}
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                    <span>Dodaj još slika</span>
                                    <input id="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                    {isSubmitting ? <Spinner /> : 'Sačuvaj izmene'}
                </button>
            </form>
        </div>
    );
};

export default EditAdPage;