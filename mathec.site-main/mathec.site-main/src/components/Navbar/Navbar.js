import logo from "../../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../../zustand/authStore";
import "./Navbar.css";
import QuestionResult from "./QuestionResult";
import UsersResult from "./UserResult";
import TagResult from "./TagResult";
import { HiChevronDown } from "react-icons/hi";

const dropDown = {
  position: "fixed",
  right: "40px",
};
const dropDownHide = {
  display: "none",
};
const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const { isLogin, logout, getInfoLogin, dataLogin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({
    questions: [],
    tags: [],
    users: [],
  });

  useEffect(() => {
    getInfoLogin();
  }, [getInfoLogin, isLogin, navigate]);

  const handleSearch = async (keyword) => {
    if (keyword !== "") {
      setLoading(true);
      const response = await fetch(
        process.env.REACT_APP_API_HOST + "/api/home/search/" + keyword
      );
      const result = await response.json();
      setResult({
        questions: result.questions,
        tags: result.tags,
        users: result.users,
      });
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleFocus = (e) => {
    const box = document.querySelector("#box-search");
    box.classList.toggle("focus");
  };

  return (
    <nav
      className="navbar navbar-expand-lg "
      style={{ backgroundColor: "#fff" }}
    >
      <div className="container-fluid d-flex">
        <a className="navbar-brand" href="/">
          <img className="free-sample-by-wix logo-left" alt="" src={logo} />
        </a>

        <div className="container-search">
          <div className="navbar">
            <div className="search">
              <input
                id="search-input"
                onFocus={handleFocus}
                className="search-input px-4"
                placeholder="Search"
                type="text"
                onChange={handleChange}
              />
            </div>
            <div id="box-search" className="box-search">
              {loading ? (
                <>
                  <div className="h-100 d-flex align-items-center justify-content-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <QuestionResult
                    questions={result.questions}
                    close={handleFocus}
                  />
                  <UsersResult users={result.users} close={handleFocus} />
                  <TagResult tags={result.tags} close={handleFocus} />
                </>
              )}
              <div
                className="close"
                style={{
                  position: "absolute",
                  right: "40px",
                  top: "10px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
                onClick={handleFocus}
              >
                x
              </div>
            </div>
          </div>
        </div>
        {isLogin ? (
          <div
            className="d-flex"
            style={{
              alignItems: "center",
            }}
          >
            <img
              className="profile"
              src={
                dataLogin.profile_picture && dataLogin.profile_picture
                  ? `${process.env.REACT_APP_API_HOST}/` +
                    dataLogin.profile_picture
                  : "https://atmos.ucla.edu/wp-content/themes/aos-child-theme/images/generic-avatar.png"
              }
              alt=""
              style={{
                marginRight: "20px",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() => setToggle((prevState) => !prevState)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="bg-white border z-3 hidden-lg"
                style={!toggle ? dropDownHide : dropDown}
              >
                <ul
                  className=""
                  style={{
                    listStyle: "none",
                    padding: "10px 60px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <li>
                    <Link
                      to={"/allquestion"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Questions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/users"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/tag"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Tag
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/saved"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Saved
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="container-user">
              <div
                className="d-flex"
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                }}
                onClick={() => setToggle((prevState) => !prevState)}
              >
                {/* <div className='dropdown'> */}
                <div className="dropdown nav-link">
                  {dataLogin.name ? dataLogin.name : ""}
                </div>
                {/* </div> */}

                <HiChevronDown size={30} />
              </div>

              <div
                className="bg-white border z-3"
                style={!toggle ? dropDownHide : dropDown}
              >
                <ul
                  className=""
                  style={{
                    listStyle: "none",
                    padding: "10px 60px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <li>
                    <Link
                      to={"/profile"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <p
                      style={{
                        textDecoration: "none",
                        color: "black",
                        cursor: "pointer",
                      }}
                      onClick={logout}
                    >
                      Log out
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={() => setToggle((prevState) => !prevState)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="bg-white border z-3 hidden-lg"
                style={!toggle ? dropDownHide : dropDown}
              >
                <ul
                  className=""
                  style={{
                    listStyle: "none",
                    padding: "10px 60px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <li>
                    <Link
                      to={"/"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Home
                    </Link>
                  </li>
                  <Link
                    to={"/allquestion"}
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                    onClick={() => setToggle((prevState) => !prevState)}
                  >
                    Questions
                  </Link>
                  <li></li>
                  <li>
                    <Link
                      to={"/tag"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      Tags
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/auth"}
                      style={{
                        textDecoration: "none",
                        color: "black",
                      }}
                      onClick={() => setToggle((prevState) => !prevState)}
                    >
                      <button className="btn btn-primary">Login</button>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <Link
              to={"/auth"}
              style={{
                textDecoration: "none",
                color: "black",
              }}
              className="login"
              onClick={() => setToggle((prevState) => !prevState)}
            >
              <button className="btn btn-primary">Login</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
