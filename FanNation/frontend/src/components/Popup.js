import React from 'react';

const Popup = ({ showPopup, isSignup, children, onClose }) => {
  return (
    <>
      <div className="blur-bg-overlay" onClick={onClose}></div>
      <div className={`form-popup ${showPopup ? 'show-popup' : ''} ${isSignup ? 'show-signup' : ''}`}>
        <span className="close-btn material-symbols-rounded" onClick={onClose}>close</span>
        {children}
      </div>
    </>
  );
};

export default Popup;