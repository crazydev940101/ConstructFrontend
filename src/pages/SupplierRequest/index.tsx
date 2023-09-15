/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import classNames from 'classnames';
import { FaFileDownload, FaTrash } from 'react-icons/fa';

import Modal from '../../components/Modal';
import Upload from '../../components/Main/Upload';


import { SupplirUploadType } from '../../@types';

interface DetailKeyType {
  name: string;
  industry: string;
  location: string;
}

interface DetailType {
  title: string;
  type: DetailKeyValues;
}

type DetailKeyValues = 'name' | 'industry' | 'location';

const SupplierRequest = () => {

  const tabs = ['Upload Files'];
  const details = [
    {
      title: 'Supplier Name',
      type: 'name',
    },
    {
      title: 'Industry',
      type: 'industry',
    },
    {
      title: 'Supplier location',
      type: 'location',
    },
  ] as DetailType[];

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [checkAll, setCheckAll] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<SupplirUploadType[]>([]);
  const [projectDetail, setProjectDetail] = useState<DetailKeyType>({
    name: '',
    industry: '',
    location: '',
  });

  const updateDetail = (key: DetailKeyValues, value: string) => {
    setProjectDetail((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const addFiles = (files: SupplirUploadType[]) => {
    setUploadFiles([...files, ...uploadFiles]);
    setShowModal(false);
  };

  const updateCheckedList = (index: number, value: boolean) => {
    setUploadFiles((prev) => {
      let _files = [...prev];
      _files[index].checked = value;
      const filter = _files.filter((file) => {
        return file.checked !== value;
      });

      if (!value) {
        setCheckAll(false);
      } else if (filter.length === 0) {
        setCheckAll(value);
      }

      return _files;
    });
  };

  const updateCheckAll = (value: boolean) => {
    setCheckAll(value);
    setUploadFiles((prev) => {
      let _files = [...prev];
      _files.map((file) => {
        return (file.checked = value);
      });

      return _files;
    });
  };

  const removeFile = (index: number) => {
    setUploadFiles((prev) => {
      const _files = [...prev];
      _files.splice(index, 1);

      return _files;
    });
  };

  const onSubmit = () => {
    if (uploadFiles.length > 0) {
      // Add submit function
      setShowSubmitModal(true);
    }
  };

  return (
    <div className="main-board">
      <h1 className="text-[20px] font-bold">Supplier Request</h1>
      <p className="text-[18px] font-normal mb-[30px] leading-[24px] text-neutral-500 max-[360px]:text-[14px]">
        Would you like use to train a machine learning model for a supplier? Upload a minimum of delivery tickets below
        and we will develop a machine learning for that supplier
      </p>
      <h2 className="text-[16px] font-bold mb-[30px]">Supplier Details</h2>
      <div className="flex flex-wrap gap-[40px] xl:gap-[80px] text-[14px] text-gray-600 mb-[70px]">
        <div className="detail">
          {details.map((ele, ind) => (
            <div key={ind}>
              <p className="w-[120px] xs:w-[150px]">
                {ele.title}
                {ele.type === 'name' && <span className="text-red-500">*</span>}
              </p>
              <input
                type="text"
                placeholder="Add text"
                value={projectDetail[ele.type]}
                onChange={(e) => {
                  updateDetail(ele.type, e.target.value);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="tab mb-[20px]">
        {tabs.map((ele, ind) => (
          <div
            key={ind}
            className={classNames('', { active: tabIndex === ind })}
            onClick={() => {
              setTabIndex(ind);
            }}
          >
            {ele}
            {ind === 0 && `(${uploadFiles.length})`}
          </div>
        ))}
      </div>
      {tabIndex === 0 &&
        (uploadFiles.length === 0 ? (
          <Upload addFiles={addFiles} />
        ) : (
          <div className="overflow-auto w-full">
            <div className="flex text-[14px] font-medium">
              <input
                type="checkbox"
                className="min-w-[15px] text-[20px]"
                checked={checkAll}
                onChange={() => {
                  updateCheckAll(!checkAll);
                }}
              />
              <span className="min-w-[250px] w-[35%] pl-[10px]">File Name</span>
              <span className="min-w-[100px] w-[20%]">Upload date</span>
              <span className="min-w-[70px] w-[10%] text-center">Download</span>
              <span className="min-w-[70px] w-[10%] text-center">Remove</span>
            </div>
            {uploadFiles.map((ele, ind) => (
              <div key={ind} className="flex text-[14px] py-[5px]">
                <input
                  type="checkbox"
                  checked={ele.checked}
                  className="min-w-[15px]"
                  onChange={() => {
                    updateCheckedList(ind, !ele.checked);
                  }}
                />
                <span className="min-w-[250px] w-[35%] pl-[10px]">{ele.name}</span>
                <span className="min-w-[100px] w-[20%]">{ele.createdAt}</span>
                <span className="min-w-[70px] w-[10%] flex justify-center items-center">
                  <FaFileDownload className="text-gray-600 hover:cursor-pointer hover:text-gray-900" />
                </span>
                <span className="min-w-[70px] w-[10%] flex justify-center items-center">
                  <FaTrash
                    className="text-gray-600 hover:cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      removeFile(ind);
                    }}
                  />
                </span>
              </div>
            ))}
          </div>
        ))}
      <div className="flex flex-wrap gap-[20px] xs:gap-[40px] mt-[20px]">
        <button
          className="text-white bg-blue hover:bg-hoverblue border-[1px] border-blue rounded px-[30px] py-[10px] text-[14px] max-[360px]:w-[100%]"
          onClick={() => setShowModal(true)}
        >
          + Upload files
        </button>
        <button
          className="text-blue hover:text-white bg-transparent hover:bg-blue border-[1px] border-blue rounded px-[30px] py-[10px] text-[14px] max-[360px]:w-[100%]"
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[600px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%]',
              { 'top-[50%]': showModal, 'top-[-100%]': !showModal }
            )}
          >
            <h1 className="text-[16px] font-medium mb-[15px]">Add more files here</h1>
            <Upload addFiles={addFiles} />
          </div>
        </Modal>
      )}
      {showSubmitModal && (
        <Modal
          onClose={() => {
            setShowSubmitModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[500px] w-[95%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%] top-[50%]'
            )}
          >
            <h1 className="text-[16px] font-medium mt-[20px] text-zinc-800 text-center">
              Thank you for submitting a supplier request
            </h1>
            <p className="text-[16px] mt-[40px] text-center mb-[30px] text-zinc-700">
              We aim to have machine learning models built within 7 days but this sometimes takes a bit longer but rest
              assured we are on it.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupplierRequest;
