import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import './pagination.scss';

interface PropsType {
  onPageChange: (page: number) => void;
  totalCount:number;
  siblingCount:number;
  currentPage:number;
  pageSize:number;
  className:string;

}

const Pagination = (props:PropsType) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

    if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
      return (
        <ul className={classnames('pagination-container', { [className]: className })}>
            <li className='pagination-item pointer-events-none'>
                <div className="arrow left" />
            </li>
            <input type="text" className='mobile-display' value={currentPage + ' of 1 page'} readOnly/>
            <li className='pagination-item pointer-events-none selected'>
                1
            </li>
            <li className='pagination-item pointer-events-none'>
                <div className="arrow right" />
            </li>
        </ul>
      );
    }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  if(paginationRange) {
    let lastPage:any = paginationRange[paginationRange.length - 1];
    if(currentPage > lastPage) {
      return (
          <ul className={classnames('pagination-container', { [className]: className })}>
              <li
                className={classnames('pagination-item', {
                  disabled: currentPage === 1
                })}
                onClick={onPrevious}
              >
                <div className="arrow left" />
              </li>
              <input type="text" className='mobile-display' value={currentPage + ' of '+ lastPage + ' pages'} readOnly/>
              {paginationRange.map((pageNumber:any, index:number) => {
                if (pageNumber === DOTS) {
                  return <li className="pagination-item dots">&#8230;</li>;
                }
                return (
                  <li key={index}
                    className={classnames('pagination-item', {
                      selected: pageNumber === currentPage - lastPage
                    })}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </li>
                );
              })}
              <li
                className={classnames('pagination-item', {
                  disabled: currentPage === lastPage
                })}
                onClick={onNext}
              >
                <div className="arrow right" />
              </li>
          </ul>
        );
    } else {
      return (
        <ul
          className={classnames('pagination-container', { [className]: className })}
        >
          <li
            className={classnames('pagination-item firstpage', {
              disabled: currentPage === 1
            })}
            onClick={onPrevious}
          >
            <div className="arrow left" />
          </li>
          <input type="text" className='mobile-display' value={currentPage + ' of '+ lastPage + ' pages'} readOnly/>
          {paginationRange.map((pageNumber:any, index:number) => {
            if (pageNumber === DOTS) {
              return <li className="pagination-item dots">&#8230;</li>;
            }
            return (
              <li key={index}
                className={classnames('pagination-item', {
                  selected: pageNumber === currentPage
                })}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            );
          })}
          <li
            className={classnames('pagination-item lastpage', {
              disabled: currentPage === lastPage
            })}
            onClick={onNext}
          >
            <div className="arrow right" />
          </li>
        </ul>
      );
    }
  }
  return null;
};

export default Pagination;
