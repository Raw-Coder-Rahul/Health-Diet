import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  flex: 1;
  min-width: 215px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 8px;
  display: flex;
  gap: 6px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.shadow + 15};
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Value = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  display: flex;
  align-items: end;
  gap: 8px;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Unit = styled.div`
  font-size: 16px;
  margin-bottom: 2px;
`;

const Desc = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 6px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 840px) {
    font-size: 12px;
  }
`;

const Trend = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: ${({ $positive }) => ($positive ? '#46af4aff' : '#f44336')};
  margin-bottom: 3px;
  @media (max-width: 768px) {
    font-size: 12px;
  }
  @media (max-width: 840px) {
    font-size: 10px;
  }
`;

const Icon = styled.div`
  height: fit-content;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: ${({ $color }) => $color};
  background-color: ${({ $bg }) => $bg};
`;

const CountsCard = ({ item, data }) => {
  const rawValue = data ? data[item?.key] : undefined;
  const isNumber = typeof rawValue === 'number' && !Number.isNaN(rawValue);
  const displayValue = isNumber ? rawValue.toFixed(2) : '--';

  const trendPercent = item?.trend ?? 0;
  const isPositive = trendPercent >= 0; 

  return (
    <Card>
      <Left>
        <Title>{item?.name || '—'}</Title>
        <Value>
          {displayValue}
          {item?.unit && <Unit>{item.unit}</Unit>}
          <Trend $positive={isPositive}>
            {isPositive
              ? `+${Math.abs(trendPercent)}%`
              : `-${Math.abs(trendPercent)}%`}
          </Trend>
        </Value>
        <Desc>{item?.desc || ''}</Desc>
      </Left>
      <Icon $color={item?.color} $bg={item?.lightColor}>
        {item?.icon}
      </Icon>
    </Card>
  );
};

export default CountsCard;