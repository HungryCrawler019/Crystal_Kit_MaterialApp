import React, { useEffect, useRef, useState } from 'react';
import { useSearchUIContext, useSearchUIContextActions } from '../SearchUIContextProvider';
import DataTable from 'react-data-table-component';
import { Paginator } from '../../Paginator';
import { FaCaretDown } from 'react-icons/fa';

/**
 * A version of the `DataTable` component for rendering SearchUI results in the table view.
 * Uses react-data-table-component to render results based
 * on the current state of the SearchUIContext.
 */
export const SearchUIDataTable: React.FC = () => {
  const { state, query } = useSearchUIContext();
  const actions = useSearchUIContextActions();
  const [toggleClearRows, setToggleClearRows] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const limit = query[state.limitKey] || state.defaultLimit;
  const skip = query[state.skipKey] || state.defaultSkip;

  const handlePageChange = (page: number) => {
    /** Scroll table back to top when page changes */
    if (tableRef.current) {
      tableRef.current.children[0].scrollTop = 0;
    }
    actions.setPage(page);
    setToggleClearRows(!toggleClearRows);
  };

  const handleSort = (column, sortDirection) => {
    const sortAscending = sortDirection === 'asc' ? true : false;
    actions.setSort(column.selector, sortAscending);
    setToggleClearRows(!toggleClearRows);
  };

  const handleSelectedRowsChange = (rowState) => {
    console.log(rowState);
    actions.setSelectedRows(rowState.selectedRows);
  };

  const CustomPaginator = ({ isTop = false }) => (
    <Paginator
      rowCount={state.totalResults!}
      rowsPerPage={limit}
      currentPage={skip / limit + 1 || 1}
      onChangePage={handlePageChange}
      onChangeRowsPerPage={actions.setResultsPerPage}
      isTop={isTop}
    />
  );

  const conditionalRowStyles: any[] = state.conditionalRowStyles!.map((c) => {
    c.when = (row) => {
      if (typeof c.value === "boolean" || typeof c.value === "string") {
        return row[c.selector] === c.value;
      }
      if (typeof c.value === "number") {
        if (c.condition === "gt") {
          return row[c.selector] > c.value;
        }
        if (c.condition === "lt") {
          return row[c.selector] < c.value;
        }
        return row[c.selector] === c.value;
      }
      return false;
    }
    return c;
  });

  return (
    <div className="mpc-search-ui-data-table">
      <div className="react-data-table-outer-container">
        <div
          data-testid="react-data-table-container"
          className="react-data-table-container"
          ref={tableRef}
        >
          <DataTable
            className="react-data-table"
            noHeader
            theme="material"
            columns={state.columns.filter((c) => !c.hidden)}
            data={state.results!}
            highlightOnHover
            paginationServer
            sortServer
            sortIcon={<FaCaretDown />}
            defaultSortField={
              query[state.sortKey] &&
              query[state.sortKey][0] &&
              query[state.sortKey][0].replace('-', '')
            }
            defaultSortAsc={
              query[state.sortKey] &&
              query[state.sortKey][0] &&
              query[state.sortKey][0].indexOf('-') === 0
                ? false
                : true
            }
            onSort={handleSort}
            customStyles={{
              rows: {
                style: {
                  minHeight: '4em'
                }
              }
            }}
            conditionalRowStyles={conditionalRowStyles}
            selectableRows={state.selectableRows}
            onSelectedRowsChange={handleSelectedRowsChange}
            clearSelectedRows={toggleClearRows}
            // selectableRowSelected={(row) => {
            //   const isSelected = state.selectedRows?.find(s => s.material_id === row.material_id);
            //   console.log(state.selectedRows);
            //   console.log(row);
            //   return isSelected;
            // }}
          />
        </div>
        <CustomPaginator />
      </div>
    </div>
  );
};
