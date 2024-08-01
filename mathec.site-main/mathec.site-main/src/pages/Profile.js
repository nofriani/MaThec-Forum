import { Link, useNavigate } from "react-router-dom";
import useUserStore from "../zustand/usersStore";
import { useEffect, useState } from "react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import CardQuestion from "../components/QuestionCard";
import CardAnswer from "../components/AnswerCard";
import QuestionRecap from "../components/Recaps/Question/Question";
import AnswerRecap from "../components/Recaps/Answer/Answer";
import useAuthStore from "../zustand/authStore";

const Profile = () => {
  const { isLoading, userProfile, userinfo } = useUserStore();
  const { logout } = useAuthStore();
  const [component, setComponent] = useState("recap");
  const navigate = useNavigate();

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

  useEffect(() => {
    userProfile();
  }, [userProfile]);

  if (isLoading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="card">
      <div className="card-body">
        <div className="row p-4">
          <div
            className="col-md-4 pb-5"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>
              <img
                src={
                  userinfo.Profile && userinfo.Profile.profile_picture
                    ? `${process.env.REACT_APP_API_HOST}/${userinfo.Profile.profile_picture}`
                    : ""
                }
                style={{
                  width: "200px",
                  borderRadius: "10%",
                  objectFit: "cover",
                }}
                alt="profile"
              ></img>
            </div>

            <div
              className="card mt-5"
              style={{
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                width: "70%",
              }}
            >
              <div className="card-body">
                <ul
                  style={{
                    listStyle: "none",
                    width: "100%",
                  }}
                >
                  <li className="fw-bold mb-2">
                    <Link
                      onClick={() => setComponent("recap")}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      Recaps
                    </Link>
                  </li>
                  <li className="fw-bold mb-2">
                    <Link
                      to={"/editprofile"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li className="fw-bold mb-2">
                    <Link
                      onClick={() => setComponent("question")}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      Questions
                    </Link>
                  </li>
                  <li className="fw-bold mb-2">
                    <Link
                      onClick={() => setComponent("answer")}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      Answers
                    </Link>
                  </li>
                  <li className="fw-bold mb-2">
                    <Link
                      onClick={() => setComponent("following")}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        fontSize: "16px",
                      }}
                    >
                      Following
                    </Link>
                  </li>
                  <li className="fw-bold mb-2">
                    <p
                      onClick={() => {
                        logout();
                        navigate("/auth");
                      }}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      Log out
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <h1
              className="fw-bold"
              style={{
                fontSize: "16px",
              }}
            >
              {userinfo.name}
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {timeDiffMonth > 11 ? (
                <div
                  className="fw-light text-black"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  <FiCalendar size={20} /> Member From {formattedDate}
                </div>
              ) : totalDiffDays < 1  ? (
                <div
                  className="fw-light text-black"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  <FiCalendar size={20} /> Member for 1 days
                </div>
              ) : timeDiffMonth < 1 ? (
                <div className="fw-light text-black">
                  <FiCalendar size={20} /> Member for {Math.abs(totalDiffDays)} days
                </div>
              ) : (
                <div
                  className="fw-light text-black"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  <FiCalendar size={20} /> Member for {timeDiffMonth} month
                </div>
              )}

              <div className="fw-light text-black" style={{ fontSize: "14px" }}>
                <FiMapPin size={20} />{" "}
                {userinfo.Profile && userinfo.Profile.address}
              </div>
              <div
                className="fw-light text-black"
                style={{
                  fontSize: "14px",
                }}
              >
                {" "}
              </div>
            </div>
            <div>
              <div
                className="text-start mt-4"
                style={{
                  color: "black",
                  fontSize: "14px",
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

            {component === "recap" ? (
              <div>
                <div className="mt-5">
                  <h6
                    className="fw-bold"
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    Questions
                  </h6>
                  <div
                    className="card shadow"
                    style={{
                      border: "none",
                    }}
                  >
                    <div className="card-body">
                      {userinfo.Questions && userinfo.Questions.length < 1 ? (
                        <p
                          className="mt-3"
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          No data avaible yet
                        </p>
                      ) : (
                        <div className="col-sm-12">
                          {userinfo.Questions ? 
                            (userinfo.Questions.map((data, index) => {
                              if (index < 3) {
                                return (
                                  <CardQuestion key={index} question={data} />
                                );
                              }
                              return <></> 
                            })) : (<h3 className="text-center">Data Not Found</h3>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h6
                    className="fw-bold"
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    Answers
                  </h6>
                  <div
                    className="card shadow"
                    style={{
                      border: "none",
                    }}
                  >
                    <div className="card-body">
                      {userinfo.answers && userinfo.answers.length < 1 ? (
                        <p
                          className="mt-3"
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          No data avaible yet
                        </p>
                      ) : (
                        userinfo.answers &&
                        userinfo.answers.map((answer, index) => {
                          if (index < 3) {
                            return (
                              <div key={answer.id}>
                                <CardAnswer answer={answer} />
                              </div>
                            );
                          }
                          return <></>;
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <h6 className="fw-bold">Following</h6>
                  <div className="row gap-4">
                    {userinfo.followings && userinfo.followings.length === 0 ? (
                      <div
                        className="card shadow colm-12"
                        style={{
                          border: "none",
                        }}
                      >
                        <div className="card-body">
                          <p
                            className="mt-3"
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            No data avaible yet
                          </p>
                        </div>
                      </div>
                    ) : (
                      userinfo.followings &&
                      userinfo.followings.map((item, index) => (
                        <div
                          key={index}
                          className="card col-lg-2  col-md-3 col-sm-4"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/userinfo/" + item.id)}
                        >
                          <div
                            className="card-body"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={
                                item.Profile && item.Profile.profile_picture
                                  ? `${process.env.REACT_APP_API_HOST}/${item.Profile.profile_picture}`
                                  : "https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png"
                              }
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                              alt=""
                            />
                            <div>
                              <p className="text-center mt-3 fw-bold">
                                {item.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : component === "question" ? (
              <div className="mt-5">
                <QuestionRecap />
              </div>
            ) : component === "answer" ? (
              <div className="mt-5">
                <AnswerRecap />
              </div>
            ) : (
              <div className="mt-5">
                <h6
                  className="fw-bold"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  Following
                </h6>
                <div className="row gap-4">
                  {userinfo.followings && userinfo.followings.length === 0 ? (
                    <div
                      className="card shadow colm-12"
                      style={{
                        border: "none",
                      }}
                    >
                      <div className="card-body">
                        <p className="mt-3">No data avaible yet</p>
                      </div>
                    </div>
                  ) : (
                    userinfo.followings &&
                    userinfo.followings.map((item, index) => {
                      if (index < 3) {
                        return (
                          <div
                            key={index}
                            className="card col-lg-2  col-md-3 col-sm-4"
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => navigate("/userinfo/" + item.id)}
                          >
                            <div
                              className="card-body"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={
                                  item.Profile && item.Profile.profile_picture
                                    ? `${process.env.REACT_APP_API_HOST}/${item.Profile.profile_picture}`
                                    : "https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png"
                                }
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                                alt=""
                              />
                              <div>
                                <p className="text-center mt-3 fw-bold">
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return <></>;
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
