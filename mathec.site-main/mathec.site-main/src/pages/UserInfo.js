import { Link, useNavigate, useParams } from 'react-router-dom';
import useUserStore from '../zustand/usersStore';
import { useEffect, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';
import CardQuestion from '../components/QuestionCard';
import QuestionRecap from '../components/Recaps/Question/Question';
import AnswerRecap from '../components/Recaps/Answer/Answer';
import CardAnswer from '../components/AnswerCard';
import { BsPlusLg } from 'react-icons/bs';
import { BsExclamationCircleFill } from 'react-icons/bs';
import ReportModal from '../components/Report';

const UserInfo = () => {
  const { isLoading, userinfoById, userinfo } = useUserStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [component, setComponent] = useState('UserInfo');
  const [loading, setLoading] = useState(false);
  const [follow, setFollow] = useState(false);
  const [show, setShow] = useState(false);
  const [foll, setFoll] = useState(false);

  const today = new Date();
  const longReg = new Date(userinfo.createdAt);

  const yearReg = longReg.getFullYear();
  const monthReg = longReg.getMonth() + 1;
  const dayReg = longReg.getDate();

  const yearCurrent = today.getFullYear();
  const monthCurrent = today.getMonth() + 1;
  const dayCurrent = today.getDate();

  const timeDiffYear = yearCurrent - yearReg;
  let timeDiffMonth = (yearCurrent - yearReg) * 12 + monthCurrent - monthReg;
  const timeDIffDay = dayCurrent - dayReg;
  const formattedDate = `${dayReg}-${monthReg}-${yearReg}`;

  const totalDiffDays = timeDiffYear * 365 + timeDiffMonth * 30 + timeDIffDay;

  if (dayCurrent < dayReg) {
    timeDiffMonth--;  
  }

  const handleUserInfo = () => {
    setLoading(true);
    setTimeout(() => {
      setComponent('UserInfo');
      setLoading(false);
    }, 500);
  };

  const handleAnswer = () => {
    setLoading(true);
    setTimeout(() => {
      setComponent('Answer');
      setLoading(false);
    }, 500);
  };

  const handleQuestion = () => {
    setLoading(true);
    setTimeout(() => {
      setComponent('Question');
      setLoading(false);
    }, 500);
  };

  const handleFollowing = () => {
    setLoading(true);
    setTimeout(() => {
      setComponent('Following');
      setLoading(false);
    }, 500);
  };

  const handleFollow = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    await fetch(process.env.REACT_APP_API_HOST + '/api/users/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        follower_id: id,
        following_id: user.data.user_id,
      }),
    });
    setFoll((prev) => !prev);
  };

  useEffect(() => {
    const fetchFollow = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const result = await fetch(
        process.env.REACT_APP_API_HOST + '/api/users/check-follow',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            follower_id: id,
            following_id: user.data.user_id,
          }),
        }
      );
      const response = await result.json();

      setFollow(response.statusFollow);
    };
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (id === user.data.user_id) {
        navigate('/profile');
      }
      fetchFollow();
    }
  }, [id, navigate, foll]);

  useEffect(() => {
    userinfoById(id);
  }, [id, userinfoById]);

  if (isLoading) {
    return (
      <div className='vh-100 d-flex align-items-center justify-content-center'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='row p-4'>
            <div
              className='col-md-3 pb-5'
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div>
                <img
                  src={
                    userinfo.Profile && userinfo.Profile.profile_picture
                      ? `${process.env.REACT_APP_API_HOST}/${userinfo.Profile.profile_picture}`
                      : 'https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png'
                  }
                  style={{
                    width: '200px',
                    borderRadius: '10%',
                    objectFit: 'cover',
                  }}
                  alt='profile'
                ></img>
              </div>

              <div
                className='card mt-5'
                style={{
                  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                  width: '70%',
                }}
              >
                <div className='card-body'>
                  <ul
                    style={{
                      listStyle: 'none',
                      width: '100%',
                    }}
                  >
                    <li className='fw-bold mb-2'>
                      <Link
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                          fontSize: '16px',
                        }}
                        onClick={handleUserInfo}
                      >
                        User Info
                      </Link>
                    </li>
                    <li className='fw-bold mb-2'>
                      <Link
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                          fontSize: '16px',
                        }}
                        onClick={handleQuestion}
                      >
                        Questions
                      </Link>
                    </li>
                    <li className='fw-bold mb-2'>
                      <Link
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                          fontSize: '16px',
                        }}
                        onClick={handleAnswer}
                      >
                        Answers
                      </Link>
                    </li>
                    <li className='fw-bold mb-2'>
                      <Link
                        style={{
                          textDecoration: 'none',
                          color: 'black',
                          fontSize: '16px',
                        }}
                        onClick={handleFollowing}
                      >
                        Following
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-md-9'>
              <div className='d-flex justify-content-between align-items-center'>
                <h1
                  className='fw-bold d-flex align-content-end gap-2'
                  style={{
                    fontSize: '16px',
                  }}
                >
                  {userinfo.name}{' '}
                  <span
                    style={{
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'start',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (JSON.parse(localStorage.getItem('user'))) {
                        handleFollow();
                      } else {
                        alert('Please login first!');
                      }
                    }}
                  >
                    {!follow ? (
                      <>
                        <span
                          style={{
                            fontSize: '14px',
                          }}
                        >
                          Follow
                        </span>
                        <BsPlusLg
                          style={{
                            fontWeight: 'bolder',
                            fontSize: '14px',
                          }}
                        />
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: '14px',
                        }}
                      >
                        Followed
                      </span>
                    )}
                  </span>
                </h1>
                <div>
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {timeDiffMonth > 11 ? (
                  <div
                    className='fw-light text-black'
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    <FiCalendar size={20} /> Member From {formattedDate}
                  </div>
                ) : totalDiffDays < 1  ? (
                  <div
                    className='fw-light text-black'
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    <FiCalendar size={20} /> Member for 1 days
                  </div>
                ) : timeDiffMonth < 1 ? (
                  <div className='fw-light text-black'>
                    <FiCalendar size={20} /> Member for {Math.abs(totalDiffDays)} days
                  </div>
                ) : (
                  <div
                    className='fw-light text-black'
                    style={{
                      fontSize: '14px',
                    }}
                  >
                    <FiCalendar size={20} /> Member for {timeDiffMonth} month
                  </div>
                )}

                <div
                  className='fw-light text-black'
                  style={{
                    fontSize: '14px',
                  }}
                >
                  {/* <FiMapPin size={20} />
                {userinfo.Profile && userinfo.Profile.address} */}
                  {''}
                </div>
                <div
                  className='fw-light text-black'
                  style={{
                    fontSize: '14px',
                  }}
                >
                  {' '}
                </div>
              </div>
              <div>
                <div
                  className='text-start mt-4'
                  style={{
                    color: 'black',
                    fontSize: '16px',
                  }}
                >
                  {userinfo.Profile ? (
                    userinfo.Profile.about_me ? (
                      userinfo.Profile.about_me
                    ) : (
                      <h4>Biodata not found</h4>
                    )
                  ) : (
                    <h4>Biodata not found</h4>
                  )}
                </div>
              </div>

              <div className='mt-5'>
                {loading ? (
                  <div className='d-flex align-items-center justify-content-center'>
                    <div className='spinner-border' role='status'>
                      <span className='visually-hidden'>Loading...</span>
                    </div>
                  </div>
                ) : component === 'UserInfo' ? (
                  <div className='row'>
                    <div className='col-md-6'>
                      <h6
                        className='fw-bold'
                        style={{
                          fontSize: '16px',
                        }}
                      >
                        Questions
                      </h6>
                      <div
                        className='card shadow'
                        style={{
                          border: 'none',
                        }}
                      >
                        <div className='card-body'>
                          <div
                            className='col-sm-12'
                            style={{
                              fontSize: '14px',
                            }}
                          >
                            {userinfo.Questions &&
                            userinfo.Questions.length === 0 ? (
                              <p className='mt-3'>No data avaible yet</p>
                            ) : (
                              userinfo.Questions &&
                              userinfo.Questions.map((data, index) => (
                                <CardQuestion key={index} question={data} />
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <h6
                        className='fw-bold'
                        style={{
                          fontSize: '16px',
                        }}
                      >
                        Answers
                      </h6>
                      <div
                        className='card shadow'
                        style={{
                          border: 'none',
                        }}
                      >
                        <div className='card-body'>
                          <div className='mt-3 col-sm-12'>
                            {userinfo.answers && userinfo.answers.length < 1 ? (
                              <p
                                className='mt-3'
                                style={{
                                  fontSize: '14px',
                                }}
                              >
                                No data avaible yet
                              </p>
                            ) : (
                              userinfo.answers &&
                              userinfo.answers.map((answer) => (
                                <div key={answer.id}>
                                  <CardAnswer answer={answer.body !== "" ? answer : null} />
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : component === 'Question' ? (
                  <QuestionRecap />
                ) : component === 'Answer' ? (
                  <AnswerRecap />
                ) : userinfo.followings && userinfo.followings.length === 0 ? (
                  <>
                    <h5 className='fw-bold'>Followings</h5>
                    <h6>Data not found</h6>
                  </>
                ) : (
                  <div className='row gap-4'>
                    {userinfo.followings.map((item, index) => {
                      if (index < 3) {
                        return (
                          <div
                            key={index}
                            className='card col-lg-2  col-md-3 col-sm-4'
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => navigate('/userinfo/' + item.id)}
                          >
                            <div
                              className='card-body'
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <img
                                src={
                                  item.Profile && item.Profile.profile_picture
                                    ? `${process.env.REACT_APP_API_HOST}/${item.Profile.profile_picture}`
                                    : 'https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png'
                                }
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                }}
                                alt=''
                              />
                              <div>
                                <p className='text-center mt-3 fw-bold'>
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return <></>;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReportModal to='user' id={id} show={show} setShow={setShow} />
    </>
  );
};

export default UserInfo;
