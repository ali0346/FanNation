import React from 'react';

const LoginForm = ({ loginData, setLoginData, handleLoginSubmit, error, onSignupClick }) => {
  return (
    <div className="form-box login">
      <div className="form-details">
        <h2>Welcome Back</h2>
        <p>Please log in with your credentials to connect with fellow sports fans.</p>
      </div>
      <div className="form-content">
        <h2>LOGIN</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLoginSubmit}>
          <div className="input-field">
            <input
              type="text"
              name="email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            <label>Password</label>
          </div>
          <a href="/#" className="forgot-pass-link">Forgot password?</a>
          <button type="submit">Log In</button>
        </form>
        <div className="bottom-link">
          Don't have an account?{' '}
          <button type="button" className="link-button" onClick={onSignupClick}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;