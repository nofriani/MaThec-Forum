import { useNavigate } from 'react-router-dom';

export default function CardQuestion({ question }) {
  const navigate = useNavigate();
  return (
    <div className='row d-flex justify-content-between mb-3 align-items-center' style={{ cursor: 'pointer' }} onClick={() => navigate('/detailquestion/' + question.question_id)}>
      <div className='col-md-2'>
        <p
          style={{
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          {question.answer_total}
          <br />
          Answer
        </p>
      </div>

      <div
        className='col-md-6 text-sm-start'
        style={{
          maxHeight: '100%',
          fontSize: '14px',
        }}
      >
        {' '}
        {question.body.length > 100 ? question.body.substring(0, 100) + '...' : question.body}
      </div>
      <div
        className='col-md-4'
        style={{
          fontSize: '12px',
          textAlign: 'center',
        }}
      >
        {new Date(question.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </div>
  );
}
