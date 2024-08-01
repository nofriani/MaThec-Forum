import { useNavigate } from 'react-router-dom';
import 'quill/dist/quill.snow.css';

export default function CardAnswer({ answer }) {
  const navigate = useNavigate();
  if (!answer) return null;
  return (
    <div
      className='d-flex flex-column mb-3 row-gap-2'
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/detailquestion/' + answer.question_id)}
    >
      <div
        className=''
        style={{
          fontSize: '12px',
          textAlign: 'end',
        }}
      >
        {new Date(answer.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      <div
        className='col-md-12 col-sm-12 text-sm-start'
        style={{
          maxHeight: '100%',
          fontSize: '14px',
          backgroundColor: '#D9D9D9',
          borderRadius: '4px',
        }}
      >
        <p
          style={{
            maxHeight: '100%',
            fontSize: '14px',
            textAlign: 'start !important',
            padding: '8px',
          }}
        >
          {' '}
          {answer.body.length > 100
            ? answer.body.substring(0, 100) + '...'
            : answer.body}
        </p>
      </div>
    </div>
  );
}
