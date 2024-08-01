import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChanePassword() {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConf, setPasswordConf] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === passwordConf) {
      await fetch(
        process.env.REACT_APP_API_HOST + '/api/users/change-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: input, password }),
        }
      );
      navigate('/auth');
    } else {
      setError('Password tidak sama');
    }
  };
  return (
    <>
      <div className='d-flex vh-100 vw-100 justify-content-center align-items-center'>
        <div className='card'>
          <div className='card-body'>
            <h6>Reset Password</h6>

            {error != null && <div className='alert alert-danger'>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label for='exampleFormControlInput1' className='form-label'>
                  Email address
                </label>
                <input
                  type='email'
                  className='form-control'
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='name@example.com'
                />
              </div>
              <div className='mb-3'>
                <label for='exampleFormControlInput1' className='form-label'>
                  password{' '}
                </label>
                <input
                  type='password'
                  className='form-control'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label for='exampleFormControlInput1' className='form-label'>
                  Confirmation password{' '}
                </label>
                <input
                  type='password'
                  className='form-control'
                  onChange={(e) => setPasswordConf(e.target.value)}
                />
              </div>
              <button className='btn btn-primary'>submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
