import { FitnessCenterRounded, TimelapseRounded } from '@mui/icons-material';
import React from 'react';
import styled from 'styled-components';

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
  background-color: ${({ theme }) => theme.primary + '22'};
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
  color: ${({ theme }) => theme.text_primary + 'cc'};
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
  color: ${({ theme }) => theme.text_primary + 'cc'};
  margin-right: 16px;
  gap: 4px;
`;

const WorkoutCard = ({ workout }) => {
  if (!workout) return null;

  return (
    <Card>
      {workout.category && <Category>#{workout.category}</Category>}

      {workout.workoutName && <Name>{workout.workoutName}</Name>}

      {workout.sets && workout.reps && (
        <Sets>
          Count: {workout.sets} sets × {workout.reps} reps
        </Sets>
      )}

      <Flex>
        {workout.weight && (
          <Details>
            <FitnessCenterRounded sx={{ fontSize: '16px', color: '#555', marginRight: '6px' }} />
            {workout.weight} kg
          </Details>
        )}
        {workout.duration && (
          <Details>
            <TimelapseRounded sx={{ fontSize: '16px', color: '#555', marginRight: '6px' }} />
            {workout.duration} min
          </Details>
        )}
      </Flex>

      {workout.caloriesBurned && (
        <Details>{workout.caloriesBurned} kcal</Details>
      )}

      {workout.date && (
        <Details>{new Date(workout.date).toLocaleDateString()}</Details>
      )}
    </Card>
  );
};

export default WorkoutCard;