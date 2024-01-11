'use client';

import React, { useRef, useState, useEffect } from 'react';
import { List, Modal, Button, Spin } from 'antd';
import axiosInstance from '../axios';
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
import { UploadOutlined, CloseCircleOutlined } from '@ant-design/icons';

import image1 from '@/public/3.jpg';

export default function Card({ item }) {
  const [existingImages, setExistingImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    try {
      setLoadingImages(true);
      const response = await axiosInstance.get(`/image/${item._id}`);
      setExistingImages(response.data);
      setLoadingImages(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoadingImages(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    fetchImages();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFilesChange = (event) => {
    const files = event.target.files;
    const newFileList = Array.from(files).map((file) => ({
      ...file,
      uid: file.lastModified + file.name,
      preview: URL.createObjectURL(file),
    }));
    setFileList(newFileList);
    setSelectedFiles(files);
  };

  console.log({ selectedFiles });

  // Function to upload files
  const uploadImages = async () => {
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }
    formData.append('taskId', item._id);

    try {
      const response = await axiosInstance.post('/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = async () => {
    await uploadImages();
    setIsModalVisible(false);
    setFileList([]);
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  useEffect(() => {
    return () => {
      fileList.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [fileList]);

  const iconStyle = { color: '#4b5563' };

  return (
    <div className='bg-white rounded-md p-2 space-y-2'>
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

      <Modal
        title='Attachments'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key='submit'
            type='primary'
            onClick={handleOk}
            disabled={fileList.length === 0}
            className='bg-blue-500 hover:bg-blue-700'
          >
            Upload
          </Button>,
        ]}
      >
        {loadingImages ? (
          <div className='flex justify-center items-center h-20'>
            <Spin />
          </div>
        ) : (
          <>
            <Button
              icon={<UploadOutlined />}
              onClick={() => fileInputRef.current.click()}
            >
              Select Files
            </Button>
            <List
              itemLayout='horizontal'
              dataSource={existingImages}
              renderItem={(image) => (
                <List.Item>
                  <Image
                    src={image.image_url}
                    alt='Attachment'
                    width={50}
                    height={50}
                    className='rounded-full'
                  />
                </List.Item>
              )}
            />
            <input
              type='file'
              multiple
              onChange={handleFilesChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <List
              itemLayout='horizontal'
              dataSource={fileList}
              renderItem={(file) => (
                <List.Item
                  actions={[
                    <CloseCircleOutlined
                      key={file.uid}
                      onClick={() => handleRemove(file)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                        <Image
                          src={file.preview}
                          alt={file.name}
                          layout='fill'
                          objectFit='cover'
                        />
                      </div>
                    }
                    title={file.name}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>
    </div>
  );
}
