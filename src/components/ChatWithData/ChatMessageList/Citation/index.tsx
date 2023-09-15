import './index.scss';

interface CitationProps {
    citationName?: string;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

const Citation = (props: CitationProps) => {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[40px] gap-y-[20px] mt-[0px]  ml-[10px]" >
                <div className="card-body-source" >
                    <a href="#section" onClick={props.onClick} className=" flex justify-between items-center">
                        <div className="px-[0px] py-[0px]" >
                            <p className="text-[16px] leading-[16px] max-[360px]:text-[13px] mx-[5px] my-[5px]" > { props.citationName || "The meaning of Life Vol1.pdf" } </p>
                        </div>
                    </a>
                </div>
            </div>
        </>
    )
}

export default Citation
