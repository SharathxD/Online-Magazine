import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage'; // Correct import path
import AdminPage from './components/AdminPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import Modal from './components/Modal';
import UserContent from './components/UserContent';

const App = () => {
  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Router>
      {modalVisible && <Modal onClose={closeModal} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/usercontent" element={<UserContent/>}/>
      </Routes>
    </Router>
  );
};

export default App;
