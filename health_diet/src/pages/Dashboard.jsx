import React, { useEffect, useState } from "react";
import styled from "styled-components";
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
import { getWorkoutStats, getWorkoutsByDate } from "../api";

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
  const [meal, setMeal] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [stats, setStats] = useState(null);
  const [todayWorkouts, setTodayWorkouts] = useState([]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await getWorkoutStats();
      setStats(res.data?.stats || null);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchTodayWorkouts = async () => {
    try {
      setLoadingWorkouts(true);
      const today = new Date().toISOString().split("T")[0];
      const res = await getWorkoutsByDate(today);
      setTodayWorkouts(res.data?.todayWorkouts || []);
    } catch (err) {
      console.error("Error fetching today's workouts:", err);
    } finally {
      setLoadingWorkouts(false);
    }
  };

  const refreshDashboard = async () => {
    await Promise.all([fetchStats(), fetchTodayWorkouts()]);
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>

        {loadingStats || loadingWorkouts ? (
          <CircularProgress />
        ) : (
          <>
            {/* Counts cards */}
            <FlexWrap>
              {counts.map((item, idx) => (
                <CountsCard key={idx} item={item} data={stats} />
              ))}
            </FlexWrap>

            {/* Weekly bar chart + Category pie chart */}
            <FlexWrap>
              {stats?.weekly && <WeeklyStatsCard data={stats.weekly} />}
              {stats?.pieChartData && <CategoryChartCard data={stats} />}
            </FlexWrap>

            {/* Add workout form */}
            <FlexWrap>
              <AddWorkout onWorkoutAdded={refreshDashboard} />
            </FlexWrap>

            {/* Today's workouts list */}
            <Section>
              <Title>Today's Workouts</Title>
              <CardWrapper>
                {todayWorkouts.length > 0 ? (
                  todayWorkouts.map((w) => (
                    <WorkoutCard key={w._id} workout={w} />
                  ))
                ) : (
                  <p>No workouts logged today.</p>
                )}
              </CardWrapper>
            </Section>

            {/* Add meal form */}
            <FlexWrap>
              <AddMeal meal={meal} setMeal={setMeal} />
            </FlexWrap>

            {/* Nutrient charts */}
            <FlexWrap>
              <NutrientChartCard
                title="Veg Meal Nutrient Breakdown"
                chartData={[
                  { id: 0, value: 60, label: "Protein" },
                  { id: 1, value: 30, label: "Fat" },
                  { id: 2, value: 40, label: "Vitamin" },
                  { id: 3, value: 20, label: "Glucose" },
                ]}
              />
              <NutrientChartCard
                title="Non-Veg Meal Nutrient Breakdown"
                chartData={[
                  { id: 0, value: 90, label: "Protein" },
                  { id: 1, value: 50, label: "Fat" },
                  { id: 2, value: 25, label: "Vitamin" },
                  { id: 3, value: 35, label: "Glucose" },
                ]}
              />
            </FlexWrap>

            {/* Today's meals */}
            <Section>
              <Title>Today's Meals</Title>
              <CardWrapper>
                <MealCard type="veg" />
                <MealCard type="nonveg" />
              </CardWrapper>
            </Section>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Dashboard;