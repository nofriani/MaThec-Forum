import { useNavigate } from 'react-router-dom';
import useUserStore from '../../../zustand/usersStore';
import CardQuestion from '../../QuestionCard';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export default function QuestionRecap() {
  const { userinfo, handleDelete } = useUserStore();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <h6 className='fw-bold'>Questions</h6>
      <div
        className='card shadow'
        style={{
          border: 'none',
        }}
      >
        <div className='card-body'>
          {userinfo.Questions && userinfo.Questions.length < 1 ? (
            <p className='mt-3'>No data avaible yet</p>
          ) : (
            <div className='col-sm-12'>
              {userinfo.Questions &&
                userinfo.Questions.map((data, index) => (
                  <>
                    <CardQuestion key={index} question={data} />
                    {user && userinfo.id === user.data.user_id && (
                      <div
                        className='d-flex gap-2 justify-content-end'
                        style={{ width: '90%' }}
                      >
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate('/editquestion/' + data.id)}
                        >
                          <FiEdit size={20} />
                        </div>
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDelete(data.id)}
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
