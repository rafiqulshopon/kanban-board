'use client';

import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import axiosInstance from '../axios';
import Card from '@/components/Card.jsx';

export default function List() {
  const [taskGroups, setTaskGroups] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const orderedStatuses = [
    'incomplete',
    'todo',
    'doing',
    'under_review',
    'completed',
    'overdue',
  ];

  const groupAndSortTasks = (tasks) => {
    let grouped = orderedStatuses.reduce(
      (obj, status) => ({ ...obj, [status]: [] }),
      {}
    );

    tasks.forEach((task) => {
      const status = task.status || 'others';
      if (grouped.hasOwnProperty(status)) {
        grouped[status].push(task);
      } else {
        if (!grouped.others) {
          grouped.others = [];
        }
        grouped.others.push(task);
      }
    });

    return grouped;
  };

  const statusColorMap = {
    incomplete: 'bg-red-600',
    todo: 'bg-blue-400',
    doing: 'bg-yellow-400',
  };

  const getStatusColor = (status) => {
    return statusColorMap[status] || '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/task');
        const groupedAndSortedTasks = groupAndSortTasks(response.data);
        setTaskGroups(groupedAndSortedTasks);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spin size='large' />
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='bg-white h-screen flex overflow-x-auto'>
      {Object.entries(taskGroups).map(([status, tasks]) => (
        <div
          className='w-[28rem] bg-gray-100 m-2 rounded-lg shadow'
          key={status}
        >
          <div className='px-4 h-16 flex items-center justify-between bg-white rounded-t-lg border-b border-gray-200'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-5 h-6 ${getStatusColor(status)} rounded-l-full`}
              ></div>
              <span className='text-gray-800 font-semibold leading-7'>
                {status
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </span>
            </div>
            <div className='text-gray-800 px-2 py-1 rounded-lg flex items-center justify-center bg-gray-200 font-medium'>
              {tasks.length}
            </div>
          </div>
          <div className='space-y-4 overflow-y-auto h-[calc(100%-4rem)] p-4'>
            {tasks.map((task, index) => (
              <Card key={task._id || index} item={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
