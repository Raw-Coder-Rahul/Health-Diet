import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { counts } from "../utills/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatsCard from "../components/cards/WeeklyStatsCard";
import CategoryChartCard from "../components/cards/CategoryChartCard";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import AddMeal from "../components/AddMeal";
import MealCard from "../components/cards/MealCard";
import NutrientChartCard from "../components/cards/NutrientChartCard";
import CircularProgress from "@mui/material/CircularProgress";
import {
  fetchMealsByDate,
  createMeal,
  removeMeal,
} from "../redux/reducers/mealSlice";
import {
  fetchWorkoutStats,
  fetchWorkoutsByDate,
  createWorkout,
  removeWorkout,
} from "../redux/reducers/workoutSlice";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: auto;
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
`;

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    items: todayMeals,
    loading: loadingMeals,
    error: mealError,
  } = useSelector((state) => state.meals);

  const {
    stats,
    items: todayWorkouts,
    loading: loadingWorkouts,
    error: workoutError,
  } = useSelector((state) => state.workouts);

  const refreshDashboard = () => {
    const today = new Date().toISOString().split("T")[0];
    dispatch(fetchWorkoutStats());
    dispatch(fetchWorkoutsByDate(today));
    dispatch(fetchMealsByDate(today));
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handleMealAdded = (mealData) => dispatch(createMeal(mealData));
  const handleMealDeleted = (mealId) => dispatch(removeMeal(mealId));
  const handleWorkoutAdded = (workoutData) => dispatch(createWorkout(workoutData));
  const handleWorkoutDeleted = (workoutId) => dispatch(removeWorkout(workoutId));

  const nutrientTotals = todayMeals.reduce(
    (acc, meal) => {
      acc.calories += Number(meal.calories) || 0;
      acc.protein += Number(meal.protein) || 0;
      acc.fat += Number(meal.fat) || 0;
      acc.vitamins += Number(meal.vitamins) || 0;
      acc.carbs += Number(meal.carbs) || 0;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, vitamins: 0, carbs: 0 }
  );

  const loading = loadingMeals || loadingWorkouts;

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>

        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <FlexWrap>
              {counts.map((item) => (
                <CountsCard key={item.id || item.label} item={item} data={stats} />
              ))}
            </FlexWrap>

            <FlexWrap>
              {stats?.weekly && <WeeklyStatsCard data={stats.weekly} />}
              {stats?.pieChartData && <CategoryChartCard data={stats} />}
            </FlexWrap>

            <FlexWrap>
              <AddWorkout onWorkoutAdded={handleWorkoutAdded} />
            </FlexWrap>

            <Section>
              <Title>Today's Workouts</Title>
              <CardWrapper>
                {todayWorkouts.length > 0 ? (
                  todayWorkouts.map((w) => (
                    <WorkoutCard
                      key={w._id}
                      workout={w}
                      onWorkoutDeleted={handleWorkoutDeleted}
                    />
                  ))
                ) : (
                  <p>No workouts logged today.</p>
                )}
              </CardWrapper>
              {workoutError && (
                <p style={{ color: "red" }}>
                  Error: {workoutError.message || workoutError}
                </p>
              )}
            </Section>

            <FlexWrap>
              <AddMeal onMealAdded={handleMealAdded} />
            </FlexWrap>

            <FlexWrap>
              <NutrientChartCard
                title="Today's Nutrient Breakdown"
                chartData={[
                  { id: 0, value: nutrientTotals.calories, label: "Calories", color: "#F44336" },
                  { id: 1, value: nutrientTotals.protein, label: "Protein", color: "#4CAF50" },
                  { id: 2, value: nutrientTotals.fat, label: "Fat", color: "#FF9800" },
                  { id: 3, value: nutrientTotals.vitamins, label: "Vitamins", color: "#2196F3" },
                  { id: 4, value: nutrientTotals.carbs, label: "Carbs", color: "#9C27B0" },
                ]}
              />
            </FlexWrap>

            <Section>
              <Title>Today's Meals</Title>
              <CardWrapper>
                {todayMeals.length > 0 ? (
                  todayMeals.map((meal) => (
                    <MealCard
                      key={meal._id}
                      meal={meal}
                      onMealDeleted={handleMealDeleted}
                    />
                  ))
                ) : (
                  <p>No meals logged today.</p>
                )}
              </CardWrapper>
              {mealError && (
                <p style={{ color: "red" }}>
                  Error: {mealError.message || mealError}
                </p>
              )}
            </Section>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Dashboard;