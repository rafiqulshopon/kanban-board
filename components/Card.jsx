'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Copy,
  User,
  PlusCircle,
  Plus,
} from 'react-feather';

import image1 from '@/public/3.jpg';
import ImageUploadModal from '@/components/ImageUploadModal.jsx';

export default function Card({ item }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const iconStyle = { color: '#4b5563' };

  return (
    <div className='bg-white rounded-md p-4 space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-1'>
          <Image
            src={image1}
            alt='from image'
            width={25}
            height={25}
            className='rounded-full'
          />
          <span className='text-gray-500 text-sm'>{item.from}</span>
        </div>
        <div className='flex items-center space-x-1'>
          <Image
            src={image1}
            alt='to image'
            width={25}
            height={25}
            className='rounded-full'
          />
          <span className='text-gray-500 text-sm'>{item.to}</span>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-1'>
          <User size={15} style={iconStyle} />
          <div className='text-gray-500 text-sm w-60 h-4 truncate'>
            {item.description}
          </div>
        </div>
        <div className='flex items-center space-x-1 bg-gray-100 p-[.1rem]'>
          <Copy size={15} style={iconStyle} />
          <span className='text-gray-500 text-sm'>1/2</span>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-1'>
          <Image
            src={image1}
            alt='from image'
            width={25}
            height={25}
            className='rounded-full mr-4'
          />
          <Image
            src={image1}
            alt='to image'
            width={25}
            height={25}
            className='rounded-full'
          />
        </div>
        {item.contributor > 10 ? (
          <div className='flex items-center space-x-1 bg-gray-100 text-xs p-[.1rem] rounded-full'>
            <PlusCircle size={15} style={iconStyle} />
            <span className='text-gray-900 text-xs'>10+</span>
          </div>
        ) : (
          <div className='flex items-center space-x-1 bg-gray-100 text-xs p-[.1rem] rounded-full'>
            <span className='text-gray-900 text-xs'>{item.contributor}</span>
            <Plus size={12} style={iconStyle} />
          </div>
        )}
        {item.comment > 12 ? (
          <div className='flex items-center space-x-1 text-sm'>
            <MessageSquare size={15} style={iconStyle} />
            <span className='text-gray-900 text-xs'>12+</span>
          </div>
        ) : (
          <div className='flex items-center space-x-1 text-sm'>
            <MessageSquare size={15} style={iconStyle} />
            <span className='text-gray-900 text-xs'>{item.comment}</span>
          </div>
        )}
        <div
          className='flex items-center space-x-1 text-sm'
          role='button'
          tabIndex={0}
          onClick={showModal}
        >
          <Paperclip size={15} style={iconStyle} />
          <span className='text-gray-900 text-xs'>{item.imageCount}</span>
        </div>
        <div className='flex items-center space-x-1 text-sm'>
          <Calendar size={15} style={iconStyle} />
          <span className='text-gray-700 text-xs'>
            {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      <ImageUploadModal
        isModalVisible={isModalVisible}
        onClose={handleCancel}
        item={item}
      />
    </div>
  );
}
