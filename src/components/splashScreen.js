import React, { useEffect, useState } from 'react';
import '../styles/splashscreen.css';
import logo from '../assets/logo.png';

function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // show for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="splash">
      <img src={logo} alt="logo" className="logo" />
      <h1>MPeoples</h1>
    </div>
  );
}

export default SplashScreen;
