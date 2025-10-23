import React from 'react';
import styled from 'styled-components';
import { Heart, Activity, Pill, TrendingUp, Clock, Database } from 'lucide-react';

const ResultsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 1000px;
  margin: 0 auto;
`;

const ResultsTitle = styled.h2`
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const ResultsSubtitle = styled.p`
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ResultCard = styled.div`
  background: linear-gradient(135deg, ${props => props.gradient || '#667eea 0%, #764ba2 100%'});
  color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
`;

const CardIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const DrugsSection = styled.div`
  background: #f7fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const DrugsTitle = styled.h3`
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DrugsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const DrugItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid #667eea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DrugNumber = styled.div`
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const DrugName = styled.span`
  color: #2d3748;
  font-weight: 500;
`;

const MetadataSection = styled.div`
  background: #edf2f7;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  
  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
`;

const ResultsDisplay = ({ predictionData, onNewPrediction }) => {
  if (!predictionData) {
    return null;
  }

  const { prediction, patient_data, num_drugs_requested, timestamp, model_used } = predictionData;
  const probability = prediction.probability_of_heart_disease;
  const drugs = prediction.recommended_drugs || [];

  // Calculate risk level and color
  const getRiskLevel = (prob) => {
    if (prob < 0.3) return { level: 'Low', color: '#48bb78', gradient: '#48bb78 0%, #68d391 100%' };
    if (prob < 0.7) return { level: 'Medium', color: '#ed8936', gradient: '#ed8936 0%, #f6ad55 100%' };
    return { level: 'High', color: '#e53e3e', gradient: '#e53e3e 0%, #fc8181 100%' };
  };

  const riskInfo = getRiskLevel(probability);
  const percentage = Math.round(probability * 100);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <ResultsContainer>
      <ResultsTitle>
        <Heart size={28} />
        Prediction Results
      </ResultsTitle>
      <ResultsSubtitle>
        AI-powered heart disease prediction and drug recommendations
      </ResultsSubtitle>

      <ResultsGrid>
        <ResultCard gradient={riskInfo.gradient}>
          <CardIcon>
            <Activity size={32} />
          </CardIcon>
          <CardTitle>Heart Disease Risk</CardTitle>
          <CardValue>{percentage}%</CardValue>
          <CardDescription>
            {riskInfo.level} Risk Level
          </CardDescription>
        </ResultCard>

        <ResultCard gradient="#667eea 0%, #764ba2 100%">
          <CardIcon>
            <TrendingUp size={32} />
          </CardIcon>
          <CardTitle>Confidence Score</CardTitle>
          <CardValue>{Math.round(probability * 100)}%</CardValue>
          <CardDescription>
            AI Model Confidence
          </CardDescription>
        </ResultCard>
      </ResultsGrid>

      <DrugsSection>
        <DrugsTitle>
          <Pill size={20} />
          Recommended Drugs ({drugs.length})
        </DrugsTitle>
        <DrugsList>
          {drugs.map((drug, index) => (
            <DrugItem key={index}>
              <DrugNumber>{index + 1}</DrugNumber>
              <DrugName>{drug}</DrugName>
            </DrugItem>
          ))}
        </DrugsList>
      </DrugsSection>

      <MetadataSection>
        <MetadataItem>
          <Clock size={16} />
          <span>Predicted: {formatTimestamp(timestamp)}</span>
        </MetadataItem>
        <MetadataItem>
          <Database size={16} />
          <span>Model: {model_used}</span>
        </MetadataItem>
        <MetadataItem>
          <Activity size={16} />
          <span>Drugs Requested: {num_drugs_requested}</span>
        </MetadataItem>
        <MetadataItem>
          <Heart size={16} />
          <span>Patient Age: {patient_data.age} years</span>
        </MetadataItem>
      </MetadataSection>

      <ActionButtons>
        <SecondaryButton onClick={onNewPrediction}>
          New Prediction
        </SecondaryButton>
        <PrimaryButton onClick={() => window.print()}>
          Print Results
        </PrimaryButton>
      </ActionButtons>
    </ResultsContainer>
  );
};

export default ResultsDisplay;
