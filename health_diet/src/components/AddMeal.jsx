// components/AddMeal.jsx
import React from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const AddMeal = ({ meal, setMeal }) => {
  return (
    <Card>
      <Title>Add New Meal</Title>
      <TextInput
        label="Meal"
        textArea
        rows={10}
        placeholder={`Enter meal details. Format:\n#Meal Type (Breakfast/Lunch/Dinner/Snack)\n- Food Item\n- Quantity\n- Calories`}
        value={meal}
        handleChange={(e) => setMeal(e.target.value)}
      />
      <Button
        primary
        onClick={() => toast.success('Meal Added!')}
        text="Add Meal"
        small
      />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </Card>
  );
};

export default AddMeal;