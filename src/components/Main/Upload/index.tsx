/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import useFileUpload from 'react-use-file-upload';

interface PropsType {
  addFiles: Function;
}

const Upload = (props: PropsType) => {
  const { files, setFiles, clearAllFiles, handleDragDropEvent } = useFileUpload();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [dragOver, setDragOver] = useState<boolean>(false);

  useEffect(() => {
    if (files.length > 0) {
      props.addFiles(files);

      if (inputRef.current) {
        inputRef.current.files = null;
        inputRef.current.value = '';
      }
      clearAllFiles();
    }
  }, [files]);

  return (
    <>
      {
        <div
          className={`w-[100%] flex flex-col items-center justify-center border-blue border-[4px] py-[100px] px-[10px] mr-[50px] max-[390px]:py-[40px] max-[1024px]:w-full ${
            dragOver ? 'bg-white border-dashed' : 'border-dotted bg-[#f2f8fd]'
          }`}
          onDragEnter={(e: any) => {
            handleDragDropEvent(e);
          }}
          onDragLeave={(e: any) => {
            handleDragDropEvent(e);
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDragOver(false);
            }
          }}
          onDragOver={(e: any) => {
            handleDragDropEvent(e);
            setDragOver(true);
          }}
          onDrop={(e: any) => {
            handleDragDropEvent(e);
            setDragOver(false);
            setFiles(e);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e: any) => {
              setFiles(e);
              if (inputRef.current) {
                inputRef.current.files = null;
              }
            }}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <p className="text-[16px] font-medium text-blue mb-[30px] max-w-[400px] text-center">
            Drag and Drop or click to add files you want to extract data from
          </p>
          <button
            className="text-white bg-blue hover:bg-hoverblue rounded px-[30px] py-[10px] text-[14px]"
            onClick={() => inputRef.current?.click()}
          >
            + Upload files
          </button>
          <div className="mt-[20px]">
            <p className="text-[#4275e7] text-[14px] py-[2px] font-medium">
              <span className="mr-[10px]">+</span>Only PDF and image files(JPEG/JPG, PNG){/*BMP, TIFF*/}
            </p>
            <p className="text-[#4275e7] text-[14px] py-[2px] font-medium">
              <span className="mr-[10px]">+</span>Image dimensions: 50 x 50 to 10,000 x 10,000 px.
            </p>
            <p className="text-[#4275e7] text-[14px] py-[2px] font-medium">
              <span className="mr-[10px]">+</span>PDF dimensions: up to 17 x 17 inches.
            </p>
            <p className="text-[#4275e7] text-[14px] py-[2px] font-medium">
              <span className="mr-[10px]">+</span>File size: less than 500 MB
            </p>
            <p className="text-[#4275e7] text-[14px] py-[2px] font-medium">
              <span className="mr-[10px]">+</span>Page limit: 2000.
            </p>
            <p className="text-[#4275e7] text-[14px] py-[2px] font-medium">
              <span className="mr-[10px]">+</span>No password-locked PDFs.
            </p>
          </div>
        </div>
      }
    </>
  );
};

export default Upload;
