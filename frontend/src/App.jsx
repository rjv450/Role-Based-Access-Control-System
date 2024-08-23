import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
