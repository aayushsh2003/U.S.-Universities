import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import debounce from 'lodash.debounce';
import '../App.css';

const UniversityTable = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('state-province', {
        header: 'State',
        cell: info => info.getValue() || 'N/A',
      }),
      columnHelper.accessor('domains', {
        header: 'Domains',
        cell: info => info.getValue().join(', '),
      }),
      columnHelper.accessor('web_pages', {
        header: 'Website',
        cell: info => (
          <a href={info.getValue()[0]} target="_blank" rel="noreferrer">
            🌐 Visit
          </a>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:4000/api/universities')
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Debounced search input
  const handleSearch = useCallback(
    debounce((value) => {
      setGlobalFilter(value);
    }, 300),
    []
  );

  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <div className={`table-wrapper ${darkMode ? 'dark' : ''}`}>
      <div className="table-header">
        <h1 className="heading">📚 U.S. Universities</h1>
        <p className="subheading">Search, Sort, Browse with Pagination</p>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search universities..."
            onChange={handleInputChange}
          />
          <button onClick={() => setDarkMode(prev => !prev)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="responsive-table">
            <table className="styled-table">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? ''}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              ⬅ Prev
            </button>
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UniversityTable;
