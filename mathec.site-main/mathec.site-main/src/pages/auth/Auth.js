import { useRef, useState } from "react";
import logoAuth from "../../images/logo.jpg";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function Auth() {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    password1: "",
  });
  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [messageErr, setMessageErr] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [success, setSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [hidePassword, setHidePassword] = useState({
    login: true,
    register: true,
    confirm: true,
  })
  const navigate = useNavigate();

  const register = async (name, email, password) => {
    if (registerForm.password !== registerForm.password1) {
      setPasswordMatch(false);
    } else {
      const response = await fetch(
        process.env.REACT_APP_API_HOST + "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const json = await response.json();

      console.log(json);
      if (json.succcess) {
        setSuccess(true);
        handlePanel();
      } else {
        setError(true);
      }
    }
  };

  const login = async (email, password) => {
    const response = await fetch(process.env.REACT_APP_API_HOST + "/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    console.log(json);
    console.log(response.status);
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      navigate("/");
    } else if (response.status === 403) {
      // setError(true);
      setMessageErr("Akun Anda Ditangguhkan");
    } else {
      // setError(true);
      setMessageErr("Email or password failed!");
    }
  
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();

    if (registerForm.password.length >= 8) {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password
      );
    } else {
      setMessageErr("Password must be at least 8 characters");
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginForm.password.length >= 8) {
      await login(loginForm.email, loginForm.password);
    } else {
      setMessageErr("Password must be at least 8 characters");
    }

  };

  const handlePanel = () => {
    const background = document.querySelector(".container-auth");
    background.classList.toggle("left-overlay-active");
    setRegisterForm({
      name: "",
      email: "",
      password: "",
      password1: "",
    });
    setloginForm({
      email: "",
      password: "",
    });
    setSuccess(false);
    setError(false);
    setPasswordMatch(true);
  };

  const handleInputRegister = (event) => {
    setRegisterForm((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleInputLogin = (event) => {
    setloginForm((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };
  const sidebar = useRef(null);

  const openSidebar = () => {
    sidebar.current.classList.toggle("active");
  };

  const handleHidePassword = (field) => {
    setHidePassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  return (
    <div className="content-auth">
      <div className="header">
        <div className="burger" onClick={openSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="background-blur" ref={sidebar}>
        <div className="sidebar">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/allquestion"}>Question</Link>
            </li>
            <li>
              <Link to={"/tag"}>Tags</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-auth">
        {/* auth */}
        <div className="container-form">
          <div className="form">
            <div className="signIn">
              <h2 className="mt-1">Login</h2>
              {messageErr === "Your account is blocked!" ? (
                <div className="alert alert-danger">{messageErr}</div>
              ) : messageErr === "Email or password failed!" ? (
                <div className="alert alert-danger">
                  Email or password failed!
                </div>
              ) : (
                ""
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    onChange={handleInputLogin}
                    placeholder="Input your email"
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Password</label>
                  <div className="password">
                    <div className="input-password">
                      <input
                        name="password"
                        type={hidePassword.login ? "password" : "text"}
                        onChange={handleInputLogin}
                        placeholder="Input your password"
                        className="form-control"
                      />
                      {hidePassword.login ? (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleHidePassword("login")} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-1 icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleHidePassword("login")} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </div>
                    {loginForm.password && loginForm.password.length < 8 && (
                      <p className="password-note"><span>*</span> Password must be at least 8 characters</p>
                    )}
                  </div>
                </div>
                <button className="btn btn-success mt-3 mb-2 w-100">
                  Login
                </button>
                <span>
                  Dont have an account?{" "}
                  <span
                    style={{
                      color: "rgb(13, 110, 253)",
                      cursor: "pointer",
                    }}
                    onClick={handlePanel}
                  >
                    Register
                  </span>
                </span>
                <br />
                <span>
                  Forgot Password?{" "}
                  <span
                    style={{
                      color: "rgb(13, 110, 253)",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot
                  </span>
                </span>
              </form>
            </div>
            <div className="signUp">
              {error === true ? (
                <div className="alert alert-danger">Email is forbiden</div>
              ) : (
                ""
              )}

              {passwordMatch === false ? (
                <div className="alert alert-danger">Password faied!</div>
              ) : (
                ""
              )}
              {error === true ? (
                <div className="alert alert-danger">This Email Is Forbiden</div>
              ) : (
                ""
              )}
              <h2>Register</h2>
              <form onSubmit={handleSubmitRegister}>
                <div className="form-group mb-3">
                  <label>Username</label>
                  <input
                    className="form-control"
                    name="name"
                    onChange={handleInputRegister}
                    type="name"
                    placeholder="Input your username"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    className="form-control"
                    name="email"
                    onChange={handleInputRegister}
                    type="email"
                    placeholder="Input your email"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Password</label>
                  <div className="password">
                    <div className="input-password">
                      <input
                        className="form-control"
                        name="password"
                        onChange={handleInputRegister}
                        type={hidePassword.register ? "password" : "text"}
                        placeholder="Input your password"
                        min={8}
                      />

                      {hidePassword.register ? (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleHidePassword("register")} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-1 icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleHidePassword("register")} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </div>
                    {registerForm.password && registerForm.password.length < 8 && (
                      <p className="password-note"><span>*</span> Password must be at least 8 characters</p>
                    )}
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>Confirm Password</label>
                  <div className="password">
                    <div className="input-password">
                      <input
                        className="form-control"
                        name="password1"
                        onChange={handleInputRegister}
                        type={hidePassword.confirm ? "password" : "text"}
                        placeholder="Input your password"
                        min={8}
                      />

                      {hidePassword.confirm ? (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleHidePassword("confirm")} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-1 icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleHidePassword("confirm")} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 icon">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      )}
                    </div>
                    {registerForm.password1 && registerForm.password1 !== registerForm.password ? (
                      <p className="password-note"><span>*</span> Please enter your password again</p>
                    ) : registerForm.password1 && registerForm.password1 === registerForm.password && (
                      <p className="correct"><span>*</span> Password match</p>
                    )}
                  </div>
                </div>
                <button className="btn btn-success mt-3 mb-2 d-block w-100">
                  Register
                </button>
                <span className="">
                  {" "}
                  Already have an account?{" "}
                  <span
                    style={{
                      color: "rgb(13, 110, 253)",
                      cursor: "pointer",
                    }}
                    onClick={handlePanel}
                  >
                    Login
                  </span>
                </span>
              </form>
            </div>
          </div>
        </div>
        {/* overlay */}
        <div className="overlay">
          <div className="overlay-content">
            <div className="overlay-left">
              <center>
                <img src={logoAuth} alt="" />
              </center>
              <p className="text-center">
                Increase the quality and quantity of discussions with FMIKOM
                UNUGHA CILACAP: Together we learn, develop, share in the fields
                of Mathematics and Technology
              </p>
            </div>
            <div className="overlay-right">
              <center>
                <img src={logoAuth} alt="" />
              </center>
              <p className="text-center">
                Increase the quality and quantity of discussions with FMIKOM
                UNUGHA CILACAP: Together we learn, develop, share in the fields
                of Mathematics and Technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
