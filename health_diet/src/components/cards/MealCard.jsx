import React from "react";
import styled from "styled-components";
import Button from "../Button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { removeMeal } from "../../redux/reducers/mealSlice";

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

const MacroSummary = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin-top: 6px;
  padding: 6px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.bg_primary + 30};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const MealCard = ({ meal }) => {
  const dispatch = useDispatch();

  if (!meal) return null;

  const imageUrl = meal?.type === "veg" ? "/images/veg.jpg" : "/images/non-veg.jpg";

  const handleDelete = async () => {
    const mealId = meal?._id || meal?.id;
    if (!mealId) {
      toast.error("Meal ID missing, cannot delete");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this meal?")) {
      return;
    }

    try {
      await dispatch(removeMeal(mealId));
      toast.success("Meal deleted!");
    } catch (err) {
      console.error("Error deleting meal:", err);
      toast.error("Failed to delete meal");
    }
  };

  return (
    <Card>
      <Image
        src={imageUrl}
        alt={meal?.type === "veg" ? "Veg Meal" : "Non-Veg Meal"}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/meal-placeholder.png";
        }}
      />
      <Content>
        <MealType>{meal?.type === "veg" ? "Veg Meal" : "Non-Veg Meal"}</MealType>

        {meal?.foodItem && <Item>Food: {meal.foodItem}</Item>}
        {meal?.quantity && <Item>Quantity: {meal.quantity}</Item>}
        {meal?.calories && <Item>Calories: {meal.calories} kcal</Item>}
        {meal?.protein !== undefined && <Item>Protein: {meal.protein} g</Item>}
        {meal?.fat !== undefined && <Item>Fat: {meal.fat} g</Item>}
        {meal?.vitamins !== undefined && <Item>Vitamins: {meal.vitamins} mg</Item>}
        {meal?.carbs !== undefined && <Item> Carbs: {meal.carbs} g</Item>}
        {meal?.date && (
          <Item>Date: {new Date(meal.date).toLocaleDateString()}</Item>
        )}

        <MacroSummary>
          Macros → P: {meal?.protein || 0}g / F: {meal?.fat || 0}g / C: {meal?.carbs || 0}g
        </MacroSummary>

        <Footer>
          <Button text="Delete" small onClick={handleDelete} />
        </Footer>
      </Content>
    </Card>
  );
};

export default MealCard;