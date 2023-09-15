/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// import InfoTable from '../../components/Main/InfoTable';
import { Table as HistoryTable } from '../../components/Main/Table';

import { sortProject } from '../../utils';
import { axiosRequest } from '../../service/axios';

import { ProjectType } from '../../@types';

import './index.scss';

const Dashboard = () => {
  // const suppliers = {
  //   header: ['Supplier details', 'Delivery Tickets'],
  //   body: [
  //     {
  //       supplier: 'GAP',
  //       tickets: 150,
  //     },
  //     {
  //       supplier: 'Jewson',
  //       tickets: 90,
  //     },
  //     {
  //       supplier: 'Bunzal',
  //       tickets: 55,
  //     },
  //   ],
  // };

  // const materials = {
  //   header: ['Material Inventory', 'Quantity', 'Unit'],
  //   body: [
  //     {
  //       material: 'Concrete',
  //       quantity: 500,
  //       Unit: 'KG',
  //     },
  //     {
  //       material: 'Pipework',
  //       quantity: 122,
  //       Unit: 'length',
  //     },
  //     {
  //       material: 'Timber',
  //       quantity: 321,
  //       Unit: 'KG',
  //     },
  //   ],
  // };

  // const tools = {
  //   header: ['Tools Inventory', 'Quantity'],
  //   body: [
  //     {
  //       tool: 'Hammers',
  //       quentity: 500,
  //     },
  //     {
  //       tool: 'Spanners',
  //       quentity: 122,
  //     },
  //     {
  //       tool: 'Saws',
  //       quentity: 321,
  //     },
  //   ],
  // };

  // const plants = {
  //   header: ['Plant Inventory', 'Quantity'],
  //   body: [
  //     {
  //       plant: 'Diggers',
  //       quentity: 500,
  //     },
  //     {
  //       plant: 'Bull Dozers',
  //       quentity: 122,
  //     },
  //     {
  //       plant: 'Cranes',
  //       quentity: 321,
  //     },
  //   ],
  // };

  const [projectsData, setProjectsData] = useState<ProjectType[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(true);

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
    getProjectList();
  }, []);

  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] items-center overflow-auto h-full">
      {/* <h1 className="text-[20px] font-bold mb-[10px]">Organisation information</h1>
      <p className="text-[18px] font-normal mb-[30px] leading-[24px] text-neutral-500">
        Cumulative view of all extracted data
      </p>
      <div className="w-full flex flex-wrap 2xl:flex-nowrap gap-[30px]">
        <div className="w-full sm:w-[40%] 2xl:w-[32%] pr-0 2xl:pr-[30px]">
          <InfoTable data={suppliers} />
        </div>
        <div className="w-full sm:w-[40%] 2xl:w-[23%]">
          <InfoTable data={materials} />
        </div>
        <div className="w-full sm:w-[40%] 2xl:w-[18%]">
          <InfoTable data={tools} />
        </div>
        <div className="w-full sm:w-[40%] 2xl:w-[18%]">
          <InfoTable data={plants} />
        </div>
      </div>
      <div className="mt-[100px]"></div> */}
      <h1 className="text-[20px] font-bold mb-[10px]">All Data Extractions</h1>
      <HistoryTable
        data={sortProject<ProjectType>(projectsData)}
        isLoading={projectsLoading}
        deleteProject={(projectId: number) => {
          deleteProject(projectId);
        }}
        pagination={true}
      />
    </div>
  );
};

export default Dashboard;
