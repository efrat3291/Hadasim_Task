import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Enterance = () => {
  
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // פונקציה לבדיקת נכונות סיסמה
  const handleAdminLogin = () => {
    const correctPassword = '1234'; 
    if (password === correctPassword) {
      navigate('/manager-dashboard'); 
      setError('סיסמה לא נכונה');
    }
  };

  const handleSupplierLogin = () => {
    navigate('/login'); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>ברוך הבא למערכת</h1>
      
      {/* כפתור כניסת המנהל עם טופס סיסמה */}
      <button
        onClick={handleAdminLogin}
        style={{ padding: '10px 20px', marginBottom: '20px', fontSize: '16px' }}
      >
        כניסת מנהל
      </button>
      <input
        type="password"
        placeholder="הכנס סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', fontSize: '16px', width: '200px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* כפתור כניסת ספק */}
      <button
        onClick={handleSupplierLogin}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        כניסת ספק
      </button>
    </div>
  );
};

export default Enterance;
