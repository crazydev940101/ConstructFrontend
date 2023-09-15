import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollIntoView: React.FC = () => {
  const { hash } = useLocation();
  const documentRef = useRef<Document>(document);
  useEffect(() => {
    if (hash) {
      const targetElement = documentRef.current.querySelector(hash) as HTMLDivElement;
      targetElement?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return null;
};

export default ScrollIntoView;
