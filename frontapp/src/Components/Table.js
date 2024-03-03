import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyComponent() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  //get data
  useEffect(() => {
    fetchData();
  }, [currentPage, sortBy]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //serach logic
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredData = data.filter(item => {
    const customer_name = item.customer_name || '';
    const location = item.location || ''; 
    return (
      customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  

  const sortedData = sortBy ? [...filteredData].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortBy].localeCompare(b[sortBy]);
    } else {
      return b[sortBy].localeCompare(a[sortBy]);
    }
  }) : filteredData;

  //pagination logic

  const itemsPerPage = 20;
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  return (
    <div className="container mt-3 bg-light p-3 rounded">
      <input type="text" className="form-control mb-3 mt-2" style={{width:"60%", margin:"auto"}} placeholder="Search by name or location" value={searchTerm} onChange={handleSearch} />
      <table className="table table-dark table-hover text-center ">
        <thead className='fw-bold'>
          <tr className='my-auto'>
            <th>S_No</th>
            <th>Name</th>
            <th>Location</th>
            <th>Phone</th>
            <th>Age</th>
            <th className=''>Date 
            <button className='btn p-0 ms-1 '  onClick={() => handleSort("created_at")}>
                               {sortOrder === "asc" ? 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="14" height="14">
                        <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" fill="#ffffff"/>
                    </svg>
                    : 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="14" height="14">
                        <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" fill="#ffffff"/>
                    </svg>
                    }
            </button>
            </th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length!==0 ?( paginatedData.map((item) => (
            <tr key={item.id} className='ho'>
              <td>{item.sno}</td>
              <td>{item.customer_name}</td>
              <td>{item.location}</td>
              <td>{item.phone}</td>
              <td>{item.age}</td>
              <td>{item.created_at.split("T")[0]}</td>
              <td>{item.created_at.split("T")[1].split(".")[0]}</td>
            </tr>
          ))):
          (<p className='text-danger text-center fs-4 fw-bold'>No data Found</p>)}
        </tbody>
      </table>
      <div className="d-flex justify-content-center">
        <button className="btn border-0 mr-2" onClick={goToPreviousPage} disabled={currentPage === 1}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28">
    <path d="M48 416c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80c-8.8 0-16 7.2-16 16l0 320zm16 64c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480zm64-224c0-6.7 2.8-13 7.7-17.6l112-104c7-6.5 17.2-8.2 25.9-4.4s14.4 12.5 14.4 22l0 208c0 9.5-5.7 18.2-14.4 22s-18.9 2.1-25.9-4.4l-112-104c-4.9-4.5-7.7-10.9-7.7-17.6z" fill="#343a40"/>
</svg>
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'} mr-2 mx-2`} onClick={() => goToPage(i + 1)}>{i + 1}</button>
        ))}
        <button className="btn border-0" onClick={goToNextPage} disabled={currentPage === totalPages}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28">
          <path d="M400 96c0-8.8-7.2-16-16-16L64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320zM384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l320 0zM320 256c0 6.7-2.8 13-7.7 17.6l-112 104c-7 6.5-17.2 8.2-25.9 4.4s-14.4-12.5-14.4-22l0-208c0-9.5 5.7-18.2 14.4-22s18.9-2.1 25.9 4.4l112 104c4.9 4.5 7.7 10.9 7.7 17.6z" fill="#343a40"/>
      </svg>

        </button>
      </div>
    </div>
  );
}

export default MyComponent;
