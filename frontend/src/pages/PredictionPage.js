import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PredictionForm from '../components/PredictionForm';
import ResultsDisplay from '../components/ResultsDisplay';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const PredictionPage = () => {
  const [predictionData, setPredictionData] = useState(null);
  const navigate = useNavigate();

  const handlePredictionComplete = (result) => {
    setPredictionData(result);
    // Navigate to results page after a short delay
    setTimeout(() => {
      navigate('/results', { state: { predictionData: result } });
    }, 2000);
  };

  const handleNewPrediction = () => {
    setPredictionData(null);
  };

  return (
    <PageContainer>
      <Container>
        {!predictionData ? (
          <PredictionForm onPredictionComplete={handlePredictionComplete} />
        ) : (
          <ResultsDisplay 
            predictionData={predictionData} 
            onNewPrediction={handleNewPrediction}
          />
        )}
      </Container>
    </PageContainer>
  );
};

export default PredictionPage;
