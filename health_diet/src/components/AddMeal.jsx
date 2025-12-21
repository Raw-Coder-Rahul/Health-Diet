import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { createMeal } from "../redux/reducers/mealSlice";

const Card = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 8px;
  display: flex;
  gap: 12px;
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

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.text_secondary + 30};
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bg_secondary};
`;

const AddMeal = ({ onMealAdded }) => {
  const dispatch = useDispatch();

  const [mealType, setMealType] = useState("veg");
  const [foodItem, setFoodItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [vitamins, setVitamins] = useState("");
  const [carbs, setCarbs] = useState("");

  const handleSubmit = async () => {
    if (!foodItem || !quantity || !calories) {
      toast.error("Please fill all required fields (Food Item, Quantity, Calories)");
      return;
    }

    const newMeal = {
      type: mealType,
      foodItem,
      quantity,
      calories: Number(calories),
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
      vitamins: Number(vitamins) || 0,
      carbs: Number(carbs) || 0,
    };

    try {
      const resultAction = await dispatch(createMeal(newMeal));
      if (createMeal.fulfilled.match(resultAction)) {
        toast.success("Meal added successfully!");
        if (onMealAdded) onMealAdded(resultAction.payload);

        // Reset form
        setFoodItem("");
        setQuantity("");
        setCalories("");
        setProtein("");
        setFat("");
        setVitamins("");
        setCarbs("");
        setMealType("veg");
      } else {
        toast.error(resultAction.payload || "Failed to add meal");
      }
    } catch (err) {
      console.error("Error adding meal:", err);
      toast.error("Failed to add meal");
    }
  };

  return (
    <Card>
      <Title>Add New Meal</Title>

      <Select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option value="veg">Veg</option>
        <option value="nonveg">Non-Veg</option>
      </Select>

      <TextInput label="Food Item" value={foodItem} handleChange={(e) => setFoodItem(e.target.value)} />
      <TextInput label="Quantity" value={quantity} handleChange={(e) => setQuantity(e.target.value)} />
      <TextInput label="Calories" value={calories} handleChange={(e) => setCalories(e.target.value)} />
      <TextInput label="Protein (g)" value={protein} handleChange={(e) => setProtein(e.target.value)} />
      <TextInput label="Fat (g)" value={fat} handleChange={(e) => setFat(e.target.value)} />
      <TextInput label="Vitamins (mg)" value={vitamins} handleChange={(e) => setVitamins(e.target.value)} />
      <TextInput label="Carbs (g)" value={carbs} handleChange={(e) => setCarbs(e.target.value)} />

      <Button primary onClick={handleSubmit} text="Add Meal" small />
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </Card>
  );
};

export default AddMeal;