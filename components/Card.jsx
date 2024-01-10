'use client';

import React, { useRef, useState } from 'react';
import { List, Modal, Button, Upload } from 'antd';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const fileInputRef = useRef(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log('Uploading files:', fileList);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const uploadFiles = (files) => {
    const updatedFileList = [...fileList];
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updatedFileList.push({
          uid: file.lastModified + file.name,
          name: file.name,
          status: 'done',
          url: e.target.result,
        });
        setFileList([...updatedFileList]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilesChange = (event) => {
    uploadFiles(event.target.files);
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const dataCount = item.id === 1 ? 3 : 0;

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
          <span className='text-gray-900 text-xs'>{fileList.length}</span>
        </div>
        <div className='flex items-center space-x-1 text-sm'>
          <Calendar size={15} style={iconStyle} />
          <span className='text-gray-700 text-xs'>{item.date}</span>
        </div>
      </div>

      <Modal
        title='Attachments'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key='submit'
            className='bg-blue-500 hover:bg-blue-700'
            type='primary'
            onClick={handleOk}
          >
            Upload
          </Button>,
        ]}
      >
        <input
          type='file'
          multiple
          onChange={handleFilesChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Button
          icon={<UploadOutlined />}
          onClick={() => fileInputRef.current.click()}
        >
          Select Files
        </Button>
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
                      src={file.url}
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
      </Modal>
    </div>
  );
}
