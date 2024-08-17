import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

  type Complaints = {
    PostId: number;
    GoogleId: number;
    Complaint: string;
    Status: string;
    Name: string;
    RoomNumber: string;
    Floor: string;
    CreatedAt: string;
    UpdatedAt: string;
  };

export default function Home() {
  const [complaints, setComplaints] = useState<Complaints[]>([]);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    fetch('https://fixxyapi.rajvikash-r2022cse.workers.dev/posts')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched Data:', data); // Log the fetched data to inspect its structure

        // Check if data.posts and data.posts.results exist and are an array
        if (data.posts && Array.isArray(data.posts.results)) {
          setComplaints(data.posts.results);
        } else {
          console.error('Unexpected data format:', data);
          setError('Failed to load complaints. Unexpected data format.');
        }
      })
      .catch((error) => {
        console.error('Error fetching complaints:', error);
        setError('Error fetching complaints.');
      });
  }, []);

  return (
    <div className='bg-gray-100 h-screen flex flex-col'>
      {/* Header */}
      <div className='bg-purple-600 p-4 flex justify-between items-center rounded-lg mb-6 m-3 shadow-purple-400 shadow-lg'>
        <h1 className='text-white font-bold text-3xl'>Welcome back, Admin!</h1>
        <Link to={'/'}>
          <button className='text-white font-semibold text-xl hover:scale-110 drop-shadow-lg'>
            Logout
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6'>
        {/* Complaints Section */}
        <h2 className='text-5xl font-semibold mb-10'>Today's Complaints: {complaints.length}</h2>
        {error ? (
          <p className='text-red-600'>{error}</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {complaints.length > 0 ? (
              complaints.map((complaint) => (
                <div key={complaint.PostId} className='bg-white p-4 rounded-lg shadow-lg'>
                  <div className='flex flex-row justify-between'>
                    <h3 className='text-3xl font-bold mb-2 border-l-4 p-1 border-red-700'>{complaint.Complaint}</h3>
                    <h2 className='bg-black p-3 text-white font-semibold rounded-tl-2xl'>Room No : {complaint.RoomNumber}</h2>
                  </div>
                  <p className='text-xl font-semibold mb-4'>
                    Status: <span className='text-orange-400 text-lg animate-pulse'>{complaint.Status}</span>
                  </p>
                  <Link to={`/details/${complaint.GoogleId}/${complaint.PostId}`}>
                    <button className='bg-purple-600 text-white px-4 py-2 rounded-lg hover:scale-95 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500'>
                      View Details
                    </button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No complaints available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
