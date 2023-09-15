import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useAuth } from '../../../store/auth';
import { FaTrash, FaFileDownload } from 'react-icons/fa';
import Pagination from '../../Pagination/Pagination';
import Modal from '../../Modal';
import DataLoading from '../../Loading/DataLoading';

import { axiosRequest } from '../../../service/axios';
import { exportMultiSheetExcel } from '../../../utils/exportExcel';

import { ProjectType } from '../../../@types';

import './index.scss';

interface PropsType {
  data: ProjectType[];
  isLoading: boolean;
  deleteProject: Function;
  pagination: boolean;
}

const Table = (props: PropsType) => {
  const navigate = useNavigate();

  const tableData = props.data;
  const pagination = props.pagination;

  const [deleteId, setDeleteId] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectId, setSelectId] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [PageSize, setPageSize] = useState<number>(10);

  const { user } = useAuth();

  const currentTableData = useMemo(() => {
    if (
      PageSize > tableData.length - (currentPage - 1) * PageSize &&
      currentPage !== Math.ceil(tableData.length / PageSize)
    ) {
      if (tableData.length < PageSize) {
        const firstPageIndex = 0;
        const lastPageIndex = tableData.length;
        return tableData.slice(firstPageIndex, lastPageIndex);
      } else {
        const firstPageIndex = tableData.length - PageSize;
        const lastPageIndex = tableData.length;
        return tableData.slice(firstPageIndex, lastPageIndex);
      }
    } else {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;
      return tableData.slice(firstPageIndex, lastPageIndex);
    }
  }, [currentPage, PageSize, tableData]);

  const onChangeHandle = (e: string) => {
    setPageSize(parseInt(e));
  };

  const handleMouseOver = (e: number) => {
    setSelectId(e);
  };

  const handleMouseOut = (e: number) => {
    setSelectId(e);
  };

  const editProject = (projectId: number, extractorId: number, extractorName: string) => {
    navigate(`/app/extractions/${projectId}?modelId=${extractorId}&modelName=${extractorName}`);
  };

  const downloadProject = async (id: number) => {
    try {
      if (id) {
        const url = `/api/v1/project/${id}`;
        const res = await axiosRequest('GET', url, false);

        exportMultiSheetExcel(res.data.data);
      }
    } catch (err) {
      console.error('downloadExtractions = ', err);
    }
  };

  const deleteProject = () => {
    if (deleteId) {
      props.deleteProject(deleteId);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="main-table">
        <div className="t-header text-center">
          {user.role === 'systemAdmin' ? (
            <span className="text-left span">Company</span>
          ) : (
            <></>
          )}
          <span className="text-left span">Type</span>
          <span className="text-left span">Name</span>
          <span className="text-left span">Project ID</span>
          <span className="span">Extraction ID</span>
          <span className="span">Date Created</span>
          <span className="span">Number of Documents</span>
          <span className="span">Download</span>
          <span className="span">Delete</span>
        </div>
        <div className="t-body">
          {props.isLoading ? (
            <div className="w-full flex flex-col items-center justify-center !pt-0 !pb-[50px] px-[10px]">
              <DataLoading />
            </div>
          ) : currentTableData.length === 0 ? (
            <div className="w-full flex justify-center items-center">No data</div>
          ) : (
            (pagination ? currentTableData : tableData).map((ele, ind) => {
              let status = '';

              if (Array.isArray(ele.data)) {
                if (ele.data.length === 0) {
                  status = 'Draft';
                } else {
                  const index = ele.data.findIndex((data) => {
                    return !data.extractedData && !data.extractedDate;
                  });
                  status = index === -1 ? 'Completed' : 'Draft';
                }
              }

              return (
                <div
                  key={ind}
                  className="t-content hover:bg-lightgrey cursor-pointer text-center"
                  onMouseOver={() => handleMouseOver(ele.id)}
                  onMouseLeave={() => handleMouseOut(-1)}
                >
                  {user.role === 'systemAdmin' ? (
                    <span className="text-left span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>
                      {(ele.owner.name || '') + " #" + ele.owner.id}
                    </span>
                  ) : (
                    <></>
                  )}
                  <span className="text-left span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>
                    {ele.model.extractorName}
                  </span>
                  <span className="text-left span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>
                    {ele.projectName}
                  </span>
                  <span className="text-left span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>
                    {ele.projectId}
                  </span>
                  <span className="span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>{ele.id}</span>
                  <span className="span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>{ele.createdAt.slice(0, 10)}</span>
                  <span className="span-child" onClick={() => editProject(ele.id, ele.model.id, ele.model.extractorName)}>{ele.data.length}</span>
                  {selectId === ele.id && status === 'Completed' ? (
                    <span className="span-child"
                      onClick={() => {
                        downloadProject(ele.id);
                      }}
                    >
                      <FaFileDownload className="items-center m-[auto]" />
                    </span>
                  ) : (
                    <span className="span-child">
                      <label
                        className={classNames('px-[8px] py-[5px] rounded-full', {
                          'bg-zinc-200': status === 'Draft',
                          'bg-flexblue text-white': status === 'Completed',
                        })}
                      >
                        {status}
                      </label>
                    </span>
                  )}
                  <span className="span-child"
                    onClick={() => {
                      setShowModal(true);
                      setDeleteId(ele.id);
                    }}
                  >
                    <FaTrash className="items-center m-[auto]"/>
                  </span>
                </div>
              );
            })
          )}
        </div>
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
            }}
          >
            <div
              className={classNames(
                'modal max-w-[450px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%]'
              )}
            >
              <h1 className="text-[16px] font-medium mt-[20px] text-zinc-800">Warning!</h1>
              <p className="text-[16px] mt-[10px] mb-[30px] text-zinc-700">Do you want to delete this project?</p>
              <div className="flex justify-end gap-[20px]">
                <button
                  className="w-[80px] h-[30px] rounded bg-blue text-white hover:bg-hoverblue"
                  onClick={deleteProject}
                >
                  Yes
                </button>
                <button
                  className="w-[80px] h-[30px] rounded text-dark bg-lightgrey hover:bg-grey"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
      {pagination ? (
        <div className="position place-content-center flex w-full">
          <div className="w-1/8"></div>
          <div className="w-1/8 pr-[10px]">
            <select className="select" value={PageSize} onChange={(e) => onChangeHandle(e.target.value)}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <Pagination
            className="pagination-bar w-3/4"
            currentPage={currentPage}
            totalCount={tableData.length}
            siblingCount={1}
            pageSize={PageSize}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export { Table };
