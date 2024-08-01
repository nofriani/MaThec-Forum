import Action from './Action/Action';
import BoxTag from '../components/BoxTag';
import { Link } from 'react-router-dom';
import { BsFillShareFill, BsExclamationCircleFill } from 'react-icons/bs';
import { HiChatAlt2 } from 'react-icons/hi';
import { useState } from 'react';
// import { Modal, Form, Spinner } from 'react-bootstrap';
import ReportModal from './Report';

const QuestionsData = ({ question, onLike, onDislike, onSave, name }) => {
  const [show, setShow] = useState(false);
  const inputDate = new Date(question.posted_at);
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = inputDate.toLocaleDateString('id-ID', options);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: question.title,
          text: question.body,
          url:
            'http://' +
            window.location.host +
            '/detailquestion/' +
            question.question_id,
        })
        .then(() => console.log('Berbagi berhasil.'))
        .catch((error) => console.error('Gagal berbagi:', error));
    } else {
      // Tampilkan pesan alternatif jika Share API tidak didukung
      alert('Share API tidak didukung di browser ini.');
    }
  };

  return (
    <>
      <div className='row mb-5'>
        <div className='col-md-12'>
          <div className='card'>
            <div className='card-body m-1'>
              {/* header card */}
              <div className='d-flex'>
                <div className='d-flex justify-content-center'>
                  <img
                    src={
                      question.profile_picture === null
                        ? 'https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png'
                        : process.env.REACT_APP_API_HOST +
                          '/' +
                          question.profile_picture
                    }
                    alt='Profile'
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '100%',
                      objectFit: 'cover',
                      marginRight: '6px',
                    }}
                    className='img-card-profile'
                  />
                </div>
                <div
                  className='w-100'
                  style={{
                    paddingLeft: '10px',
                  }}
                >
                  <h5
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {question.title}
                  </h5>
                  <div
                    className='row'
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    <p
                      className='col-sm-12 col-md-2'
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      {question.uploader.length > 13
                        ? question.uploader.substring(0, 13).trimEnd() + '...'
                        : question.uploader}
                    </p>
                    <p
                      className='col-sm-12 col-md-4'
                      style={{
                        fontSize: '14px',
                      }}
                    >
                      {' '}
                      <i>{formattedDate}</i>{' '}
                    </p>
                  </div>
                  <p
                    className='text-start text-black-50'
                    style={{
                      lineHeight: '1px',
                      fontSize: '14px',
                    }}
                  >
                    {question.viewer_total} views
                  </p>

                  {/* tag questions */}
                  <div className='tag-container d-flex mt-4'>
                    {question.tags &&
                      question.tags.map((item, index) => (
                        <BoxTag key={index} name={item.tag_name} />
                      ))}
                  </div>

                  {/* body */}
                  <div
                    className='mt-3 text-black'
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {question.body.length > 100 ? (
                      <>
                        {question.body.substring(0, 100) + '...'}
                        <br />
                        <Link
                          to={'/detailquestion/' + question.question_id}
                          style={{
                            textDecoration: 'none',
                          }}
                        >
                          more...
                        </Link>
                      </>
                    ) : (
                      question.body
                    )}
                  </div>

                  {/* action */}
                  <div className='d-flex justify-content-between mt-4 w-100'>
                    <div className='box-action gap-3 d-flex my-3 '>
                      <div className='d-flex gap-3 align-items-center justify-content-start'>
                        <Action
                          question={question}
                          onLike={onLike}
                          name={name}
                          type={'like'}
                        />

                        <Action
                          question={question}
                          onDislike={onDislike}
                          name={name}
                          type={'dislike'}
                        />
                      </div>

                      <div className='d-flex gap-3 align-items-center justify-content-start'>
                        <div>
                          <Link
                            className='d-flex gap-1'
                            to={'/detailquestion/' + question.question_id}
                            style={{
                              textDecoration: 'none',
                              color: 'black',
                            }}
                          >
                            {/* <img src={chatIcon} alt='' /> */}
                            <HiChatAlt2 size={25} className='text-success' />
                            <span>{question.answer_total}</span> Answers
                          </Link>
                        </div>

                        <div className='d-flex'>
                          <BsFillShareFill
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => handleShare()}
                          />
                        </div>
                        <div className=''>
                          <button
                            style={{
                              border: 'none',
                              backgroundColor: 'white',
                            }}
                            data-toggle='modal'
                            data-target='#exampleModalCenter'
                            onClick={() => setShow(true)}
                          >
                            <BsExclamationCircleFill
                              style={{
                                cursor: 'pointer',
                              }}
                              size={20}
                              color={'#000000'}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex align-items-center text-center'>
                      <Action
                        question={question}
                        onSaved={onSave}
                        name={name}
                        type={'saved'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReportModal
        to='question'
        id={question.question_id}
        show={show}
        setShow={setShow}
      />
    </>
  );
};

export default QuestionsData;
