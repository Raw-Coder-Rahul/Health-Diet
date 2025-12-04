import React, { useState } from 'react';
import styled from 'styled-components';
import AddMeal from '../components/AddMeal';
import MealCard from '../components/cards/MealCard';
import NutrientChartCard from '../components/cards/NutrientChartCard';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 840px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Left = styled.div`
  flex: 0.35;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  padding-left: 8px;
  @media (max-width: 840px) {
    font-size: 18px;
  }
`;

const Toggle = styled.div`
  display: flex;
  gap: 12px;
  padding-left: 8px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: ${({ active, theme }) => (active ? theme.primary : theme.bg_secondary)};
  color: ${({ active, theme }) => (active ? '#fff' : theme.text_primary)};
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 60px;
  @media (max-width: 840px) {
    gap: 12px;
  }
`;

const Meals = () => {
  const [meal, setMeal] = useState('');
  const [type, setType] = useState('veg');

  const nutrientData = {
    veg: [
      { id: 0, value: 60, label: 'Protein' },
      { id: 1, value: 30, label: 'Fat' },
      { id: 2, value: 40, label: 'Vitamin' },
      { id: 3, value: 20, label: 'Glucose' },
    ],
    nonveg: [
      { id: 0, value: 90, label: 'Protein' },
      { id: 1, value: 50, label: 'Fat' },
      { id: 2, value: 25, label: 'Vitamin' },
      { id: 3, value: 35, label: 'Glucose' },
    ],
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Add Meal</Title>
          <AddMeal meal={meal} setMeal={setMeal} />
        </Left>
        <Right>
          <Title>{type === 'veg' ? 'Veg Meal Nutrient Breakdown' : 'Non-Veg Meal Nutrient Breakdown'}</Title>
          <Toggle>
            <ToggleButton active={type === 'veg'} onClick={() => setType('veg')}>Veg</ToggleButton>
            <ToggleButton active={type === 'nonveg'} onClick={() => setType('nonveg')}>Non-Veg</ToggleButton>
          </Toggle>
          <NutrientChartCard chartData={nutrientData[type]} />
          <Title>Today's Meals</Title>
          <CardWrapper>
            <MealCard type="veg" />
            <MealCard type="nonveg" />
            <MealCard type="veg" />
          </CardWrapper>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Meals;