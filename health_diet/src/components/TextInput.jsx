import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const BaseInput = styled.input`
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border || '#d1d5db'};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.input_background || '#f9fafb'};
  color: ${({ theme }) => theme.black};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary || '#9ca3af'};
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.border || '#d1d5db'};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.input_background || '#f9fafb'};
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 120px;

  &:hover {
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary || '#6366f1'};
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary || '#9ca3af'};
  }
`;

function TextInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  handleChange,
  textArea = false,
  rows = 6,
  name,
  defaultValue,
  readOnly = false,
}) {
  const changeHandler = onChange || handleChange;

  return (
    <InputContainer>
      {label && <Label htmlFor={name}>{label}</Label>}
      {textArea ? (
        <TextArea
          id={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={changeHandler}
          name={name}
          readOnly={readOnly}
        />
      ) : (
        <BaseInput
          id={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={changeHandler}
          name={name}
          readOnly={readOnly}
        />
      )}
    </InputContainer>
  );
}

export default TextInput;