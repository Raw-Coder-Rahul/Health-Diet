import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkoutsByDate } from "../redux/reducers/workoutSlice";

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
  max-width: 1600px;
  height: 100vh;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 840px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow};
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  padding-left: 16px;
  @media (max-width: 840px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 840px) {
    gap: 12px;
  }
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

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Workouts = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const { items: workouts, loading, error } = useSelector((state) => state.workouts);

  useEffect(() => {
    const dateStr = selectedDate.format("YYYY-MM-DD");
    dispatch(fetchWorkoutsByDate(dateStr));
  }, [selectedDate]);

  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => newDate && setSelectedDate(newDate)}
            />
          </LocalizationProvider>
        </Left>

        <Right>
          <Section>
            <SecTitle>{selectedDate.format("DD MMM YYYY")} Workouts</SecTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {workouts.length > 0 ? (
                  workouts.map((w) => <WorkoutCard key={w._id} workout={w} />)
                ) : (
                  <p>No workouts found</p>
                )}
              </CardWrapper>
            )}
            {error && <p style={{ color: "red" }}>Error: {error.message || error}</p>}
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;