'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import Card from '@/components/Card.jsx';

export default function List() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollbarStyles =
    'scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/task');
        setTasks(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'incomplete':
        return 'bg-red-600';
      case 'todo':
        return 'bg-blue-400';
      case 'doing':
        return 'bg-yellow-400';
      case 'under_review':
        return 'bg-purple-400';
      case 'completed':
        return 'bg-green-400';
      case 'overdue':
        return 'bg-orange-400';
      default:
        return 'bg-gray-400';
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={`flex overflow-x-auto ${scrollbarStyles} h-screen`}>
      <div className='flex space-x-4'>
        {tasks.map((task, index) => (
          <div
            className='w-[28rem] bg-gray-100 h-screen'
            key={task._id || index}
          >
            <div className='flex items-center justify-between px-2 h-16'>
              <div className='flex items-center space-x-2'>
                <div
                  className={`w-5 h-6 ${getStatusColor(
                    task.status
                  )} rounded-l-full`}
                ></div>
                <span className='text-gray-800 font-semibold leading-7'>
                  {task.name}
                </span>
              </div>
              <div className='text-gray-800 leading-7 px-2 py-1 rounded-lg flex items-center justify-center bg-gray-200 font-medium'>
                {task.imageCount}
              </div>
            </div>
            <div
              className={`space-y-4 overflow-y-auto px-2 ${scrollbarStyles} h-[calc(100%-4rem)] pb-28`}
            >
              <Card item={task} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
