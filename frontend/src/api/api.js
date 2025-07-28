import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Request Interceptor: Automatski dodaje JWT token u header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Centralizovano rukovanje greškama
api.interceptors.response.use(
    (response) => response, // Ako je sve OK, samo prosledi odgovor
    (error) => {
        const { response } = error;
        
        if (response) {
            // Greška sa servera (status kod postoji)
            if (response.status === 401) {
                // Unauthorized - loš token ili je istekao
                if (response.data?.message) {
                    toast.error(response.data.message);
                } else {
                    toast.error("Niste prijavljeni ili je vaš token istekao.");
                }
                localStorage.removeItem('jwt_token');
                // Reload stranice će automatski prebaciti na login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } else if (response.status === 403) {
                // Forbidden - nemaš dozvolu
                toast.error("Pristup odbijen. Nemate potrebne dozvole.");
                window.location.href = '/'; // Preusmeri na početnu
            } else if (response.status >= 400 && response.status < 500) {
                // Ostale klijentske greške (npr. 404, 400)
                if (response.data?.errors && Array.isArray(response.data.errors)) {
                    // Ako postoji lista grešaka, prikaži svaku pojedinačno
                    response.data.errors.forEach((err) => {
                        if (err.msg) {
                            toast.error(err.msg);
                        }
                    });
                } else {
                    // Prikazujemo poruku sa našeg backenda (iz ErrorResponse DTO)
                    const errorMessage = response.data?.message || 'Došlo je do greške.';
                    toast.error(errorMessage);
                }
            } else {
                // Serverska greška (5xx)
                toast.error("Došlo je do greške na serveru. Molimo pokušajte kasnije.");
            }
        } else {
            // Greška bez odgovora (npr. mreža, CORS)
            toast.error("Problem sa mrežom ili server nije dostupan.");
        }

        return Promise.reject(error);
    }
);

export default api;