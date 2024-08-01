import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useUserStore from '../zustand/usersStore';
import { FiCalendar, FiCamera, FiMapPin } from 'react-icons/fi';
import useAuthStore from '../zustand/authStore';
import QuestionRecap from '../components/Recaps/Question/Question';
import AnswerRecap from '../components/Recaps/Answer/Answer';

export default function EditProfile() {
  const { isLoading, userinfoById, userinfo, updateUser, error } =
    useUserStore();
  const { getInfoLogin } = useAuthStore();
  const [dataProfile, setDataProfile] = useState({
    name: '',
    email: '',
    address: '',
    about_me: '',
    link: '',
    github_link: '',
  });
  const navigate = useNavigate();
  const [component, setComponent] = useState('editprofile');
  const { logout } = useAuthStore();

  const [file, setFile] = useState();
  const [previewImage, setPreviewImage] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setFile(() => fileUploaded);
    if (fileUploaded) {
      const url = URL.createObjectURL(fileUploaded);
      setPreviewImage(url);
    }
  };

  const today = new Date();
  const longReg = new Date(userinfo.createdAt);

  const yearReg = longReg.getFullYear();
  const monthReg = longReg.getMonth() + 1;
  const dayReg = longReg.getDate();

  const yearCurrent = today.getFullYear();
  const monthCurrent = today.getMonth() + 1;
  const dayCurrent = today.getDate();

  const timeDiffMonth = (yearCurrent - yearReg) * 12 + monthCurrent - monthReg;
  const timeDIffDay = dayCurrent - dayReg;
  const formattedDate = `${dayReg}-${monthReg}-${yearReg}`;
  useEffect(() => {
    if (user) {
      userinfoById(user.data.user_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userinfoById]);

  useEffect(() => {
    if (isLoading === false) {
      setDataProfile({
        name: userinfo.name,
        email: userinfo.email,
        address: userinfo.Profile && userinfo.Profile.address,
        about_me: userinfo.Profile && userinfo.Profile.about_me,
        link: userinfo.Profile && userinfo.Profile.link,
        github_link: userinfo.Profile && userinfo.Profile.github_link,
      });
    }
  }, [isLoading, userinfo]);

  const handleInput = (event) => {
    setDataProfile({
      ...dataProfile,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in dataProfile) {
      formData.append(key, dataProfile[key]);
    }

    if (file) {
      formData.append('file', file);
    }
    
    
    await updateUser(formData);
    getInfoLogin();
  };

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
    <div className='card'>
      <div className='card-body'>
        {error && <div className='alert alert-danger'>{error}</div>}
        <div className='row p-4'>
          <div
            className='col-md-4 pb-5'
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
                      to={'/profile'}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Recaps
                    </Link>
                  </li>
                  <li className='fw-bold mb-2'>
                    <Link
                      onClick={() => setComponent('editprofile')}
                      to={'/editprofile'}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li className='fw-bold mb-2'>
                    <Link
                      onClick={() => setComponent('question')}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Questions
                    </Link>
                  </li>
                  <li className='fw-bold mb-2'>
                    <Link
                      onClick={() => setComponent('answer')}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Answers
                    </Link>
                  </li>
                  <li className='fw-bold mb-2'>
                    <Link
                      onClick={() => setComponent('following')}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Following
                    </Link>
                  </li>
                  <li className='fw-bold mb-2'>
                    <Link
                      onClick={logout}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                      }}
                    >
                      Log out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='col-md-8'>
            <h1
              className='fw-bold'
              style={{
                fontSize: '16px',
              }}
            >
              {userinfo.name}
            </h1>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {timeDiffMonth > 11 ? (
                <div
                  className='fw-light text-black'
                  style={{ fontSize: '14px' }}
                >
                  <i>
                    <FiCalendar size={20} />
                  </i>
                  <span> Member From {formattedDate}</span>
                </div>
              ) : timeDIffDay < 1 ? (
                <div
                  className='fw-light text-black'
                  style={{ fontSize: '14px' }}
                >
                  <i>
                    <FiCalendar size={20} />
                  </i>
                  <span> Member for 1 days</span>
                </div>
              ) : timeDiffMonth < 1 ? (
                <div
                  className='fw-light text-black'
                  style={{ fontSize: '14px' }}
                >
                  <i>
                    <FiCalendar size={20} />
                  </i>
                  <span> Member for {timeDIffDay} days</span>
                </div>
              ) : (
                <div
                  className='fw-light text-black'
                  style={{ fontSize: '14px' }}
                >
                  <i>
                    <FiCalendar size={20} />
                  </i>
                  <span> Member for {timeDiffMonth} month</span>
                </div>
              )}

              <div className='fw-light text-black' style={{ fontSize: '14px' }}>
                <i>
                  <FiMapPin size={20} />{' '}
                </i>
                {userinfo.Profile && userinfo.Profile.address}
              </div>
              <div className='fw-light text-black'>{''}</div>
            </div>
            <hr />
            {component === 'editprofile' ? (
              <>
                <h1
                  style={{
                    fontSize: '16px',
                  }}
                >
                  Edit Profile
                </h1>
                <div className='col'>
                  <div className='row'>
                    <div className='col mb-3'>
                      <div className='card'>
                        <div className='card-body'>
                          <p style={{ textAlign: 'start', fontSize: '12px' }}>
                            Edit Image
                          </p>
                          <form onSubmit={handleSubmit}>
                            <div className='e-profile'>
                              <div className='row'>
                                <div className='col-12 col-sm-auto mb-3'>
                                  <div className='mx-auto'>
                                    <div className='d-flex justify-content-center align-items-center rounded'>
                                      <img
                                        src={
                                          previewImage
                                            ? previewImage
                                            : userinfo.Profile &&
                                              userinfo.Profile.profile_picture
                                            ? `${process.env.REACT_APP_API_HOST}/${userinfo.Profile.profile_picture}`
                                            : 'https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png'
                                        }
                                        alt=''
                                        style={{
                                          width: '80px',
                                          height: '80px',
                                          borderRadius: '100%',
                                          objectFit: 'cover',
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <button
                                    className='btn btn-primary mt-3 btn-sm'
                                    type='button'
                                    onClick={handleClick}
                                  >
                                    <i>
                                      <FiCamera />
                                    </i>
                                    <span> Select Photo</span>
                                  </button>
                                  <input
                                    type='file'
                                    style={{ display: 'none' }}
                                    onChange={handleChange}
                                    ref={hiddenFileInput}
                                  />
                                </div>
                              </div>
                              <ul className='nav nav-tabs'>
                                <li className='nav-item'></li>
                              </ul>
                              <div className='tab-content pt-3'>
                                <div className='tab-pane active'>
                                  <div className='row'>
                                    <div className='col'>
                                      <div className='row'>
                                        <div className='col'>
                                          <div className='form-group mb-3'>
                                            <label>Username</label>
                                            <input
                                              className='form-control'
                                              type='text'
                                              name='name'
                                              placeholder=''
                                              value={dataProfile.name}
                                              onChange={handleInput}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className='row'>
                                        <div className='col'>
                                          <div className='form-group mb-3'>
                                            <label>Email</label>
                                            <input
                                              className='form-control'
                                              type='email'
                                              name='email'
                                              placeholder=''
                                              value={dataProfile.email}
                                              onChange={handleInput}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className='row'>
                                        <div className='col'>
                                          <div className='form-group mb-3'>
                                            <label>Address</label>
                                            <input
                                              className='form-control'
                                              type='text'
                                              name='address'
                                              placeholder=''
                                              value={dataProfile.address}
                                              onChange={handleInput}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className='row'>
                                        <div className='col mb-3'>
                                          <div className='form-group mb-3'>
                                            <label>About Me</label>
                                            <textarea
                                              className='form-control'
                                              rows='5'
                                              name='about_me'
                                              placeholder='My Bio'
                                              value={dataProfile.about_me}
                                              onChange={handleInput}
                                            ></textarea>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='row'>
                                        <div className='col'>
                                          <label>Linkedin</label>
                                          <div className='form-group mb-3'>
                                            <input
                                              className='form-control'
                                              type='text'
                                              name='link'
                                              placeholder=''
                                              value={dataProfile.link}
                                              onChange={handleInput}
                                            />
                                          </div>
                                        </div>
                                        <div className='col'>
                                          <label>Github</label>
                                          <div className='form-group mb-3'>
                                            <input
                                              className='form-control'
                                              type='text'
                                              placeholder=''
                                              name='github_link'
                                              value={dataProfile.github_link}
                                              onChange={handleInput}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row'>
                                    <div className='col d-flex justify-content-end'>
                                      <button className='btn btn-primary'>
                                        Save Changes
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : component === 'question' ? (
              <div className='mt-5'>
                <QuestionRecap />
              </div>
            ) : component === 'answer' ? (
              <div className='mt-5'>
                <AnswerRecap />
              </div>
            ) : userinfo.followings && userinfo.followings.length === 0 ? (
              <>
                <h5 className='fw-bold'>Followings</h5>
                <h6>Data Not Found!</h6>
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
  );
}
