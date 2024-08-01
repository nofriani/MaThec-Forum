import { useNavigate } from 'react-router-dom';

export default function UsersResult({ users, close }) {
  const navigate = useNavigate();
  const navigation = (item) => {
    navigate('/userinfo/' + item.id);
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
        Users
      </h6>
      {/* {} */}
      {/* <p>No Result from the result</p> */}
      {users.length === 0 ? (
        <p>No Result from the result</p>
      ) : (
        users.map((item, index) => (
          <div
            key={index}
            style={{
              textDecoration: 'none',
              color: 'black',
              cursor: 'pointer',
            }}
            onClick={() => navigation(item)}
          >
            <h6
              style={{
                fontSize: '14px',
              }}
            >
              {item.name}
            </h6>
            <p
              style={{
                fontSize: '12px',
              }}
            >
              {item.email}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
