import React, { useState } from 'react';
import styled from 'styled-components';
import { counts } from '../utills/data';
import CountsCard from '../components/cards/CountsCard';
import WeeklyStatsCard from '../components/cards/WeeklyStatsCard';
import CategoryChartCard from '../components/cards/CategoryChartCard';
import AddWorkout from '../components/AddWorkout';
import WorkoutCard from '../components/cards/WorkoutCard';
import AddMeal from '../components/AddMeal';
import MealCard from '../components/cards/MealCard';
import NutrientChartCard from '../components/cards/NutrientChartCard';
import SignUp from '../components/SignUp';

const Container = styled.div`
  flex: 1;
  height : 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 620px) {
    flex-direction: column;
    gap: 10px;
  }
`;
const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  padding-left: 16px;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 0px 16px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 840px) {
    gap: 12px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  gap: 20px;
`;

const Dashboard = () => {
  const [workout, setWorkout] = useState('');
  const [meal, setMeal] = useState('');
  const data = {
    totalCaloriesBurned: 13500,
    totalWorkouts: 6,
    avgCaloriesBurnedPerWorkout: 2250,
    totalWeeksCaloriesBurned: {
      weeks: ["17th", "18th", "19th", "20th", "21st", "22nd", "23rd"],
      caloriesBurned: [10500, 0, 15000, 12000, 18000, 9000, 13500],
    },
    pieChartData: [
      {
        id: 0,
        "value": 6000,
        "label": "Legs"
      },
      {
        id: 1,
        "value": 4500,
        "label": "Back"
      },
      {
        id: 2,
        "value": 3000,
        "label": "Arms"
      },
      {
        id: 3,
        "value": 1500,
        "label": "Chest"
      },
      {
        id: 4,
        "value": 1500,
        "label": "Shoulders"
      }
    ]
  };
  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        <FlexWrap>
          {counts.map((item) => (
            <CountsCard item={item} data={data} />
          ))}
        </FlexWrap>
        <FlexWrap>
          <WeeklyStatsCard data={data} />
          <CategoryChartCard data={data} />
        </FlexWrap>
        <FlexWrap>
          <AddWorkout workout={workout} setWorkout={setWorkout} />
        </FlexWrap>
        <Section>
          <Title>Todays Workouts</Title>
          <CardWrapper>
            {/* Workout cards can be added here */}
            <WorkoutCard />
            <WorkoutCard />
            <WorkoutCard />
            <WorkoutCard />
          </CardWrapper>
        </Section>
        <FlexWrap>
          <AddMeal meal={meal} setMeal={setMeal} />
        </FlexWrap>
        <FlexWrap>
            <NutrientChartCard
              title="Veg Meal Nutrient Breakdown"
              chartData={[
                { id: 0, value: 60, label: 'Protein' },
                { id: 1, value: 30, label: 'Fat' },
                { id: 2, value: 40, label: 'Vitamin' },
                { id: 3, value: 20, label: 'Glucose' },
              ]}
            />
            <NutrientChartCard
              title="Non-Veg Meal Nutrient Breakdown"
              chartData={[
                { id: 0, value: 90, label: 'Protein' },
                { id: 1, value: 50, label: 'Fat' },
                { id: 2, value: 25, label: 'Vitamin' },
                { id: 3, value: 35, label: 'Glucose' },
              ]}
            />
          </FlexWrap>
        <Section>
          <Title>Today's Meals</Title>
          <CardWrapper>
            <MealCard type="veg" />
            <MealCard type="nonveg" />
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  )
}

export default Dashboard;