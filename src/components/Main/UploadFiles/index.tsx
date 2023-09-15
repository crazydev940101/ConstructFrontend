/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import classNames from 'classnames';
import { FaTrash, FaFileDownload } from 'react-icons/fa';

import Modal from '../../Modal';
import Upload from '../Upload';
import Loading from '../../Loading/PageLoading';
import DataLoading from '../../Loading/DataLoading';

import { config } from '../../../config';
import { saveAsFile } from '../../../utils/saveAsFile';
import { saveAsJson } from '../../../utils/saveAsJson';
import { axiosRequest } from '../../../service/axios';
import { getLocalStorage } from '../../../store/storage';
import Pagination from '../../Pagination/Pagination';

import { ProjectUploadType } from '../../../@types';
import { useAuth } from '../../../store/auth';

interface PropsType {
  isExtracting: boolean;
  isUploading: boolean;
  uploadFiles: ProjectUploadType[];
  addFiles: Function;
  updateFiles: Function;
  pagination: boolean;
}

const UploadFiles = (props: PropsType) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean[]>([]);
  const [isDownloadingJson, setIsDownloadingJson] = useState<boolean[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [PageSize, setPageSize] = useState<number>(10);
  const {user} = useAuth()
  const pagination = props.pagination;
  const file_data = props.uploadFiles;

  const currentTableData = useMemo(() => {
    if (
      PageSize > file_data.length - (currentPage - 1) * PageSize &&
      currentPage !== Math.ceil(file_data.length / PageSize)
    ) {
      if (file_data.length < PageSize) {
        const firstPageIndex = 0;
        const lastPageIndex = file_data.length;
        return file_data.slice(firstPageIndex, lastPageIndex);
      } else {
        const firstPageIndex = file_data.length - PageSize;
        const lastPageIndex = file_data.length;
        return file_data.slice(firstPageIndex, lastPageIndex);
      }
    } else {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return file_data.slice(firstPageIndex, lastPageIndex);
    }
  }, [currentPage, PageSize, file_data]);

  const onChangeHandle = (e: string) => {
    setPageSize(parseInt(e));
  };

  const updateDownloading = (key: number, value: boolean) => {
    setIsDownloading((prev) => {
      let data = [...prev];
      data[key] = value;
      return data;
    });
  };

  const updateDownloadingJson = (key: number, value: boolean) => {
    setIsDownloadingJson((prev) => {
      let data = [...prev];
      data[key] = value;
      return data;
    });
  };

  const removeFile = async () => {
    try {
      if (deleteId) {
        await axiosRequest('DELETE', `/api/v1/document/${deleteId}`, true);
        const _files = [...props.uploadFiles];
        const index = _files.findIndex((ele) => {
          return ele.id === deleteId;
        });
        _files.splice(index, 1);

        props.updateFiles(_files);
        setDeleteId(null);
      }
    } catch (err) {
      console.error('removeFile = ', err);
      toast.error('File remove error!');
    }

    setShowDeleteModal(false);
  };

  const downloadFile = async (documentId: number, index: number) => {
    updateDownloading(index, true);
    try {
      const storage = getLocalStorage('accessToken');
      const token = storage.data;

      const res = await axios.get(config.server + `/api/v1/document/file/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const file = props.uploadFiles.filter((file) => file.id === documentId)[0];

      saveAsFile(res.data, file.documentName);
    } catch (err) {
      console.error('downloadExtraction = ', err);
      toast.error('File download error!');
    }
    updateDownloading(index, false);
  };

  const downloadJson = async (documentId: number, index: number) => {
    try {
      updateDownloadingJson(index, true);
      const storage = getLocalStorage('accessToken');
      const token = storage.data;

      const res = await axios.get(config.server + `/api/v1/document/json/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'json',
      });

      const file = props.uploadFiles.filter((file) => file.id === documentId)[0];
      const idx = file.documentName.lastIndexOf('.');
      if (idx !== -1) {
        const baseName = file.documentName.substring(0, idx);
        const filename = baseName + '.json';
        saveAsJson(res.data, filename);
      }
    } catch (err) {
      console.error('downloadExtraction = ', err);
      toast.error('Failed to download extracted result.');
    }
    updateDownloadingJson(index, false);
  };

  useEffect(() => {
    const arr = Array(props.uploadFiles.length).fill(false);
    setIsDownloading(arr);
  }, [props.uploadFiles]);

  return (
    <>
      {file_data.length === 0 ? (
        props.isUploading ? (
          <div className="w-full flex flex-col items-center justify-center bg-[#f2f8fd] border-dotted border-blue border-[4px] pt-[100px] pb-[120px] px-[10px]">
            <DataLoading color={'text-blue'} />
          </div>
        ) : (
          <Upload addFiles={props.addFiles} />
        )
      ) : (
        <div className="overflow-auto w-full">
          <div className="flex text-[14px] font-medium">
            <span className="min-w-[50px] pr-[10px] text-center">ID</span>
            <span className="min-w-[250px] w-[35%] px-[10px]">File Name</span>
            <span className="min-w-[100px] w-[20%] px-[5px]">Upload date</span>
            <span className="min-w-[100px] w-[10%] px-[5px]">Status</span>
            {
              user.role === 'systemAdmin' ?
            <span className="min-w-[70px] w-[10%] text-center px-[5px]" title="Download extracted result as JSON">
              Download
            </span>
            :<></>
            }
            <span className="min-w-[70px] w-[10%] text-center px-[5px]">Remove</span>
          </div>
          {currentTableData.map((ele, ind) => (
            <div key={ele.id} className="flex text-[14px] py-[5px]">
              <span className="min-w-[50px] pr-[10px] text-center">{ele.id}</span>
              <span
                className="min-w-[250px] w-[35%] px-[10px] overflow-hidden whitespace-nowrap text-ellipsis"
                onClick={() => {
                  if (!isDownloading[ind]) downloadFile(ele.id, ind);
                }}
              >
                <div className="flex">
                  <span className={isDownloading[ind] ? '' : 'hover:cursor-pointer hover:underline hover:text-blue'} title='Download document'>
                    {ele.documentName}
                  </span>{' '}
                  {isDownloading[ind] ? (
                    <div className="w-[30px]">
                      <Loading size={20} />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </span>
              <span className="min-w-[100px] w-[20%] px-[5px]">{ele.createdAt.slice(0, 10)}</span>
              <span className="min-w-[100px] w-[10%] px-[5px]">
                {ele.extractedDate ? 'Processed' : props.isExtracting ? 'Extracting' : ''}
              </span>
              {
                user.role === 'systemAdmin' ?
              <span className="min-w-[70px] w-[10%] flex justify-center items-center px-[5px]">
                {isDownloadingJson[ind] ? (
                  <Loading size={20} />
                ) : (
                  <FaFileDownload
                    className={
                      ele.extractedDate ? `text-gray-600 hover:cursor-pointer hover:text-gray-900` : 'text-gray-200'
                    }
                    onClick={() => {
                      if (ele.extractedDate) downloadJson(ele.id, ind);
                    }}
                    title={
                      ele.extractedDate
                        ? 'Download extracted result as JSON'
                        : 'Please extract to download result as JSON'
                    }
                  />
                )}
              </span>
:<></>
              }
              <span className="min-w-[70px] w-[10%] flex justify-center items-center">
                <FaTrash
                  className="text-gray-600 hover:cursor-pointer hover:text-gray-900"
                  onClick={() => {
                    setDeleteId(ele.id);
                    setShowDeleteModal(true);
                  }}
                />
              </span>
            </div>
          ))}
          {pagination ? (
            <div className="position place-content-center flex w-full">
              <div className="w-1/8"></div>
              <div className="w-1/8 pr-[10px] text-[11px]">
                <select className="select" value={PageSize} onChange={(e) => onChangeHandle(e.target.value)}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              <Pagination
                className="pagination-bar w-3/4"
                currentPage={currentPage}
                totalCount={file_data.length}
                siblingCount={1}
                pageSize={PageSize}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
      {showDeleteModal && (
        <Modal
          onClose={() => {
            setShowDeleteModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[450px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%]'
            )}
          >
            <h1 className="text-[16px] font-medium mt-[5px] text-zinc-800">Warning!</h1>
            <p className="text-[16px] mt-[10px] mb-[30px] text-zinc-700">Do you want to delete this project?</p>
            <div className="flex justify-end gap-[20px]">
              <button className="w-[80px] h-[30px] rounded bg-blue text-white hover:bg-hoverblue" onClick={removeFile}>
                Yes
              </button>
              <button
                className="w-[80px] h-[30px] rounded text-dark bg-lightgrey hover:bg-grey"
                onClick={() => {
                  setShowDeleteModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UploadFiles;
