import InfoTable from '../InfoTable';
import { useEffect, useState } from 'react';
import { getToken, server_url } from '../../../service/axios';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { getLocalStorage } from '../../../store/storage';
import axios from 'axios';
import { config } from '../../../config';
import { saveAsFile } from '../../../utils/saveAsFile';
import Loading from '../../Loading/PageLoading';

interface IProps {
  data: any;
}
const Insights = (props: IProps) => {
  const { ExtractionId } = useParams();
  const [downloading, setDownloading] = useState<{ [key: number]: boolean }>({});
  const [eData, setEData] = useState<any>(null); // extracted data

  const downloadTicket = async (documentId: number, documentName: string) => {
    updateDownloading(documentId, true);
    const storage = getLocalStorage('accessToken');
    const token = storage.data;

    const res = await axios.get(config.server + `/api/v1/document/file/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    saveAsFile(res.data, documentName);
    updateDownloading(documentId, false);
  };
  const updateDownloading = (key: number, value: boolean) => {
    setDownloading((prev) => {
      let data = { ...prev };
      data[key] = value;
      return data;
    });
  };
  useEffect(() => {
    if (props.data.length) {
      let deliveries = [];
      let material: any[] = [];
      let plant: any[] = [];
      let tools: any[] = [];
      let ppe: any[] = [];
      for (let data of props.data) {
        const ticket = {
          ticket: (
            <div
              className="flex hover:cursor-pointer hover:underline hover:text-blue"
              onClick={() => downloadTicket(data.id, `${data.id}-${data.documentName}`)}
            >
              #{data.id}{' '}
              {downloading[data.id] ? (
                <div className="w-[20px]">
                  <Loading size={20} />
                </div>
              ) : (
                <></>
              )}
            </div>
          ),
        };
        let d = data.data;
        if (d && !Array.isArray(d)) {
          deliveries.push({
            supplier: d.supplier,
            deliveryDate: moment(d.deliveryDate).format('YYYY-MM-DD'),
            ...ticket,
          });
          if (d.items && d.items.length) {
            d.items.forEach((detail: any) => {
              if (detail.category === 'material') {
                material.push({
                  inventory: detail.inventory,
                  quantity: detail.quantity,
                  unit: detail.unit,
                  carbonEmission: (detail.ceFactor * detail.convertedQuantity).toFixed(3),
                  ...ticket,
                });
              } else if (detail.category === 'plant') {
                plant.push({
                  inventory: detail.inventory,
                  quantity: detail.quantity,
                  ...ticket,
                });
              } else if (detail.category === 'tools') {
                tools.push({
                  inventory: detail.inventory,
                  quantity: detail.quantity,
                  ...ticket,
                });
              } else if (detail.category === 'ppe') {
                ppe.push({
                  inventory: detail.inventory,
                  quantity: detail.quantity,
                  ...ticket,
                });
              }
            });
          }
        }
      }
      setEData({
        delivery: {
          header: ['Supplier', 'Delivery Date', 'Delivery Ticket'],
          body: deliveries,
        },
        material: {
          header: [
            'Material Inventory',
            { label: 'Quantity', align: 'right' },
            'Unit',
            {
              label: (
                <>
                  Carbon Emissions
                  <br />
                  (KgCO2e/kg)
                </>
              ),
              align: 'right',
            },
            'Delivery Ticket',
          ],
          body: material,
        },
        plant: {
          header: ['Plant Inventory', { label: 'Quantity', align: 'right' }, 'Delivery Ticket'],
          body: plant,
        },
        tools: {
          header: ['Tools Inventory', { label: 'Quantity', align: 'right' }, 'Delivery Ticket'],
          body: tools,
        },
        ppe: {
          header: ['PPE Inventory', { label: 'Quantity', align: 'right' }, 'Delivery Ticket'],
          body: ppe,
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, downloading]);
  return (
    <>
      <div className="w-full flex-wrap 2xl:flex-nowrap">
        {eData ? (
          <>
            {eData.delivery ? (
              <div className="max-w-[1200px] block pl-[0px] pr-[0px] pt-[0px] pb-[50px] max-[860px]:w-[100%] max-[860px]:px-[0px] text-right">
                <div className="overflow-x-auto">
                  <InfoTable data={eData.delivery} />
                </div>
                <form
                  method="GET"
                  target="_blank"
                  action={`${server_url}/api/v1/project/download/insight/supplier/${ExtractionId}`}
                >
                  <input type="hidden" name="token" value={getToken()} />
                  <button
                    type="submit"
                    className="inline-block gap-[15px] text-right mt-[15px] mr-[80px] max-[717px]:mr-[0px] max-[717px]:pr-[0px]"
                  >
                    <span className="text-[14px] text-indigo-700 hover:underline">Download Supplier details</span>
                  </button>
                </form>
              </div>
            ) : (
              <></>
            )}
            {['material', 'plant', 'tools', 'ppe'].map((category) => {
              return eData[category] ? (
                <div
                  key={category}
                  className="max-w-[1200px] block pl-[0px] pr-[0px] pt-[0px] pb-[50px] max-[860px]:w-[100%] max-[860px]:px-[0px] text-right"
                >
                  <div className="overflow-x-auto">
                    <InfoTable data={eData[category]} />
                  </div>
                  <form
                    method="GET"
                    target="_blank"
                    action={`${server_url}/api/v1/project/download/insight/${category}/${ExtractionId}`}
                  >
                    <input type="hidden" name="token" value={getToken()} />
                    <button
                      type="submit"
                      className="inline-block gap-[8px] text-right mt-[15px] mr-[80px] max-[717px]:mr-[0px] max-[717px]:pr-[0px]"
                    >
                      <span className="text-[14px] text-indigo-700 hover:underline">
                        Download {eData[category].header[0]}
                      </span>
                    </button>
                  </form>
                </div>
              ) : (
                <></>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Insights;
