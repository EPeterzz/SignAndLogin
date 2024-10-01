import React, { useState } from 'react';
import axios from "axios";
import './App.css';

const SERVER_URL = process.env.REACT_APP_API_URL;

const signupUser = async (userId, password, email) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/user/signup`, {
      userId,
      password,
      email,
    });
    if (response.status === 200) {
      alert('Welcome! You can now log in.'); 
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('User ID is already in use.'); 
    } else {
      alert('Failed to sign up: ' + (error.response ? error.response.data : error.message));
    }
  }
};

const loginUser = async (userId, password) => {
  try {
    const response = await axios.post(`${SERVER_URL}/api/user/login`, {
      userId,
      password,
    });
    return response; // return the response for further processing
  } catch (error) {
    throw error; // throw the error to handle it in the calling function
  }
};

const App = () => {
  const [isSignUp, setIsSignUp] = useState(true); 

  // state for signup
  const [signupUserId, setSignupUserId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  // state for login
  const [loginUserId, setLoginUserId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginCount, setLoginCount] = useState(0); // counted for successful login

  // password validation
  const validPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  // handle signup form
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validPassword(signupPassword)) {
      alert("Password must be at least 8 characters, including one capital letter and one symbol.");
      return;
    }

    await signupUser(signupUserId, signupPassword, signupEmail);
  };

  // Handle Login Form Submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginUserId, loginPassword);
      if (response.status === 200) {
        setLoginCount(prevCount => prevCount + 1); // increment the #login count
        alert(`Login successful, user ID: ${loginCount + 1}`); // show
      }
    } catch (error) {
      alert('Login failed: ' + (error.response ? error.response.data : error.message));
    }
  };

  return (
    <div className="authContainer">
      <div className="authToggle">
        <button onClick={() => setIsSignUp(true)}>Sign Up</button>
        <button onClick={() => setIsSignUp(false)}>Log In</button>
      </div>

      <div className="totalForm">
        {isSignUp ? (
          <form id="signupForm" className="authForm" onSubmit={handleSignup}>
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="UserId"
              value={signupUserId}
              onChange={(e) => setSignupUserId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        ) : (
          <form id="loginForm" className="authForm" onSubmit={handleLogin}>
            <h2>Log In</h2>
            <input
              type="text"
              placeholder="UserId"
              value={loginUserId}
              onChange={(e) => setLoginUserId(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button type="submit">Log In</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;