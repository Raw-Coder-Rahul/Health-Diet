import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import { getUserProfile, updateUserProfile } from '../api';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { toast } from 'react-toastify';

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 24px;
`;

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setUser(res.data);
      setForm({ name: res.data.name || '', email: res.data.email || '' });
    } catch (err) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateUserProfile(form);
      toast.success("Profile updated!");
      fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Wrapper>
        <Title>User Profile</Title>

        {user?.profileImage && <ProfileImage src={user.profileImage} alt="Profile" />}

        <TextInput
          label="Name"
          value={form.name}
          name="name"
          handleChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <TextInput
          label="Email"
          value={form.email}
          name="email"
          handleChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Button
          primary
          onClick={handleUpdate}
          text={loading ? "Updating..." : "Update Profile"}
          disabled={loading}
        />
      </Wrapper>
    </Container>
  );
};

export default Profile;