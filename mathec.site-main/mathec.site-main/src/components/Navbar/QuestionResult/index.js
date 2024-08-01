import { useNavigate } from 'react-router-dom';

export default function QuestionResult({ questions, close }) {
  const navigate = useNavigate()
  const navigation = (item) => {
    navigate('/detailquestion/' + item.id);
    close()
  }
  return (
    <div>
      <h6
        style={{
          fontSize: '16px',
          color: 'blue',
          fontWeight: 'bold',
        }}
      >
        Questions
      </h6>
      {/* <p>No Result from the result</p> */}

      {questions.length === 0 ? (
        <p>No Result from the result</p>
      ) : (
        questions.map((item, index) => (
          <div
            role='link'
            style={{
              textDecoration: 'none',
              color: 'black',
              cursor: "pointer"
            }}
            key={index}
            onClick={() => navigation(item)}
          >
            <h6
              style={{
                fontSize: '14px',
              }}
            >
              {item.title}
            </h6>
            {/* <div>
              <p
                style={{
                  fontSize: '12px',
                }}
              >
                kok bisa sih belajar javascript semudah ini ??
              </p>
            </div> */}
          </div>
        ))
      )}
    </div>
  );
}
