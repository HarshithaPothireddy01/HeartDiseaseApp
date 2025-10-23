import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Loader, Send, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService, fieldDefinitions } from '../services/api';

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 800px;
  margin: 0 auto;
`;

const FormTitle = styled.h2`
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.error {
    border-color: #e53e3e;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &.error {
    border-color: #e53e3e;
  }
`;

const ErrorMessage = styled.span`
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const Description = styled.span`
  color: #718096;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  
  &:hover:not(:disabled) {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const PredictionForm = ({ onPredictionComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await apiService.predictHeartDisease(data);
      toast.success('Prediction completed successfully!');
      onPredictionComplete(result);
    } catch (error) {
      toast.error(error.message || 'Failed to get prediction');
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = async () => {
    try {
      const { sample_data } = await apiService.getSampleData();
      Object.keys(sample_data).forEach(key => {
        setValue(key, sample_data[key]);
      });
      toast.success('Sample data loaded!');
    } catch (error) {
      toast.error('Failed to load sample data');
    }
  };

  const resetForm = () => {
    reset();
    toast.success('Form reset!');
  };

  const renderField = (fieldName, fieldConfig) => {
    const hasError = errors[fieldName];
    
    if (fieldConfig.type === 'select') {
      return (
        <FormGroup key={fieldName}>
          <Label htmlFor={fieldName}>{fieldConfig.label}</Label>
          <Select
            id={fieldName}
            {...register(fieldName, { 
              required: fieldConfig.required ? `${fieldConfig.label} is required` : false 
            })}
            className={hasError ? 'error' : ''}
          >
            <option value="">Select {fieldConfig.label}</option>
            {fieldConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {hasError && <ErrorMessage>{hasError.message}</ErrorMessage>}
          {fieldConfig.description && <Description>{fieldConfig.description}</Description>}
        </FormGroup>
      );
    }

    return (
      <FormGroup key={fieldName}>
        <Label htmlFor={fieldName}>{fieldConfig.label}</Label>
        <Input
          id={fieldName}
          type={fieldConfig.type}
          min={fieldConfig.min}
          max={fieldConfig.max}
          step={fieldConfig.step}
          {...register(fieldName, { 
            required: fieldConfig.required ? `${fieldConfig.label} is required` : false,
            min: fieldConfig.min ? { value: fieldConfig.min, message: `Minimum value is ${fieldConfig.min}` } : undefined,
            max: fieldConfig.max ? { value: fieldConfig.max, message: `Maximum value is ${fieldConfig.max}` } : undefined
          })}
          className={hasError ? 'error' : ''}
        />
        {hasError && <ErrorMessage>{hasError.message}</ErrorMessage>}
        {fieldConfig.description && <Description>{fieldConfig.description}</Description>}
      </FormGroup>
    );
  };

  // Group fields into rows for better layout
  const fieldGroups = [
    ['age', 'sex', 'cp'],
    ['trestbps', 'chol', 'fbs'],
    ['restecg', 'thalach', 'exang'],
    ['oldpeak', 'slope', 'ca'],
    ['thal', 'num_drugs']
  ];

  return (
    <FormContainer>
      <FormTitle>Heart Disease Prediction</FormTitle>
      <FormSubtitle>
        Enter patient data to get AI-powered heart disease prediction and drug recommendations
      </FormSubtitle>
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        {fieldGroups.map((group, index) => (
          <FormRow key={index}>
            {group.map(fieldName => renderField(fieldName, fieldDefinitions[fieldName]))}
          </FormRow>
        ))}
        
        <ButtonGroup>
          <SecondaryButton type="button" onClick={loadSampleData}>
            <RefreshCw size={18} />
            Load Sample Data
          </SecondaryButton>
          <SecondaryButton type="button" onClick={resetForm}>
            Reset Form
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader size={18} className="loading-spinner" />
                Predicting...
              </>
            ) : (
              <>
                <Send size={18} />
                Get Prediction
              </>
            )}
          </PrimaryButton>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default PredictionForm;
