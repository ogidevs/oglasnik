import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createAd } from "../services/adService";
import { uploadFiles } from "../services/fileService";
import { getAllCategories } from "../services/categoryService";
import { FaUpload, FaTrash } from "react-icons/fa";
import Spinner from "../components/Spinner";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableImage from "../components/SortableImage";

const CreateAdPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length > 5) {
      toast.error("Možete dodati najviše 5 slika.");
      return;
    }
    const newPreviews = files.map((file) => ({
      id: `new-${URL.createObjectURL(file)}`,
      url: URL.createObjectURL(file),
      type: "new",
      file: file,
    }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (idToRemove) => {
    setImagePreviews((prev) => prev.filter((image) => image.id !== idToRemove));
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
      setImagePreviews((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        // arrayMove is a handy utility from dnd-kit to reorder arrays
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const onSubmit = async (data) => {
    if (imagePreviews.length === 0) {
      toast.error("Morate dodati bar jednu sliku.");
      return;
    }

    setIsSubmitting(true);
    try {
      const filesToUpload = imagePreviews
        .filter((img) => img.type === "new")
        .map((img) => img.file);

      let newUploadedUrls = [];
      if (filesToUpload.length > 0) {
        const uploadToast = toast.loading("Upload novih slika...");
        const uploadResponse = await uploadFiles(filesToUpload);
        newUploadedUrls = uploadResponse.data;
        toast.dismiss(uploadToast);
      }

      const newUploadedUrlsCopy = [...newUploadedUrls];
      const finalImageUrls = imagePreviews.map((img) => {
        if (img.type === "existing") {
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

      await toast.promise(createAd(adData), {
        loading: "Postavljanje oglasa...",
        success: "Oglas uspešno postavljen!",
        error: "Greška pri postavljanju oglasa.",
      });

      navigate("/");
    } catch (error) {
      // Interceptor handle-uje
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Postavi novi oglas
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="naslov"
            className="block text-sm font-medium text-gray-700"
          >
            Naslov
          </label>
          <input
            type="text"
            id="naslov"
            {...register("naslov", { required: "Naslov je obavezan" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.naslov && (
            <p className="text-red-500 text-xs mt-1">{errors.naslov.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="opis"
            className="block text-sm font-medium text-gray-700"
          >
            Opis
          </label>
          <textarea
            id="opis"
            rows="5"
            {...register("opis", { required: "Opis je obavezan" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          ></textarea>
          {errors.opis && (
            <p className="text-red-500 text-xs mt-1">{errors.opis.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="cena"
              className="block text-sm font-medium text-gray-700"
            >
              Cena (€)
            </label>
            <input
              type="number"
              step="0.01"
              id="cena"
              {...register("cena", {
                required: "Cena je obavezna",
                valueAsNumber: true,
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.cena && (
              <p className="text-red-500 text-xs mt-1">{errors.cena.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="kategorijaId"
              className="block text-sm font-medium text-gray-700"
            >
              Kategorija
            </label>
            <select
              id="kategorijaId"
              {...register("kategorijaId", {
                required: "Kategorija je obavezna",
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Izaberi kategoriju</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.naziv}
                </option>
              ))}
            </select>
            {errors.kategorijaId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.kategorijaId.message}
              </p>
            )}
          </div>
        </div>

        {/* DND-Kit: Image management section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Slike (Max 5, prevucite za promenu redosleda)
          </label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={imagePreviews.map((img) => img.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 my-4 p-2 bg-gray-50 rounded-lg min-h-[148px]">
                {imagePreviews.map((image, index) => (
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
        </div>

        {imagePreviews.length < 5 && (
          <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Dodaj još slika</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Preostalo mesta: {5 - imagePreviews.length}
              </p>
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          {isSubmitting ? <Spinner /> : "Postavi oglas"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdPage;
