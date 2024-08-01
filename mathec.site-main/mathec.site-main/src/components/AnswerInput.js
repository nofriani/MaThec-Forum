/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import 'react-tagsinput/react-tagsinput.css';
import { useNavigate, useParams } from 'react-router-dom';
import useAnswerStore from '../zustand/answerStore';
import useAuthStore from '../zustand/authStore';

const AnswerInput = () => {
  const { dataAnswer } = useAnswerStore();
  const [body, setBody] = useState(dataAnswer == null ? '' : dataAnswer.body);
  const [loggedIn, setLoggedIn] = useState(true);
  const [success, setSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();

  const { postAnswer, loadingAnswer, clearAnswer, updateAnswer } = useAnswerStore();
  const { isLogin } = useAuthStore();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async e => {
    e.preventDefault();
    if (isLogin) {
      if (location.pathname.includes('editanswer')) {
        await updateAnswer(id, body);
      } else {
        await postAnswer(id, body);
        setBody('');
        const checkResponden = await fetch(process.env.REACT_APP_API_HOST + '/api/questioner/check/' + user.data.user_id);
        const responseJson = await checkResponden.json();
        if (!responseJson.isResponden) {
          setSuccess(true);
          setOpenModal(true);
        }
      }
      setSuccess(true);
    } else {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    return () => clearAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openModal) {
      const modal = document.getElementById('exampleModal');
      modal.classList.add('show');
    }
  }, [openModal]);

  return (
    <div>
      <div className='card'>
        <div className='card-body px-5'>
          {success === true ? location.pathname.includes('editanswer') ? <div className='alert alert-success'>Succesfully update your Answer</div> : <div className='alert alert-success'>Succesfully send your answer</div> : ''}
          {loggedIn === false ? <div className='alert alert-warning'>Please login first!</div> : ''}
          <form className='formQuestion' onSubmit={e => handleSubmit(e)}>
            <label htmlFor='' className='my-3'>
              Send your Answer
            </label>
            <ReactQuill
              value={body}
              onChange={value => setBody(value)}
              modules={{
                toolbar: [
                  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                  ['blockquote', 'code-block'],
                  [{ header: 1 }, { header: 2 }], // custom button values
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                  [{ align: 'justify' }, { align: '' }, { align: 'center' }, { align: 'right' }, { direction: 'rtl' }, { color: [] }, { background: [] }], // text direction // dropdown with defaults from theme
                  ['link', 'image', 'video'],
                ],
              }}
              theme='snow'
              className='text-editor'
            />
            <button
              style={{
                width: '100px',
                marginTop: '10px',
                borderRadius: '10px',
                border: 'none',
                padding: '10px',
              }}
            >
              <div className='d-flex align-items-center justify-content-center gap-2'>
                {loadingAnswer && (
                  <div class='spinner-border' role='status'>
                    <span class='visually-hidden'>Loading...</span>
                  </div>
                )}
                <div>Send</div>
              </div>
            </button>
          </form>
        </div>
      </div>
      <div className={`modal fade`} style={{ display: openModal ? 'block' : 'none' }} id='exampleModal' tabIndex={-1} aria-labelledby='exampleModalLabel' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabel'>
              Questionnaire
              </h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
            </div>
            <div className='modal-body'>Helo {user && user.data.name} are you willing to fill out the questionnaire?</div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger'
                data-bs-dismiss='modal'
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                No
              </button>
              <button
                type='button'
                className='btn btn-success'
                onClick={() => {
                  navigate('/kuesioner');
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerInput;
