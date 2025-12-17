// Example: SignUp.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

function SignUp() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/users/register', form);
      alert("User registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div>
      <input name="fullName" onChange={handleChange} placeholder="Full Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm Password" />
      <button onClick={handleSubmit}>Sign Up</button>
    </div>
  );
}

export default SignUp;