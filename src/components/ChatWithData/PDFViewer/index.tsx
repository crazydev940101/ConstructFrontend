import './index.scss';

interface PDFViewerProps {
    drawerRef?: React.RefObject<HTMLDivElement>
    srcRoot: string
}

const PDFViewer = (props: PDFViewerProps) => {
    return (
        <>
            <div ref={props.drawerRef} className="drawer">
                <button type="button" className="btn-close">
                    <span className="icon-cross"></span>
                    <span className="visually-hidden">Close</span>
                </button>
                <iframe title='doc, pdf & img' src={props.srcRoot} width="100%" height="100%" style={{ border: "none" }}></iframe>
            </div>
        </>
    )
}

export default PDFViewer
