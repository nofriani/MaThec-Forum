import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailData from '../components/DetailData';
import AnswerInput from '../components/AnswerInput';
import useAnswerStore from '../zustand/answerStore';

const EditAnswer = () => {
  const { id } = useParams();
  const { isLoading, dataQuestion, fetchDataAnswer } = useAnswerStore();

  useEffect(() => {
    // fetchDataQuestion(id);
    fetchDataAnswer(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataAnswer, id]);

  if (isLoading) {
    return (
      <div className='vh-100 d-flex align-items-center justify-content-center'>
        <div class='spinner-border' role='status'>
          <span class='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='px-1'>
      <div id='question' className='w-100'>
        <div className='pb-2' style={{ backgroundColor: '#ffffff' }}>
          {dataQuestion.question && (
            <DetailData question={dataQuestion.question} />
          )}
        </div>
        <AnswerInput />
      </div>
      {/* Content */}
    </div>
  );
};

export default EditAnswer;
