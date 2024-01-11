'use client';

import React, { useState, useEffect } from 'react';
import axiosInstance from '../axios';
import Card from '@/components/Card.jsx';

export default function List() {
  const [taskGroups, setTaskGroups] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollbarStyles =
    'scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/task');
        const groupedTasks = groupTasksByStatus(response.data);
        setTaskGroups(groupedTasks);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupTasksByStatus = (tasks) => {
    return tasks.reduce((groups, task) => {
      const status = task.status || 'others';
      groups[status] = groups[status] || [];
      groups[status].push(task);
      return groups;
    }, {});
  };

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
    <div className='h-screen flex overflow-x-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-100'>
      {Object.entries(taskGroups).map(([status, tasks]) => (
        <div className='w-[28rem] bg-gray-100' key={status}>
          <div className='px-2 h-16 flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-5 h-6 ${getStatusColor(status)} rounded-l-full`}
              ></div>
              <span className='text-gray-800 font-semibold leading-7'>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
          <div className='space-y-4 overflow-y-auto h-[calc(100%-4rem)] pb-28 px-2'>
            {tasks.map((task, index) => (
              <Card key={task._id || index} item={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
