import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaFileDownload } from 'react-icons/fa';

import Loading from '../../Loading/PageLoading';

import { exportExcel } from '../../../utils/exportExcel';
import { axiosRequest } from '../../../service/axios';
import Pagination from '../../Pagination/Pagination';

import { ProjectUploadType } from '../../../@types';

interface PropsType {
  uploadFiles: ProjectUploadType[];
  pagination: boolean;
}

const Downloads = (props: PropsType) => {
  const [isDownloading, setIsDownloading] = useState<boolean[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [PageSize, setPageSize] = useState<number>(10);

  const onChangeHandle = (e: string) => {
    setPageSize(parseInt(e));
  };

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

  const updateDownloading = (key: number, value: boolean) => {
    setIsDownloading((prev) => {
      let data = [...prev];
      data[key] = value;
      return data;
    });
  };

  const downloadExtraction = async (documentId: number, index: number) => {
    updateDownloading(index, true);
    try {
      const res = await axiosRequest('GET', `/api/v1/document/${documentId}`, true);
      exportExcel(res.data);
    } catch (err) {
      console.error('downloadExtraction = ', err);
      toast.error('File download error!');
    }
    updateDownloading(index, false);
  };

  useEffect(() => {
    const arr = Array(props.uploadFiles.length).fill(false);
    setIsDownloading(arr);
  }, [props.uploadFiles]);

  return (
    <div className="overflow-auto w-full">
      <div className="flex text-[14px] font-medium">
        <span className="min-w-[50px] pr-[10px] text-center">ID</span>
        <span className="min-w-[250px] w-[40%] px-[10px]">File Name</span>
        <span className="min-w-[100px] w-[25%] px-[5px]">Extraction date</span>
        <span className="min-w-[70px] w-[15%] text-center px-[5px]">Download</span>
      </div>
      {currentTableData.map((ele, ind) => (
        <div key={ind} className="flex text-[14px] py-[5px]">
          <span className="min-w-[50px] pr-[10px] text-center">{ele.id}</span>
          <span
            className=" min-w-[250px] w-[40%] px-[10px] overflow-hidden whitespace-nowrap text-ellipsis hover:cursor-pointer hover:underline hover:text-blue"
            onClick={() => {
              downloadExtraction(ele.id, ind);
            }}
          >
            {ele.documentName}
          </span>
          <span className="min-w-[100px] w-[25%] px-[5px]">{ele.extractedDate?.slice(0, 10)}</span>
          <span className="min-w-[70px] w-[15%] flex justify-center items-center px-[5px]">
            {isDownloading[ind] ? (
              <Loading size={20} />
            ) : (
              <FaFileDownload
                className="text-gray-600 hover:cursor-pointer hover:text-gray-900"
                onClick={() => downloadExtraction(ele.id, ind)}
              />
            )}
          </span>

        </div>
      ))}
      {props.uploadFiles.length === 0 && <p className="mt-[20px] text-center">No data</p>}
      {props.uploadFiles.length !== 0 && pagination ? (
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
  );
};

export default Downloads;
