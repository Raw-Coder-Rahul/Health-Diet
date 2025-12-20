// Button.jsx
import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: ${({ theme }) => theme.primary || '#4f46e5'};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')}; /* ✅ */

  &:hover {
    background: ${({ theme }) => theme.primary_hover || '#4338ca'};
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  }

  &:disabled {
    background: #cbd5e1;
    color: #6b7280;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

function Button({ text, onClick, disabled = false, fullWidth = false }) {
  return (
    <StyledButton onClick={onClick} disabled={disabled} fullWidth={fullWidth}>
      {text}
    </StyledButton>
  );
}
export default Button;