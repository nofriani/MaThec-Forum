import { useEffect, useState } from 'react';
import Likert from 'react-likert-scale';
import { useNavigate } from 'react-router-dom';

export default function Quesioner() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataSubmit, setDataSubmit] = useState([]);
  const [openModalA, setOpenModalA] = useState(false);
  const [openModalB, setOpenModalB] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  async function handleSubmit(e) {
    e.preventDefault();
    const checkInput = dataSubmit.filter((item) => item.score === 0);
    if (checkInput.length !== 0) {
      setOpenModalA(true);
    } else {
      await fetch(process.env.REACT_APP_API_HOST + '/api/questioner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questioner: dataSubmit }),
      });
      setOpenModalB(true);
    }
  }

  useEffect(() => {
    async function getKuesioner() {
      const response = await fetch(
        process.env.REACT_APP_API_HOST + '/api/questioner'
      );
      const json = await response.json();
      setData(json.data);

      let dataScore = [];

      json.data.forEach((element) => {
        element.Questioners.forEach((item) => {
          dataScore.push({
            id_user: user.data.user_id,
            id_questioner: item.id,
            score: 0,
          });
        });
      });
      setDataSubmit(dataScore);
    }

    async function checkResponden() {
      const checkResponden = await fetch(
        process.env.REACT_APP_API_HOST +
          '/api/questioner/check/' +
          user.data.user_id
      );
      const responseJson = await checkResponden.json();
      if (responseJson.isResponden) {
        navigate('/');
      }
    }

    if (!user) {
      navigate('/auth');
    } else {
      getKuesioner();
      checkResponden();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openModalA) {
      const modal = document.getElementById('exampleModalA');
      modal.classList.add('show');
    }
  }, [openModalA]);
  useEffect(() => {
    if (openModalB) {
      const modal = document.getElementById('exampleModalB');
      modal.classList.add('show');
    }
  }, [openModalB]);

  return (
    <>
      <div className='container mt-5'>
        <div className='col-md-12'>
          <div className='card'>
            <div className='card-body m-1'>
              {/* header card */}
              <div className='container d-block'>
                <h3>Petunjuk Pengisian</h3>
                <h6 className=''>
                  1. Isilah setiap pertanyaan yang diminta dengan cara memilih
                  salah satu jawaban dengan memberi tanda check (.) pada pilihan
                  jawaban yang tersedia berdasarkan pendapat anda sendiri.
                </h6>
                <h6>
                  2. Bacalah kembali setiap pertanyaan untuk memastikan tidak
                  ada pertanyaan yang tidak terjawab.
                </h6>
                <p className='m-0'>Keterangan: </p>
                <ul style={{ listStyleType: 'none' }}>
                  <li>1 = Sangat Tidak Setuju </li>
                  <li>2 = Tidak Setuju</li>
                  <li>3 = Ragu-ragu</li>
                  <li>4 = Setuju</li>
                  <li>5 = Sangat Setuju</li>
                </ul>
              </div>
            </div>

            <div className='container p-3'>
              <form
                className='row justify-content-center  gap-2'
                onSubmit={handleSubmit}
              >
                {data.map((item, index) => {
                  return (
                    <div className='col-lg-10 text-center col-sm-12'>
                      <div className='card'>
                        <div className='card-header text-start'>
                          <div className='card-title fw-bold'>{item.name}</div>
                        </div>
                        <div className='card-body m-1'>
                          {item.Questioners.map((kuesioner, index) => {
                            return (
                              <div className=''>
                                <Likert
                                  question={`${index + 1} ${'.'}       ${
                                    kuesioner.questioner
                                  }`}
                                  responses={[
                                    {
                                      value: 1,
                                      text: '1',
                                      id_questioner: kuesioner.id,
                                    },
                                    {
                                      value: 2,
                                      text: '2',
                                      id_questioner: kuesioner.id,
                                    },
                                    {
                                      value: 3,
                                      text: '3',
                                      id_questioner: kuesioner.id,
                                    },
                                    {
                                      value: 4,
                                      text: '4',
                                      id_questioner: kuesioner.id,
                                    },
                                    {
                                      value: 5,
                                      text: '5',
                                      id_questioner: kuesioner.id,
                                    },
                                  ]}
                                  style={{ marginBottom: '6rem' }}
                                  onChange={(val) => {
                                    setDataSubmit((prevState) => {
                                      let nextState = prevState.map((item) => {
                                        if (
                                          item.id_questioner ===
                                          val.id_questioner
                                        ) {
                                          return {
                                            id_user: user.data.user_id,
                                            id_questioner: item.id_questioner,
                                            score: val.value,
                                          };
                                        }
                                        return item;
                                      });
                                      return nextState;
                                    });
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className='col-lg-10 text-center d-flex flex-column mt-3 col-sm-12'>
                  <button className='btn btn-primary'>Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade`}
        style={{ display: openModalA ? 'block' : 'none' }}
        id='exampleModalA'
        tabIndex={-1}
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabel'>
                Questionnaire
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              />
            </div>
            <div className='modal-body'>All questions are mandatory!</div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-success'
                data-bs-dismiss='modal'
                onClick={() => {
                  setOpenModalA(false);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade`}
        style={{ display: openModalB ? 'block' : 'none' }}
        id='exampleModalB'
        tabIndex={-1}
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5' id='exampleModalLabel'>
                Questionnaire
              </h1>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              />
            </div>
            <div className='modal-body'>
              Thank you for filling out the questionnaire!
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger'
                data-bs-dismiss='modal'
                onClick={() => {
                  setOpenModalB(false);
                  setTimeout(() => {
                    navigate('/');
                  }, 1000);
                }}
              >
                You are Welcome
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
