import { FitnessCenterRounded, TimelapseRounded } from "@mui/icons-material";
import React from "react";
import styled from "styled-components";
import Button from "../Button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { removeWorkout } from "../../redux/reducers/workoutSlice";

const Card = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 8px;
  display: flex;
  gap: 6px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow + 15};
  flex-direction: column;
`;

const Category = styled.div`
  width: fit-content;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 6px;
  background-color: ${({ theme }) => theme.primary + "22"};
  padding: 4px 8px;
  border-radius: 4px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 12px;
`;

const Sets = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary + "cc"};
  margin-bottom: 12px;
`;

const Flex = styled.div`
  display: flex;
  gap: 16px;
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary + "cc"};
  margin-right: 16px;
  gap: 4px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

const WorkoutCard = ({ workout }) => {
  const dispatch = useDispatch();

  if (!workout) return null;

  const handleDelete = async () => {
    try {
      await dispatch(removeWorkout(workout._id)).unwrap();
      toast.success("Workout deleted!");
    } catch (err) {
      console.error("Error deleting workout:", err);
      toast.error(err || "Failed to delete workout");
    }
  };

  return (
    <Card>
      {workout.category && <Category>#{workout.category}</Category>}
      {workout.workoutName && <Name>{workout.workoutName}</Name>}
      {Number.isFinite(workout.sets) && Number.isFinite(workout.reps) && (
        <Sets>
          Count: {workout.sets} sets × {workout.reps} reps
        </Sets>
      )}
      <Flex>
        {Number.isFinite(workout.weight) && (
          <Details>
            <FitnessCenterRounded sx={{ fontSize: 16, color: "#555", mr: 1 }} />
            Weight: {workout.weight} kg
          </Details>
        )}
        {Number.isFinite(workout.duration) && (
          <Details>
            <TimelapseRounded sx={{ fontSize: 16, color: "#555", mr: 1 }} />
            Duration: {workout.duration} min
          </Details>
        )}
      </Flex>
      {Number.isFinite(workout.totalVolume) && workout.totalVolume > 0 && (
        <Details>Total Volume: {workout.totalVolume}</Details>
      )}
      {Number.isFinite(workout.caloriesBurned) && (
        <Details>Calories Burned: {workout.caloriesBurned} kcal</Details>
      )}
      {workout.date && (
        <Details>
          {new Date(workout.date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Details>
      )}
      <Footer>
        <Button text="Delete" small onClick={handleDelete} aria-label="Delete workout" />
      </Footer>
    </Card>
  );
};

export default WorkoutCard;