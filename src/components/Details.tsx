import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Complaints = {
  PostId: number;
  GoogleId: string;
  Complaint: string;
  Status: string;
  Name: string;
  RoomNumber: string;
  Floor: string;
  CreatedAt: string;
  UpdatedAt: string;
};

export default function Details() {
  const [details, setDetails] = useState<Complaints | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { GoogleId, PostId } = useParams<{ GoogleId: string; PostId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!GoogleId || !PostId) {
      console.error('GoogleId or PostId is missing');
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await fetch(`https://fixxyapi.rajvikash-r2022cse.workers.dev/posts/${GoogleId}/${PostId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched Data:', data);

        // Directly set details if data.post is an object
        if (data.post) {
          setDetails(data.post);
        } else {
          console.error('Unexpected data format:', data);
          setError('Failed to load complaint details.');
        }
      } catch (error) {
        console.error('Error fetching complaint:', error);
        setError('Error fetching complaint details.');
      }
    };

    fetchDetails();
  }, [GoogleId, PostId]);

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleResolved = () => {
    fetch(`https://fixxyapi.rajvikash-r2022cse.workers.dev/posts/${GoogleId}/${PostId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })  // Update complaint status to 'Resolved'
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Complaint updated successfully') {
          toast.success('Complaint marked as resolved');
          // Optionally, you can update the state or navigate to another page
        } else {
          toast.error('Failed to resolve complaint: ' + (data.error || 'Unknown error'));
        }
      })
      .catch(error => {
        toast.error('Error updating complaint: ' + error.toString());
      });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Returns only the date portion in 'MM/DD/YYYY' format by default
  };

  return (
    <div className='flex flex-col h-screen items-center justify-center bg-gray-100 p-4'>
      <ToastContainer />
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-lg'>
        <h2 className='text-2xl font-semibold mb-6 text-gray-800'>Complaint Details</h2>
        {error ? (
          <p className='text-red-600'>{error}</p>
        ) : details ? (
          <div className='overflow-x-auto'>
            <table className='table-auto w-full border-collapse'>
              <tbody>
                <tr>
                  <td className='border px-4 py-2 font-medium text-gray-700'>Name</td>
                  <td className='border px-4 py-2'>{details.Name}</td>
                </tr>
                <tr>
                  <td className='border px-4 py-2 font-medium text-gray-700'>Room Number</td>
                  <td className='border px-4 py-2'>{details.RoomNumber}</td>
                </tr>
                <tr>
                  <td className='border px-4 py-2 font-medium text-gray-700'>Floor</td>
                  <td className='border px-4 py-2'>{details.Floor}</td>
                </tr>
                <tr>
                  <td className='border px-4 py-2 font-medium text-gray-700'>Complaint</td>
                  <td className='border px-4 py-2'>{details.Complaint}</td>
                </tr>
                <tr>
                  <td className='border px-4 py-2 font-medium text-gray-700'>Status</td>
                  <td className='border px-4 py-2'>{details.Status}</td>
                </tr>
                <tr>
                  <td className='border px-4 py-2 font-medium text-gray-700'>Posted At</td>
                  <td className='border px-4 py-2'>{formatDate(details.CreatedAt)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex flex-row items-center justify-center'>
            <span className="loader text-center"></span>
          </div>
        )}

        <div className='flex flex-row justify-around mt-6'>
          <button
            type='button'
            onClick={handleBack}
            className='bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
          >
            Back
          </button>
          <button
            type='button'
            onClick={handleResolved}
            className='bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            Resolved
          </button>
        </div>
      </div>
    </div>
  );
}
