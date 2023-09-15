/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { sortProject } from '../../../utils';
import { axiosRequest } from '../../../service/axios';

import DataLoading from '../../../components/Loading/DataLoading';
import { Table as HistoryTable } from '../../../components/Main/Table';

import { ProjectType } from '../../../@types';

interface IModel {
  id: number;
  modelDescription: string;
  modelId: string;
  appVersion: string;
  extractorDescription: string;
  extractorName: string;
  createdAt: string;
  updatedAt: string;
}

const NewExtraction = () => {
  const navigate = useNavigate();

  const [models, setModels] = useState<IModel[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
  const [modelsLoading, setModelsLoading] = useState<boolean>(false);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

  const onSelect = (id: number, extractorName: string) => {
    if (extractorName) {
      navigate(`/app/extractions?modelId=${id}&modelName=${extractorName}`);
    }
  };

  const getExtractModelList = async () => {
    try {
      setModelsLoading(true);
      const res = await axiosRequest('GET', '/api/v1/extract-model', false);

      if (Array.isArray(res.data) && res.data.length > 0) setModels(res.data);
      else {
        setModels([]);
      }
    } catch (err) {
      console.error((err as Error).message);
    }

    setModelsLoading(false);
  };

  const getProjectList = async () => {
    try {
      setProjectsLoading(true);
      const res = await axiosRequest('GET', '/api/v1/project', true);

      if (Array.isArray(res.data) && res.data.length > 0) {
        setProjectsData(res.data);
      } else {
        setProjectsData([]);
      }
    } catch (err: any) {
      console.error('getExtractionList err = ', err);
    }

    setProjectsLoading(false);
  };

  const deleteProject = async (projectId: number) => {
    try {
      const res = await axiosRequest('DELETE', `/api/v1/project/${projectId}`, true);

      if (res.data === 0) {
        toast.warn('Project ID does not exist!');
      } else {
        setProjectsData((prev) => {
          const data = prev.filter((p) => p.id !== projectId);
          return data;
        });
      }
    } catch (err) {
      console.error('deleteProject = ', err);
      toast.error('Project delete error!');
    }
  };

  useEffect(() => {
    getExtractModelList();
    getProjectList();
  }, []);

  return (
    <div className="main-board pb-[50px]" >
      <h1 className="text-[20px] font-bold mb-[10px]">Recent Data Extractions</h1>
      <div className='overflow-auto'>
        <HistoryTable
          data={sortProject(projectsData).slice(0, 4)}
          isLoading={projectsLoading}
          deleteProject={(projectId: number) => {
            deleteProject(projectId);
          }}
          pagination={false}
        />
      </div>
      {projectsData.length !== 0 && (
        <div className="flex justify-end items-center mt-[15px] mr-[10px] text-[16px] text-blue">
          <Link to="/app" className="flex gap-[8px]">
            <span className="text-[14px]">See all Extractions </span>
            <FaLongArrowAltRight className="text-[20px]" />
          </Link>
        </div>
      )}
      <div className="mt-[50px]"></div>
      <h1 className="text-[20px] font-bold">Extract New Files</h1>
      <p className="text-[18px] font-normal mb-[30px] leading-[24px] text-neutral-500 max-[360px]:text-[14px]">
        Choose what type of document you want to extract data from below. The more you use the system, the faster it
        learns what you want from your documents
      </p>
      {modelsLoading ? (
        <div className="flex justify-center h-[50px] items-start">
          <DataLoading />
        </div>
      ) : (
        models.map((ele, ind) => (
          <div
            key={ind}
            className="flex flex-wrap xs:flex-nowrap gap-[20px] justify-between items-start border-b-[3px] border-b-lightgrey pt-[15px] pb-[10px]"
          >
            <div>
              <h2 className="font-medium text-[14px]">{ele.extractorName}</h2>
              <p className="text-[14px] text-dark">{ele.extractorDescription}</p>
            </div>
            <button
              className="mr-[20px] text-white bg-blue px-[30px] py-[7px] text-[14px] rounded-sm hover:bg-hoverblue btn-position m-[auto] mr-[10px] max-[360px]:mr-[0px]"
              onClick={() => onSelect(ele.id, ele.extractorName)}
            >
              Select
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NewExtraction;
