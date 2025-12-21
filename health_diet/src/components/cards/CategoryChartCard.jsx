import { PieChart } from "@mui/x-charts";
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow};
  background-color: ${({ theme }) => theme.bg_secondary};
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
`;

const ColorBox = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${({ color }) => color};
`;

const EmptyMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 20px;
`;

const CategoryChartCard = ({ data }) => {
  const chartData = data?.pieChartData || [];

  return (
    <Card>
      <Title>Calories Burned by Category (Today)</Title>
      {chartData.length > 0 ? (
        <>
          <ChartWrapper>
            <PieChart
              series={[
                {
                  data: chartData.map((d, idx) => ({
                    id: d.id || idx,
                    value: d.value,
                    label: d.label,
                    color: d.color,
                  })),
                  innerRadius: 40,
                  paddingAngle: 2,
                  cornerRadius: 5,
                },
              ]}
              height={280}
              width={280}
            />
          </ChartWrapper>
          <Legend>
            {chartData.map((d, idx) => (
              <LegendItem key={d.id || idx}>
                <ColorBox color={d.color || "#4CAF50"} />
                <strong>{d.label}</strong>: {d.value} kcal
              </LegendItem>
            ))}
          </Legend>
        </>
      ) : (
        <EmptyMessage>No category data available</EmptyMessage>
      )}
    </Card>
  );
};

export default CategoryChartCard;