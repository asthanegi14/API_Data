import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import defaultImg from '../assets/defaultImg.jpeg';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const itemsPerPage = 4;
    const api = import.meta.env.VITE_API;

    const profileRef = useRef(null);

    useEffect(() => {
        axios.get(api)
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [api]);

    useEffect(() => {
        if (selectedUser && profileRef.current) {
            profileRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedUser]);

    if (loading) {
        return <p className='flex flex-col bg-emerald-950 text-white bg-opacity-95 h-screen p-10 justify-center items-center font-bold text-3xl'>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.message}</p>;
    }

    const handleImageError = (e) => {
        e.target.src = defaultImg;
    };

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className='flex flex-col lg:flex-row bg-emerald-950 text-white bg-opacity-95 h-full p-10'>
            <div className='flex flex-col gap-8 lg:w-1/2'>
                <h1 className='text-2xl font-bold text-center'>Users List</h1>
                {paginatedUsers.map((user) => (
                    <div key={user.id} >
                        <div className='flex gap-8 hover:scale-105 hover:shadow-lg p-2 cursor-pointer' onClick={() => handleUserClick(user)}>
                            <div className="w-20">
                                <img
                                    src={user.avatar}
                                    alt={`${user.profile.firstName} ${user.profile.lastName}`}
                                    className='rounded-full w-20 h-20 object-cover '
                                    onError={handleImageError}
                                />
                            </div>
                            <div className="text">
                                <p className='font-bold '>{user.profile.firstName} {user.profile.lastName}</p>
                                <p className='text-xs'>{user.jobTitle}</p>
                            </div>
                        </div>
                        <hr className='w-full text-white opacity-30' />
                    </div>
                ))}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 ${currentPage === 1 ? 'bg-gray-300 text-black' : 'bg-green-700 text-white'}`}
                    >
                        &lt;
                    </button>
                    <span className='px-3 py-1 bg-gray-300 text-black'>{currentPage}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 ${currentPage === totalPages ? 'bg-gray-300 text-black' : 'bg-green-700 text-white'}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>
            <div ref={profileRef} className='flex lg:w-1/2 lg:p-10 mt-8 lg:mt-0 justify-center items-center'>
                {selectedUser && (
                    <div className='flex flex-col bg-emerald-900 p-8 gap-4 justify-center items-center w-full h-fit rounded'>
                        <img
                            src={selectedUser.avatar}
                            alt={`${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`}
                            className='rounded self-center w-40 h-40 object-cover'
                            onError={handleImageError}
                        />
                        <h2 className='text-2xl text-center font-bold mb-4'>{selectedUser.profile.firstName} {selectedUser.profile.lastName}</h2>
                        <div className='flex gap-4 flex-wrap'>
                            <div className="flex flex-col gap-2">
                                <p className='flex text-xs gap-4'>
                                    <span className='font-bold text-left'>Username:</span>
                                    <span className="text-right">
                                        {selectedUser.profile.username ? selectedUser.profile.username : 'No data to display'}
                                    </span>
                                </p>
                                <p className='flex text-xs gap-4'>
                                    <span className='font-bold text-left'>Job Title:</span>
                                    <span className="text-right">
                                        {selectedUser.jobTitle ? selectedUser.jobTitle : 'No data to display'}
                                    </span>
                                </p>
                                <p className='flex text-xs gap-4'>
                                    <span className='font-bold text-left'>Bio: </span>
                                    <span className="text-right">
                                        {selectedUser.Bio ? selectedUser.Bio : 'No data to display'}
                                    </span>
                                </p>
                                <p className='flex text-xs gap-4'>
                                    <span className='font-bold text-left'>Email:</span>
                                    <span className="text-right">
                                        {selectedUser.profile.email ? selectedUser.profile.email : 'No data to display'}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserList;
