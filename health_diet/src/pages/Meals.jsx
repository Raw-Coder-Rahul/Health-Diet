import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import AddMeal from "../components/AddMeal";
import MealCard from "../components/cards/MealCard";
import NutrientChartCard from "../components/cards/NutrientChartCard";
import {
  fetchMealsByDate,
  createMeal,
  removeMeal,
} from "../redux/reducers/mealSlice";
import CircularProgress from "@mui/material/CircularProgress";

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
  background-color: ${({ active, theme }) =>
    active ? theme.primary : theme.bg_secondary};
  color: ${({ active, theme }) => (active ? "#fff" : theme.text_primary)};
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
  const dispatch = useDispatch();
  const { items: todayMeals, loading, error } = useSelector((state) => state.meals);

  const [type, setType] = useState("veg");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    dispatch(fetchMealsByDate(today));
  }, [dispatch]);

  // --- Handle add/delete ---
  const handleMealAdded = (mealData) => {
    dispatch(createMeal(mealData));
  };
  const handleMealDeleted = (mealId) => {
    dispatch(removeMeal(mealId));
  };

  // --- Filter meals by type ---
  const filteredMeals = todayMeals.filter((meal) => meal.type === type);

  // --- Aggregate nutrients dynamically for selected type ---
  const nutrientTotals = filteredMeals.reduce(
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

  const chartData = [
    { id: 0, value: nutrientTotals.calories, label: "Calories", color: "#F44336" },
    { id: 1, value: nutrientTotals.protein, label: "Protein", color: "#4CAF50" },
    { id: 2, value: nutrientTotals.fat, label: "Fat", color: "#FF9800" },
    { id: 3, value: nutrientTotals.vitamins, label: "Vitamins", color: "#2196F3" },
    { id: 4, value: nutrientTotals.carbs, label: "Carbs", color: "#9C27B0" },
  ];

  return (
    <Container>
      <Wrapper>
        {/* Left side: Add Meal */}
        <Left>
          <Title>Add Meal</Title>
          <AddMeal onMealAdded={handleMealAdded} />
        </Left>

        {/* Right side: Nutrients + Meals */}
        <Right>
          <Title>
            {type === "veg" ? "Veg Meal Nutrient Breakdown" : "Non-Veg Meal Nutrient Breakdown"}
          </Title>
          <Toggle>
            <ToggleButton active={type === "veg"} onClick={() => setType("veg")}>
              Veg
            </ToggleButton>
            <ToggleButton active={type === "nonveg"} onClick={() => setType("nonveg")}>
              Non-Veg
            </ToggleButton>
          </Toggle>

          {loading ? (
            <CircularProgress />
          ) : (
            <NutrientChartCard chartData={chartData} />
          )}

          <Title>Today's {type === "veg" ? "Veg" : "Non-Veg"} Meals</Title>
          <CardWrapper>
            {filteredMeals.length > 0 ? (
              filteredMeals.map((meal) => (
                <MealCard
                  key={meal._id}
                  meal={meal}
                  onMealDeleted={handleMealDeleted}
                />
              ))
            ) : (
              <p>No {type === "veg" ? "Veg" : "Non-Veg"} meals logged today.</p>
            )}
          </CardWrapper>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Meals;