import React, { useState } from 'react';
import Logo from './assets/img/logo.png';
import Scanner from './components/Scan';
import './App.css';

function App() {
  const [showScanner, setShowScanner] = useState(false);

  const handleButtonClick = () => {
    setShowScanner(true);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="app-container">
      <div className="main-container">
        {!showScanner ? (
          <div className="welcome-container">
            <h1 className="title">Welcome to Ticket Scanner!</h1>
            <img src={Logo} alt="logo" className="logo" />
            <button className="button" onClick={handleButtonClick}>
              Click me
            </button>
            <p className="footer-text">
              &copy; {currentYear} JanjianAja. All rights reserved.
            </p>
          </div>
        ) : (
          <Scanner onClose={handleCloseScanner} />
        )}
      </div>
    </div>
  );
}

export default App;
