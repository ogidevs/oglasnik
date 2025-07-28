
import { FaTrash, FaGripVertical } from 'react-icons/fa';
import { CSS } from '@dnd-kit/utilities';
import {
    useSortable,
} from '@dnd-kit/sortable';

const SortableImage = ({ image, index, removeImage }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group rounded-md shadow-md ${isDragging ? 'shadow-lg scale-105' : ''}`}
        >
            <img
                src={image.url}
                alt="slika oglasa"
                className={`h-32 w-full object-cover rounded-md ${image.type === 'new' ? 'border-2 border-blue-500' : ''}`}
            />
            <div className="absolute top-1 right-1">
                <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="bg-red-600 text-white rounded-full p-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
                >
                    <FaTrash size={12} />
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-xs text-center py-0.5 rounded-b-md">
                Pozicija {index + 1}
            </div>
            <div
                {...attributes}
                {...listeners}
                className="absolute top-0 left-1 h-full flex items-center opacity-20 group-hover:opacity-80 transition-opacity cursor-grab"
                title="Prevucite za promenu redosleda"
            >
                <FaGripVertical className="text-white filter drop-shadow-lg" />
            </div>
        </div>
    );
};

export default SortableImage;