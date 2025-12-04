import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  width: 280px;
  padding: 0;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg_secondary};
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow + 15};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const MealType = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
`;

const Item = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const MealCard = ({ type = 'veg' }) => {
  const imageUrl =
    type === 'veg'
      ? './public/images/220526_Meal-Without-Greens-banner-1.webp' // Correct path for public folder
      : '/images/non-veg.jpg';

  return (
    <Card>
      <Image
        src={imageUrl}
        alt={type === 'veg' ? 'Veg Meal' : 'Non-Veg Meal'}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/meal-placeholder.png';
        }}
      />
      <Content>
        <MealType>{type === 'veg' ? 'Veg Meal' : 'Non-Veg Meal'}</MealType>
        {type === 'veg' ? (
          <>
            <Item>- Paneer Bhurji (150g)</Item>
            <Item>- Brown Rice (1 cup)</Item>
            <Item>- Mixed Veg Curry</Item>
            <Item>- Calories: 520 kcal</Item>
          </>
        ) : (
          <>
            <Item>- Grilled Chicken (200g)</Item>
            <Item>- Boiled Eggs (2)</Item>
            <Item>- Steamed Broccoli</Item>
            <Item>- Calories: 680 kcal</Item>
          </>
        )}
      </Content>
    </Card>
  );
};

export default MealCard;