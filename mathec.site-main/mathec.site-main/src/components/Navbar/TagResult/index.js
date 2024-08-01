import { useNavigate } from 'react-router-dom';

export default function TagResult({ tags, close }) {
  const navigate = useNavigate();
  const navigation = (item) => {
    navigate('/tag/' + item.tag_name);
    close();
  };

  return (
    <div>
      <h6
        style={{
          fontSize: '16px',
          color: 'blue',
          fontWeight: 'bold',
        }}
      >
        Tags
      </h6>

      <div className='row gap-2'>
        {tags.lenght === 0 ? (
          <p>No Result from the result</p>
        ) : (
          tags.map((item, index) => (
            <div index={index} className='col-md-3'>
              <div
                role='link'
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  cursor: 'pointer',
                }}
                onClick={() => navigation(item)}
              >
                #{item.tag_name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
