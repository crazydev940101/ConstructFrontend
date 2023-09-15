import React from 'react';

const Modal = (props: any) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-full min-h-[100vh] z-[995] bg-modalbg">
      <div className="w-full h-full" onClick={() => props.onClose()}></div>
      {props.children}
    </div>
  );
};

export default Modal;
