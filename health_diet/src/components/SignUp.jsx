import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { userSignup } from '../api';
import { loginSuccess } from '../redux/reducers/userSlice';

const Wrapper = styled.div`
  min-height: 90vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 24px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  border-radius: 16px;
  background: ${({ theme }) => theme.card_background || '#fff'};
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  margin: auto;

  max-height: 90vh;
  overflow-y: auto;
  
  @media screen and (max-width: 600px) {
    padding: 24px;
    gap: 18px;
    max-width: 95%;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  margin-bottom: 10px;

  @media screen and (max-width: 600px) {
    font-size: 24px;
  }
`;

const Span = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  margin-bottom: 24px;

  @media screen and (max-width: 600px) {
    font-size: 14px;
    margin-bottom: 18px;
  }
`;

const FileInput = styled.input`
  padding: 14px;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.border || '#d1d5db'};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.input_background || '#f9fafb'};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }

  @media screen and (max-width: 600px) {
    font-size: 14px;
    padding: 12px;
  }
`;

function SignUp() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    profileImage: null
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setForm({ ...form, profileImage: e.target.files[0] });

  const handleSubmit = async () => {
    if (!form.fullName || !form.email || !form.password) {
      alert('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    setButtonDisabled(true);

    try {
      const data = new FormData();
      data.append("fullName", form.fullName);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("age", form.age);
      if (form.profileImage) {
        data.append("profileImage", form.profileImage);
      }

      const res = await userSignup(data);
      dispatch(loginSuccess(res.data));

      if (res.data.token) {
        localStorage.setItem("health&Diet_token", res.data.token);
      }

      alert("User registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error registering user");
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <Title>Sign Up</Title>
        <Span>Create your account</Span>

        <TextInput
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          label="Full Name"
        />
        <TextInput
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          label="Email"
          type="email"
        />
        <TextInput
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          label="Password"
        />
        <TextInput
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          label="Confirm Password"
        />
        <TextInput
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age (optional)"
          label="Age"
          type="number"
        />

        <FileInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        <Button
          onClick={handleSubmit}
          text={loading ? "Signing Up..." : "Sign Up"}
          fullWidth
          disabled={buttonDisabled}
        />
      </Container>
    </Wrapper>
  );
}

export default SignUp;