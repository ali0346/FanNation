import React from 'react';

const SignupForm = ({ signupData, setSignupData, handleSignupSubmit, error, onLoginClick }) => {
  return (
    <div className="form-box signup">
      <div className="form-details">
        <h2>Create Account</h2>
        <p>Join FanNation and connect with fans of all sports.</p>
      </div>
      <div className="form-content">
        <h2>SIGNUP</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignupSubmit}>
          <div className="input-field">
            <input
              type="text"
              name="username"
              value={signupData.username}
              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
              required
            />
            <label>Username</label>
          </div>
          <div className="input-field">
            <input
              type="text"
              name="email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              required
            />
            <label>Email</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              required
            />
            <label>Password</label>
          </div>
          <div className="policy-text">
            <input type="checkbox" id="policy" required />
            <label htmlFor="policy">
              I agree to the{' '}
              <a href="/#" className="option">Terms & Conditions</a>
            </label>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <div className="bottom-link">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={onLoginClick}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;