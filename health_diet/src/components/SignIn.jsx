import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { userSignIn } from '../api';
import { loginSuccess } from '../redux/reducers/userSlice';

const Container = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 60px auto;
  padding: 32px;
  border-radius: 12px;
  background: ${({ theme }) => theme.card_background || '#fff'};
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 6px;
`;

const Span = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

function SignIn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setButtonDisabled(true);

    try {
      const res = await userSignIn({ email, password });
      dispatch(loginSuccess(res.data));
      alert("Login Success");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Welcome to Health&Diet</Title>
        <Span>Please login with your details below</Span>
      </Header>

      <TextInput
        label="Email Address"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        type="email"
      />
      <TextInput
        label="Password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        type="password"
      />

      <Button
        onClick={handleSignIn}
        isLoading={loading}
        isDisabled={buttonDisabled}
        text="Sign In"
      />
    </Container>
  );
}

export default SignIn;