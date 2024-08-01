import { useEffect } from 'react';
import QuestionsData from '../components/QuestionsData';
import useHomeStore from '../zustand/homeStore';

const AllQuestion = () => {
  const { data, isLoading, fetchData, filterData, onLike, onDislike, onSaved, countPage, page, row, setPage, setCountPage } = useHomeStore();

  const handleUp = () => {
    const total = page + 1;
    if (total <= countPage) {
      setPage(total);
    }
  };

  const handlePage = page => {
    setPage(page);
  };

  const handleDown = () => {
    const total = page - 1;
    if (total >= 1) {
      setPage(total);
    }
  };

  const handleChange = e => {
    setCountPage(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className='vh-100 d-flex align-items-center justify-content-center'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='d-flex justify-content-between mb-3'>
        <div className='btn-group'>
          <select
            className='btn btn-light p-1 card'
            style={{
              backgroundColor: '#fff',
            }}
            onChange={handleChange}
          >
            <option value='5'>5</option>
            <option value='10' selected>
              10
            </option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='40'>40</option>
            <option value='50'>50</option>
          </select>
        </div>
        <div className='btn-group' role='group'>
          <button type='button' className='btn btn-light ms-1 card' onClick={() => filterData('all')}>
            All
          </button>
          <button type='button' className='btn btn-light ms-1 card' onClick={() => filterData('answer')}>
            Answer
          </button>
          <button type='button' className='btn btn-light ms-1 card' onClick={() => filterData('no_answer')}>
            No Answer
          </button>
        </div>
      </div>

      {!data ? (
        <div className='vh-100 d-flex align-items-center justify-content-center'>
          <div className='spinner-border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : (
        data.length > 0 ? (data.filter((_, index) => index >= page * row - row && index < page * row).map((question, index) => <QuestionsData key={index} question={question} onLike={onLike} onDislike={onDislike} onSave={onSaved} />)) : (<h1 className='text-center'>Data Not Found</h1>)
      )}

      <div className='d-flex gap-1'>
        <div className='bg-white py-3 p-4 rounded' style={{ cursor: 'pointer' }} onClick={handleDown}>
          {'<'}
        </div>
        {Array.from({ length: countPage }, (_, index) => index + 1).map((_, index) => (
          <div key={index} className={`${index + 1 === page ? 'bg-primary text-white' : 'bg-white'} py-3 p-4 rounded`} style={{ cursor: 'pointer' }} onClick={() => handlePage(index + 1)}>
            {index + 1}
          </div>
        ))}
        <div className='bg-white py-3 p-4 rounded' style={{ cursor: 'pointer' }} onClick={handleUp}>
          {'>'}
        </div>
      </div>
    </>
  );
};

export default AllQuestion;
