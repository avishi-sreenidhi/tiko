import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './AppContent';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  return (
    <Router>
      <AppContent token={token} setToken={setToken} user={user} setUser={setUser} />
    </Router>
  );
}

export default App;