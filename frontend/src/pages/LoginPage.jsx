import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { register: registerForm, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLoginForm } = useForm();
    const { register: registerRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors }, reset: resetRegisterForm } = useForm();
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [isLoginView, setIsLoginView] = useState(true);

    useEffect(() => {
        // Reset form state when switching between login and register views
        if (isLoginView) {
            resetLoginForm();
        } else {
            resetRegisterForm();
        }
    }, [isLoginView, registerForm, registerRegister]);

    const onLogin = async (data) => {
        try {
            await toast.promise(login(data), {
                loading: 'Prijavljivanje...',
                success: 'Uspešno ste prijavljeni!',
            });
            navigate('/');
        } catch (error) {}
    };

    const onRegister = async (data) => {
        try {
            const response = await toast.promise(register(data), {
                loading: 'Registrovanje...',
                success: 'Uspešno ste registrovani! Molimo prijavite se.',
            });
            if (response?.status === 201 || response?.status === 200) {
                await login({ username: data.username, password: data.password });
                navigate('/');
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Greška pri registraciji. Molimo pokušajte ponovo.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6">{isLoginView ? 'Prijava' : 'Registracija'}</h2>
                {isLoginView ? (
                    <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                        {/* Login form fields */}
                        <input {...registerForm('username', { required: true })} placeholder="Korisničko ime" className="w-full p-2 border rounded-md" />
                        <input type="password" {...registerForm('password', { required: true })} placeholder="Lozinka" className="w-full p-2 border rounded-md" />
                        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-md">Prijavi se</button>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
                        {/* Register form fields */}
                        <input {...registerRegister('username', { required: true })} placeholder="Korisničko ime" className="w-full p-2 border rounded-md" />
                        <input type="email" {...registerRegister('email', { required: true })} placeholder="Email" className="w-full p-2 border rounded-md" />
                        <input type="password" {...registerRegister('password', { required: true })} placeholder="Lozinka" className="w-full p-2 border rounded-md" />
                        <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md">Registruj se</button>
                    </form>
                )}
                <p className="text-center mt-4">
                    <button onClick={() => setIsLoginView(!isLoginView)} className="text-indigo-600 hover:underline">
                        {isLoginView ? 'Nemate nalog? Registrujte se' : 'Već imate nalog? Prijavite se'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;