/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { axiosRequest } from '../../service/axios';
import Loading from '../../components/Loading/PageLoading';
import Badge from '../../components/Utils/Badge';
import { Link, useParams } from 'react-router-dom';
import { ISaleRequest } from './Detail';

const SaleRequest = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [requests, setRequests] = useState<ISaleRequest[]>([]);
  const getSaleRequests = async () => {
    setLoading(true);
    try {
        const result = await axiosRequest('GET', '/api/v1/sale-request', true);
        setRequests(result.data);
    } catch (err) {}
    setLoading(false);
  };
  useEffect(() => {
    getSaleRequests();
  }, [params]);
  return (
    <div className="main-board pl-[20px] lg:pl-[30px] pt-[70px] lg:pt-[30px] pb-[60px] pr-[20px] overflow-auto h-full">
      {loading ? (
        <Loading size={40} />
      ) :  (
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid w-1/12">
                ID
              </td>
              <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid w-2/12">
                User
              </td>
              <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid w-1/12">
                Company
              </td>
              <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid w-6/12">
                Description
              </td>
              <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid w-1/12">
                Status
              </td>
              <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid w-1/12">
                Action
              </td>
            </tr>
          </thead>
          <tbody className="">
            {requests.length ? (
              requests.map((request) => {
                return (
                  <tr key={request.id} className="hover:bg-lightgrey cursor-pointer">
                    <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid">
                      {request.id}
                    </td>
                    <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid">
                      {request.user.firstname || ''} {request.user.lastname || ''}
                    </td>
                    <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid">
                      {request.company.name}
                    </td>
                    <td className="px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid  max-w-[500px] min-w-[290px]">
                      <p className="truncate">{request.description}</p>
                    </td>
                    <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid">
                      <Badge
                        type={
                          request.status === 'pending' ? 'indigo' : request.status === 'declined' ? 'grey' : 'success'
                        }
                      >
                        {request.status}
                      </Badge>
                    </td>
                    <td className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid">
                      <Link
                        to={`/app/sale-request/${request.id}`}
                        className="text-blue hover:bg-hoverblue hover:text-white border-[1px] border-blue rounded px-[10px] py-[10px] text-[14px]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  className="text-center px-[5px] py-[15px] border border-b-1 border-gray-300 border-solid"
                  colSpan={6}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SaleRequest;
