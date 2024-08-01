import useUserStore from '../../../zustand/usersStore';
import { useNavigate } from 'react-router-dom';
import CardAnswer from '../../AnswerCard';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function AnswerRecap({ answer }) {
  const { userinfo, handleDeleteAnswer } = useUserStore();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <>
      <h6 className='fw-bold'>Answers</h6>
      <div
        className='card shadow'
        style={{
          border: 'none',
        }}
      >
        <div className='card-body'>
          {userinfo.answers && userinfo.answers.length < 1 ? (
            <p className='mt-3'>No data avaible yet</p>
          ) : (
            <div className='col-sm-12'>
              {userinfo.answers &&
                userinfo.answers.map((data, index) => (
                  <>
                    <CardAnswer key={index} answer={data.body !== "" ? data : null} />
                    {user && userinfo.id === user.data.user_id && (
                      <div className='d-flex gap-2 justify-content-end' style={{ width: '90%' }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/editanswer/' + data.id)}>
                          <FiEdit size={20} />
                        </div>
                        <div
                          style={{ cursor: 'pointer' }}
                          // onClick={() => handleDelete(data.id)}
                          onClick={() => handleDeleteAnswer(data.id)}
                        >
                          <FiTrash2 size={20} />
                        </div>
                      </div>
                    )}
                  </>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
