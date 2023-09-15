import React from 'react';
import './index.scss';



const TimeSavingMetrics = () => {
    return (
        <div className="metrics-detail">
            <div>
                <p className="w-[125px] min-w-[125px] xs:w-[125px]">Your Stats</p>
            </div>
            <div>
                <p className="w-[125px] min-w-[125px] xs:w-[125px]">Extracting Time</p>
                <p className="pl-[4px] py-[4px] text-left ">
                    8 minutes
                </p>
            </div>
            <div>
                <p className="w-[125px] min-w-[125px] xs:w-[125px]">Documents Processed</p>
                <p className="pl-[4px] py-[4px] text-left ">0</p>
            </div>
            <div>
                <p className="w-[125px] min-w-[125px] xs:w-[125px]">Documents/minute</p>
                <p className="pl-[4px] py-[4px] text-left ">0</p>
            </div>
            <div>
                <p className="w-[125px] min-w-[125px] xs:w-[125px]">Time Saving</p>
                <p className="pl-[4px] py-[4px] text-left ">1 hour 25 minutes</p>
            </div>
            <div>
                <p className="w-[125px] min-w-[125px] xs:w-[125px]">Costing Saving</p>
                <p className="pl-[4px] py-[4px] text-left ">£27.00</p>
            </div>
        </div>
    );
};

export default TimeSavingMetrics;
