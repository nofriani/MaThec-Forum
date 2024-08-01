import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuestionsData from '../components/QuestionsData';
import useHomeStore from '../zustand/homeStore';
import MonthPicker from 'simple-react-month-picker';
// import 'scss/month-picker.scss';

const Home = () => {
  const {
    data,
    isLoading,
    fetchData,
    filterData,
    onLike,
    onDislike,
    onSaved,
    filterMonth,
    countPage,
    page,
    row,
    setPage,
    setCountPage,
  } = useHomeStore();

  const handleClick = (d) => {
    filterMonth(d[0], d[1]);
  };

  const handleUp = () => {
    const total = page + 1;
    if (total <= countPage) {
      setPage(total);
    }
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleDown = () => {
    const total = page - 1;
    if (total >= 1) {
      setPage(total);
    }
  };

  const handleChange = (e) => {
    setCountPage(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className='xs:hidden mt-2'>
        <div className='alert alert-success'>
          <div className='d-flex justify-content-between align-items-center'>
            Add new question
            <Link to='/addquestion' className='btn btn-light'>
              +
            </Link>
          </div>
        </div>
      </div>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div className='btn-group'>
          <select
            className='btn btn-light p-1 card'
            style={{
              backgroundColor: '#fff',
            }}
            onChange={handleChange}
            value={10}
          >
            <option defaultValue='5'>5</option>
            <option defaultValue='10'>10</option>
            <option defaultValue='20'>20</option>
            <option defaultValue='30'>30</option>
            <option defaultValue='40'>40</option>
            <option defaultValue='50'>50</option>
          </select>
        </div>
        <div className='btn-group align-items-center' role='group'>
          <button
            type='button'
            className='btn btn-light ms-1 card'
            style={{
              height: '100%',
            }}
            onClick={() => filterData('hot')}
          >
            Hot
          </button>
          <button
            type='button'
            className='btn btn-light ms-1 card'
            style={{
              height: '100%',
              borderRadius: '0px 8px 8px 0px',
              marginRight: '8px',
            }}
            onClick={() => filterData('weeks')}
          >
            Weeks
          </button>
          <MonthPicker
            highlightCol='#24b364'
            style={{ cursor: 'pointer' }}
            closeDelay={500}
            onChange={(d) => handleClick(d)}
          />
        </div>
      </div>
      {isLoading ? (
        <div className='vh-100 d-flex align-items-center justify-content-center'>
          <div className='spinner-border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      ) : data && data.length === 0 ? (
        <h3 className='text-center mt-3'>Data Not Found!</h3>
      ) : (
        data
          .filter((_, index) => index >= page * row - row && index < page * row)
          .map((question, index) => (
            <QuestionsData
              key={index}
              question={question}
              onLike={onLike}
              onDislike={onDislike}
              onSave={onSaved}
            />
          ))
      )}

      <div className='d-flex gap-1'>
        <div
          className='bg-white py-3 p-4 rounded'
          style={{ cursor: 'pointer' }}
          onClick={handleDown}
        >
          {'<'}
        </div>
        {Array.from({ length: countPage }, (_, index) => index + 1).map(
          (_, index) => (
            <div
              key={index}
              className={`${
                index + 1 === page ? 'bg-primary text-white' : 'bg-white'
              } py-3 p-4 rounded`}
              style={{ cursor: 'pointer' }}
              onClick={() => handlePage(index + 1)}
            >
              {index + 1}
            </div>
          )
        )}
        <div
          className='bg-white py-3 p-4 rounded'
          style={{ cursor: 'pointer' }}
          onClick={handleUp}
        >
          {'>'}
        </div>
      </div>
    </>
  );
};

export default Home;
