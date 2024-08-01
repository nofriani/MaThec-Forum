import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DetailData from '../components/DetailData';
import AnswerInput from '../components/AnswerInput';
import DetailAnswer from '../components/DetailAnswer';
import useAnswerStore from '../zustand/answerStore';

const DetailQuestion = () => {
  const { id } = useParams();
  const { isLoading, dataQuestion, fetchDataQuestion, filterDataAnswer } = useAnswerStore();
  const [state, setState] = useState('long');

  const addViewQuestion = async () => {
    await fetch(process.env.REACT_APP_API_HOST + '/api/questions/add-view/' + id);
  };

  useEffect(() => {
    fetchDataQuestion(id);
    addViewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDataQuestion, id]);

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
          {dataQuestion.question && <DetailData question={dataQuestion.question} />}
          <div className='row justify-content-between d-flex px-4'>
            <div className='col-lg-3 col-md-6 col-sm-12'>
              <h5>{dataQuestion.answers && dataQuestion.answers.length} answers</h5>
            </div>
            <div className='col-lg-3 col-md-6 col-sm-12'>
              <div className='btn-group mb-2' role='group'>
                <button
                  type='button'
                  className='btn btn-light ms-1 border'
                  onClick={() => {
                    filterDataAnswer(id, 'hot');
                    setState('hot');
                  }}
                >
                  Rank
                </button>
                <button
                  type='button'
                  className='btn btn-light ms-1 border'
                  onClick={() => {
                    filterDataAnswer(id, 'new');
                    setState('new');
                  }}
                >
                  New
                </button>
                <button
                  type='button'
                  className='btn btn-light ms-1 border'
                  onClick={() => {
                    filterDataAnswer(id, 'long');
                    setState('long');
                  }}
                >
                  Long
                </button>
              </div>
            </div>
          </div>
        </div>
        {dataQuestion.answers &&
          dataQuestion.answers.map(answer => (
            <div key={answer.id}>
              <DetailAnswer answer={answer} id={id} state={state} />
            </div>
          ))}
        <AnswerInput />
      </div>
      {/* Content */}
    </div>
  );
};

export default DetailQuestion;
