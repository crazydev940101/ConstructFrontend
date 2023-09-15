/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import classNames from 'classnames';

import { useDebounce } from '../../../hooks/useDebounce';

import Modal from '../../../components/Modal';
import Upload from '../../../components/Main/Upload';
import Loading from '../../../components/Loading/PageLoading';
import Downloads from '../../../components/Main/Downloads';
import DataLoading from '../../../components/Loading/DataLoading';
import UploadFiles from '../../../components/Main/UploadFiles';
import Insights from '../../../components/Main/Insights';

import { axiosRequest } from '../../../service/axios';
import { exportMultiSheetExcel } from '../../../utils/exportExcel';

import { ProjectUploadType } from '../../../@types';

import './index.scss';

interface RequiredType {
  projectName: string;
  projectId: string;
}

interface DetailKeyType extends RequiredType {
  projectLocation: string;
}

interface DetailType {
  title: string;
  type: DetailKeyValues;
}

type DetailKeyValues = 'projectName' | 'projectId' | 'projectLocation';

const Extraction = () => {
  const navigate = useNavigate();
  const { ExtractionId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = Number(searchParams.get('tab'));
  const extractorId = Number(searchParams.get('modelId'));
  const extractorName = String(searchParams.get('modelName'));

  const tabs = ['Upload Files', 'Downloads', 'Insights'];
  const details = [
    {
      title: 'Project Name',
      type: 'projectName',
    },
    {
      title: 'Project ID',
      type: 'projectId',
    },
    {
      title: 'Project Location',
      type: 'projectLocation',
    },
  ] as DetailType[];

  const [id, setId] = useState<string>('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadFiles, setUploadFiles] = useState<ProjectUploadType[]>([]);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  // const [insight, setInsight] = useState<ProjectUploadType[]>([]);
  const [extractedData, setExtractedData] = useState<ProjectUploadType[]>([]);
  const [extractionDate, setExtractionDate] = useState<string>('');
  const [projectDetail, setProjectDetail] = useState<DetailKeyType>({
    projectName: '',
    projectId: '',
    projectLocation: '',
  });
  const [errorMessages, setErrorMessages] = useState<RequiredType>({
    projectName: '',
    projectId: '',
  });
  const [checking, setChecking] = useState<NodeJS.Timer>();

  const projectNameRef = useRef<HTMLInputElement | null>(null);

  const debouncedProjectDetail = useDebounce<DetailKeyType>(projectDetail, 500);

  const updateDatail = (key: DetailKeyValues, value: string) => {
    updateErrorMessage(key, '');
    setProjectDetail((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const updateErrorMessage = (key: DetailKeyValues, value: string) => {
    setErrorMessages((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const updateFiles = (files: ProjectUploadType[]) => {
    setUploadFiles(files);
    // const filteredFilesForInsight = files.filter((data) => data.extractedDate && data.data);
    // setInsight(filteredFilesForInsight);
    const filteredFiles = files.filter((data) => data.extractedDate && data.extractedData);
    setExtractedData(filteredFiles);
  };

  const validateProjectName = () => {
    if (!projectDetail.projectName) {
      if (id) {
        projectNameRef.current?.focus();
        updateErrorMessage('projectName', 'Required field');
      }

      return false;
    }

    return true;
  };

  const checkError = (error: any) => {
    if (error.validatorKey === 'not_unique') {
      if (error.path === 'projectId') {
        updateErrorMessage('projectId', 'Duplicate ID');
      }
      if (error.path === 'projectName') {
        updateErrorMessage('projectName', 'Duplicate Name');
      }
    }
  };

  const fetchProject = async () => {
    const res = await axiosRequest('GET', `/api/v1/project/${ExtractionId}`, true);
    if (res.data) {
      setIsExtracting(res.data.isExtracting);
      setProjectDetail({
        projectId: res.data.projectId,
        projectName: res.data.projectName,
        projectLocation: res.data.projectLocation,
      });
      setExtractionDate(res.data.extractedAt);

      if (res.data.data && Array.isArray(res.data.data)) {
        const _files = res.data.data.map((file: any) => {
          return {
            checked: false,
            id: file.id,
            createdAt: file.createdAt,
            documentName: file.documentName,
            extractedData: file.extractedData,
            data: file.data,
            extractedDate: file.extractedDate,
            documentExtension: file.documentExtension,
          };
        }) as ProjectUploadType[];

        updateFiles([..._files]);
      }
    }
  };

  const getProject = async () => {
    setIsLoading(true);
    updateErrorMessage('projectName', '');
    try {
      await fetchProject();
    } catch (err: any) {}
    setIsLoading(false);
  };

  const saveProject = async () => {
    if (!validateProjectName()) return;

    setIsLoading(true);
    try {
      const data = {
        extractorId: extractorId,
        projectName: projectDetail.projectName,
        projectId: projectDetail.projectId,
        projectLocation: projectDetail.projectLocation,
      };
      const res = await axiosRequest('POST', '/api/v1/project', true, data);

      if (res.data) {
        updateDatail('projectId', res.data.projectId);
        setExtractionDate(res.data.extractedAt);
        navigate(`/app/extractions/${res.data.id}?modelId=${extractorId}&tab=${tabIndex}&modelName=${extractorName}`);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response.data.error.errors) {
        checkError(err.response.data.error.errors[0]);
      } else {
        toast.error(err.response.data.error.message);
      }
    }
    setIsLoading(false);
  };

  const updateProject = async () => {
    if (!validateProjectName()) return;
    try {
      const data = {
        extractorId: extractorId,
        projectName: projectDetail.projectName,
        projectId: projectDetail.projectId,
        projectLocation: projectDetail.projectLocation,
      };
      await axiosRequest('PUT', `/api/v1/project/${id}`, true, data);
    } catch (err: any) {
      if (err.response.data.error.errors) {
        checkError(err.response.data.error.errors[0]);
      } else {
        toast.error(err.response.data.error.message);
      }
    }
  };

  const addFiles = async (files: File[]) => {
    if (!id) {
      toast.warn('Please enter project Name');
      updateErrorMessage('projectName', 'Required field');
      projectNameRef.current?.focus();
    } else {
      const url = `/api/v1/document`;
      const formData = new FormData();

      setIsUploading(true);
      files.forEach((file, i) => {
        formData.append(`file-${i}`, file);
      });
      formData.append('projectId', id);

      try {
        const res = await axiosRequest('POST', url, true, formData);

        if (res.data && Array.isArray(res.data)) {
          const _files = res.data.map((file: any) => {
            return {
              checked: false,
              id: file.id,
              createdAt: file.createdAt,
              documentName: file.documentName,
              extractedData: file.extractedData,
              data: file.data,
              extractedDate: file.extractedDate,
              documentExtension: file.documentExtension,
            };
          }) as ProjectUploadType[];

          updateFiles([..._files, ...uploadFiles]);
        }
      } catch (err: any) {
        toast.error(err.response.data.error.message);
      }
      setIsUploading(false);
      setShowModal(false);
    }
  };

  const downloadExtractions = async () => {
    try {
      if (id && !isDownloading) {
        setIsDownloading(true);
        const url = `/api/v1/project/${id}`;
        const res = await axiosRequest('GET', url, false);

        exportMultiSheetExcel(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.response.data.error.message);
    }
    setIsDownloading(false);
  };

  const checkStatus = () => {
    const c = setInterval(async () => {
      try {
        fetchProject();
      } catch (err: any) {
        toast.error(err.response.data.error.message);
        setIsExtracting(false);
      }
    }, 2000);
    setChecking(c);
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isExtracting && checking) {
        clearInterval(checking);
        setChecking(undefined);
        setIsExtracting(false)
      }
      if (isExtracting && !checking) {
        checkStatus();
      }
    }
  }, [isExtracting]);

  const runExtraction = async () => {
    if (id) {
      const url = `/api/v1/project/extract/${id}`;
      setIsExtracting(true);
      try {
        await axiosRequest('GET', url, true);
      } catch (err: any) {
        toast.error(err.response.data.error.message);
      }
      setIsExtracting(false)
    }
  };

  useEffect(() => {
    if (ExtractionId) {
      updateProject();
    } else {
      saveProject();
    }
  }, [debouncedProjectDetail]);

  useEffect(() => {
    if (!tab) {
      setTabIndex(0);
      setSearchParams({ modelId: extractorId.toString(), tab: Number(0).toString(), modelName: extractorName.toString() });
    } else {
      setTabIndex(tab);
      setSearchParams({ modelId: extractorId.toString(), tab: tab.toString(), modelName: extractorName.toString() });
    }
  }, [tab, extractorId, extractorName]);

  useEffect(() => {
    if (ExtractionId) {
      setId(ExtractionId);
      getProject();
    }
  }, [ExtractionId]);

  return (
    <div className="main-board relative">
      {extractorName ? (
        <>
          <h1 className="text-[20px] font-bold">
            Create a {extractorName.slice(-1) === 's' ? extractorName.slice(0, -1) : extractorName} Data Extraction
          </h1>
          <p className="text-[18px] font-normal mb-[50px] leading-[24px] text-neutral-500">
            Here you can drag and drop your {extractorName.toLowerCase()} that will be automatically sorted, categorised
            and key data extracted
          </p>
        </>
      ) : (
        <></>
      )}
      <h2 className="text-[16px] font-bold mb-[30px]">Project Details</h2>
      <div className="flex flex-wrap gap-[30px] xl:gap-[50px] text-[14px] text-gray-600 mb-[70px]">
        <div className="detail">
          {details.map((ele, ind) => (
            <div key={ind}>
              <p
                className={classNames('w-[115px] xs:w-[150px]', {
                  hidden: extractorId !== 1 && ele.type === 'projectLocation',
                })}
              >
                {ele.title}
                {ele.type === 'projectName' && <span className="text-red-500">*</span>}
              </p>
              <input
                className={classNames('', {
                  hidden: extractorId !== 1 && ele.type === 'projectLocation',
                })}
                type="text"
                placeholder="Add text"
                ref={ele.type === 'projectName' ? projectNameRef : null}
                value={projectDetail[ele.type] ? projectDetail[ele.type] : ''}
                onChange={(e) => {
                  updateDatail(ele.type, e.target.value);
                }}
              />
              <p
                className={classNames('text-[12px] text-red-600 ml-[7px]', {
                  hidden: extractorId !== 1 && ele.type === 'projectLocation',
                })}
              >
                {ele.type === 'projectName' || ele.type === 'projectId' ? (
                  errorMessages[ele.type] && errorMessages[ele.type]
                ) : (
                  <></>
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="detail">
          <div>
            <p className="w-[115px] min-w-[115px] xs:w-[200px]">Date of extraction</p>
            <p className="text-gray-800 font-medium pl-[4px] py-[4px] text-left w-[130px]">
              {extractionDate ? extractionDate.slice(0, 10) : ''}
            </p>
          </div>
          <div>
            <p className="w-[115px] min-w-[115px] xs:w-[200px]">Number of documents</p>
            <p className="text-gray-800 font-medium pl-[4px] py-[4px] text-left w-[130px]">{uploadFiles.length}</p>
          </div>
          <div>
            <p className="w-[115px] min-w-[115px] xs:w-[200px]">Extraction ID</p>
            <p className="text-gray-800 font-medium pl-[4px] py-[4px] text-left w-[130px]">{id}</p>
          </div>
        </div>
      </div>
      <div className="tab mb-[20px]">
        {tabs.map((ele, ind) => {
          if ((extractorId === 1 && ind === 1) || (extractorId !== 1 && ind === 2)) {
            return <div key={ind} className="hidden"></div>;
          } else {
            return (
              <div
                key={ind}
                className={classNames({ active: tabIndex === ind })}
                onClick={() => {
                  setTabIndex(ind);
                  setSearchParams({
                    modelId: extractorId.toString(),
                    tab: ind.toString(),
                    modelName: extractorName.toString(),
                  });
                }}
              >
                {ele}
                {ind === 0 && `(${uploadFiles.length})`}
              </div>
            );
          }
        })}
      </div>
      {tabIndex === 0 && (
        <UploadFiles
          isExtracting={isExtracting}
          isUploading={isUploading}
          addFiles={addFiles}
          uploadFiles={uploadFiles}
          updateFiles={updateFiles}
          pagination={true}
        />
      )}
      {tabIndex === 1 && <Downloads uploadFiles={extractedData} pagination={true} />}
      {tabIndex === 2 && <Insights data={extractedData} />}
      {uploadFiles.length !== 0 && tabIndex === 0 && (
        <div className="flex flex-col sm:flex-row gap-[15px] sm:gap-[20px] md:gap-[40px] mt-[30px]">
          <button
            className="text-white bg-blue hover:bg-hoverblue border-[1px] border-blue rounded px-[30px] py-[10px] text-[14px]"
            onClick={() => setShowModal(true)}
          >
            + Upload files
          </button>
          <button
            className="text-blue hover:text-white bg-transparent hover:bg-blue border-[1px] border-blue rounded px-[30px] py-[10px] text-[14px]"
            onClick={runExtraction}
          >
            Run Extraction
          </button>
          {extractorId !== 1 ? (
            <button
              disabled={!extractedData.length}
              className="sm:w-[225px] h-[43px] text-blue hover:text-white bg-transparent hover:bg-blue border-[1px] border-blue disabled:bg-lightgrey disabled:text-flexblue disabled:border-flexblue rounded px-[30px] py-[10px] text-[14px]"
              onClick={downloadExtractions}
            >
              {isDownloading ? <Loading size={30} color={'text-blue hover:text-white'} /> : 'Download Extracted Data'}
            </button>
          ) : (
            <></>
          )}
        </div>
      )}
      {isLoading && (
        <div className="absolute w-full h-full min-h-[100vh] top-0 left-0 bg-modalbg flex justify-center items-center">
          <div className="flex flex-col">
            <Loading size={45} color="text-blue" />
          </div>
        </div>
      )}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
          }}
        >
          <div
            className={classNames(
              'modal max-w-[600px] w-[100%] bg-white p-[30px] absolute left-[50%] translate-x-[-50%] translate-y-[-50%]',
              { 'top-[50%]': showModal, 'top-[-100%]': !showModal }
            )}
          >
            <h1 className="text-[16px] font-medium mb-[15px]">Add more files here</h1>
            {isUploading ? (
              <div className="w-full flex flex-col items-center justify-center bg-[#f2f8fd] border-dotted border-blue border-[4px] pt-[100px] pb-[120px] px-[10px]">
                <DataLoading color={'text-blue'} />
              </div>
            ) : (
              <Upload addFiles={addFiles} />
            )}
          </div>
        </Modal>
      )}
      <div className="w-[100%] h-[50px]"></div>
    </div>
  );
};

export default Extraction;
