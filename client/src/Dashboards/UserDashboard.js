import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Loader from '../helpers/components/Loader';
import Table from './Table';
import DashboardHeader from './DashboardHeader';
import axiosInstance from '../helpers/axiosInstance';
import Notification from '../helpers/components/Notification';

const UserDashboard = ({ match }) => {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [tableData, setTableData] = useState([]);

  const [searched, setSearched] = useState('');
  const [sort, setSort] = useState('');

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  const [direction, setDirection] = useState('asc');
  const [columnTosort, setColumnToSort] = useState('id');

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await axiosInstance.get('/api/complaint/student');
        setLoading(false);

        const tmpData = result.data.complaints.map((doc, index) => {
          const currDate = new Date(doc.date);

          const date = `${currDate.getDate()}/${
            currDate.getMonth() + 1
          }/${currDate.getFullYear()}`;

          return {
            _id: doc._id,
            id: index + 1,
            title: doc.workType,
            status: doc.status,
            date,
            department: doc.department, compId:doc.compId,
          };
        });
        setData(tmpData);
        setTableData(tmpData);
      } catch (error) {
        try {
          if (error.response.status === 403) history.push('/ui/login');
          setMessage(error.response.data.error);
          setMessageType('error');
          setOpen(true);
        } catch (error) {
          setMessage('Unable to fetch data');
          setMessageType('error');
          setOpen(true);
        }
      }
    })();
  }, []);

  const handleSortDrop = (event) => {
    const columnName = event.target.value;
    setSort(columnName);
    const editedData = [...data];
    editedData.sort(
      (a, b) =>
        a[columnName].toString().toLowerCase() >
        b[columnName].toString().toLowerCase()
    );
    setTableData(editedData);
  };

  const handleFilter = (event) => {
    const filterValue = event.target.value;
    setFilter(filterValue);
    filterValue
      ? setTableData(data.filter((x) => x.status === filterValue))
      : setTableData(data);
  };

  useEffect(() => {
    setTableData(
      searched && searched.length
        ? data.filter(
            (row) => row.title.toLowerCase().search(searched.toLowerCase()) >= 0
          )
        : data
    );
  }, [searched, data]);

  const cancelSearch = () => setSearched('');

  const filterValues = [
    'Forwarded to HoD',
    'Rejected by Hod',
    'Forwarded to Administrative Officer',
    'Rejected by Administrative Officer',
    'Forwarded to Maintenance Commitee',
    'Rejected by Maintenance Commitee',
  ];

  return (
    <>
      <Notification
        open={open}
        setOpen={setOpen}
        message={message}
        type={messageType}
      />
      <DashboardHeader
        searched={searched}
        setSearched={setSearched}
        sort={sort}
        setSort={setSort}
        query={query}
        setQuery={setQuery}
        filter={filter}
        setFilter={setFilter}
        handleSortDrop={handleSortDrop}
        handleFilter={handleFilter}
        cancelSearch={cancelSearch}
        match={match}
        filterValues={filterValues}
      />
      <br />
      <br />

      {isLoading ? (
        <Loader />
      ) : (
        <Table
          type="student"
          data={tableData}
          direction={direction}
          setDirection={setDirection}
          columnTosort={columnTosort}
          setColumnToSort={setColumnToSort}
          match={match}
        />
      )}
    </>
  );
};

export default UserDashboard;
