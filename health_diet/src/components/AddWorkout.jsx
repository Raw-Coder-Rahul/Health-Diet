import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { toast } from "react-toastify";
import { addWorkout } from "../api";
import { useDispatch } from "react-redux";
import { addWorkoutSuccess } from "../redux/reducers/workoutSlice";

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

const AddWorkout = ({ onWorkoutAdded }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "",
    workoutName: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    caloriesBurned: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = async () => {
    const { category, workoutName } = form;
    if (!category.trim() || !workoutName.trim()) {
      toast.error("Category and Workout Name are required.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await addWorkout({
        category: category.trim(),
        workoutName: workoutName.trim(),
        sets: form.sets ? Number(form.sets) : undefined,
        reps: form.reps ? Number(form.reps) : undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        duration: form.duration ? Number(form.duration) : undefined,
        caloriesBurned: form.caloriesBurned
          ? Number(form.caloriesBurned)
          : undefined,
      });

      dispatch(addWorkoutSuccess(data));

      toast.success("Workout Added!");
      setForm({
        category: "",
        workoutName: "",
        sets: "",
        reps: "",
        weight: "",
        duration: "",
        caloriesBurned: "",
      });

      if (onWorkoutAdded) onWorkoutAdded(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Title>Add New Workout</Title>

      <TextInput
        label="Category"
        placeholder="e.g. Hands"
        value={form.category}
        name="category"
        handleChange={handleChange}
      />
      <TextInput
        label="Workout Name"
        placeholder="e.g. Push Up"
        value={form.workoutName}
        name="workoutName"
        handleChange={handleChange}
      />
      <TextInput
        label="Sets"
        type="number"
        value={form.sets}
        name="sets"
        handleChange={handleChange}
      />
      <TextInput
        label="Reps"
        type="number"
        value={form.reps}
        name="reps"
        handleChange={handleChange}
      />
      <TextInput
        label="Weight (kg)"
        type="number"
        value={form.weight}
        name="weight"
        handleChange={handleChange}
      />
      <TextInput
        label="Duration (min)"
        type="number"
        value={form.duration}
        name="duration"
        handleChange={handleChange}
      />
      <TextInput
        label="Calories Burned (optional)"
        type="number"
        value={form.caloriesBurned}
        name="caloriesBurned"
        handleChange={handleChange}
      />

      <Button
        primary
        onClick={handleAddWorkout}
        text={loading ? "Adding..." : "Add Workout"}
        disabled={loading || !form.category.trim() || !form.workoutName.trim()}
      />
    </Card>
  );
};

export default AddWorkout;