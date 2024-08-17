import React, { useState } from 'react';
import man from '../assets/man.png';
import bg from '../assets/bg.jpg';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Landing() {
    const [Username, setUsername] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('https://fixxyapi.rajvikash-r2022cse.workers.dev/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username, Password }),
            });

            const data = await response.json();

            if (response.ok && data.message === "Login successful") {
                console.log("Login success", data);
                toast.success("Login successful");
                navigate('/home');
            } else {
                setError(data.message || 'An error occurred');
                toast.error(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('An error occurred:', (error as Error).message);
            setError((error as Error).message || 'An error occurred');
            toast.error("Wrong Credentials");
        }
    };

    return (
        <div
            className='flex flex-col items-center justify-center h-screen'
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                width: '100vw'
            }}
        >
            <div className='flex flex-row gap-10 items-center'>
                <div className='bg-white p-8 flex flex-col gap-4 items-center rounded-2xl max-w-xl shadow-lg mr-20 max-sm:mr-0 max-sm:p-3'>
                    <h1 className='text-5xl font-bold mb-4 text-gray-700 text-center'>Welcome to Fixxy Admin</h1>
                    <p className='text-lg mb-6 text-gray-600'>Login to check the complaints posted!</p>
                    {error && <p className='text-red-500 mb-4'>{error}</p>}
                    <form onSubmit={onSubmit} className='flex flex-col justify-center items-center gap-6'>
                        <input
                            type="text"
                            placeholder='Email or username'
                            value={Username}
                            onChange={(e) => setUsername(e.target.value)}
                            className='border border-gray-300 p-3 rounded-lg w-80'
                        />
                        <input
                            type="password"
                            placeholder='Password'
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='border border-gray-300 p-3 rounded-lg w-80'
                        />
                        <button
                            type="submit"
                            className='bg-blue-900 hover:bg-blue-600 text-white p-3 rounded-lg w-80 mt-4 font-semibold transition-all duration-300'
                        >
                            Login
                        </button>
                    </form>
                </div>
                <div className='flex items-center'>
                    <img src={man} alt="Man illustration" className='h-2/3 object-contain max-sm:hidden' />
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    );
}
