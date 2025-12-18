import React from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Card = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 8px;
  display: flex;
  gap: 6px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow + 15};
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const AddWorkout = ({ workout, setWorkout }) => {
  const handleAddWorkout = async () => {
    try {
      const res = await axios.post('/api/workouts/add', { workoutString: workout });
      toast.success('Workout Added!');
      setWorkout(""); // clear input
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error adding workout');
    }
  };

  return (
    <Card>
      <Title>Add New Workout</Title>
      <TextInput
        label="Workout"
        textArea
        rows={10}
        placeholder={`Enter workout details. Format:
#Category
Workout Name
Duration (min)
Sets
Reps
Weight (kg)`}
        value={workout}
        handleChange={(e) => setWorkout(e.target.value)}
      />
      <Button primary onClick={handleAddWorkout} text="Add Workout" small />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </Card>
  );
};

export default AddWorkout;