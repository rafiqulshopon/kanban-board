'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Spin, List } from 'antd';
import {
  UploadOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import axiosInstance from '../axios';
import Image from 'next/image';

const ImageUploadModal = ({ isModalVisible, onClose, item, refreshTasks }) => {
  const [existingImages, setExistingImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setLoadingImages(true);
    try {
      const response = await axiosInstance.get(`/image/${item._id}`);
      setExistingImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
    setLoadingImages(false);
  };

  const handleFilesChange = (event) => {
    const files = event.target.files;
    const newFileList = Array.from(files).map((file) => ({
      ...file,
      uid: file.lastModified + file.name,
      preview: URL.createObjectURL(file),
    }));

    setFileList((prevFileList) => prevFileList.concat(newFileList));
    setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, ...files]);
  };

  const handleUploadImages = async () => {
    setIsUploading(true);
    const formData = new FormData();
    for (const file of selectedFiles) {
      formData.append('images', file);
    }
    formData.append('taskId', item._id);

    try {
      await axiosInstance.post('/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOk = async () => {
    await handleUploadImages();
    onClose();
    refreshTasks();
  };

  const handleRemove = (fileUid) => {
    setFileList(fileList.filter((file) => file.uid !== fileUid));
  };

  useEffect(() => {
    if (isModalVisible) {
      fetchImages();
    } else {
      setExistingImages([]);
      setFileList([]);
      setSelectedFiles([]);
    }
  }, [isModalVisible]);

  return (
    <Modal
      title='Attachments'
      open={isModalVisible}
      onOk={handleOk}
      onCancel={onClose}
      footer={[
        <Button key='back' onClick={onClose}>
          Return
        </Button>,
        <Button
          key='submit'
          type='primary'
          onClick={handleOk}
          disabled={fileList.length === 0}
          className='bg-blue-500'
        >
          {isUploading ? <LoadingOutlined /> : 'Upload'}
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
        className='mt-2'
      >
        Select Files
      </Button>
      {loadingImages ? (
        <div className='flex justify-center items-center h-20'>
          <Spin />
        </div>
      ) : existingImages.length > 0 ? (
        <>
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
                  className='w-12 h-12 rounded-full'
                />
              </List.Item>
            )}
          />
        </>
      ) : null}

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
    </Modal>
  );
};

export default ImageUploadModal;
