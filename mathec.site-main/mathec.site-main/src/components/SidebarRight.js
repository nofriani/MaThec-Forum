import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SidebarRight = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_HOST + '/api/home/hot_news', {
        headers: {
          'Content-Type': 'application/json'
        }});
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <div style={{ position: 'sticky', top: '140px' }}>
      <div className='card'>
        <div className='card-body px-4 py-4'>
          <div className='d-flex gap-4 flex-column'>
            <div className='d-flex flex-column'>
              <h4 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: 'bold' }}>Hot Questions</h4>
              {data &&
                data.data.map((d, index) => (
                  <div
                    className='mb-3'
                    style={{
                      cursor: 'pointer',
                    }}
                    key={index}
                    onClick={() => navigate('detailquestion/' + d.question_id)}
                  >
                    <h6
                      className='mb-0 border-bottom'
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      {d.title}
                    </h6>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarRight;
