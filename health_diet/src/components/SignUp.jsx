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
  gap: 24px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
`;

function SignUp() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: ''
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/users/register',
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          age: form.age
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('User registered successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering user');
    }
  };

  return (
    <Container>
      <Title>Sign Up</Title>
      <Span>Create your account</Span>

      <input
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Full Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm Password"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        placeholder="Age (optional)"
      />

      <Button onClick={handleSubmit}>Sign Up</Button>
    </Container>
  );
}

export default SignUp;