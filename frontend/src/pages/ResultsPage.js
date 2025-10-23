import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ResultsDisplay from '../components/ResultsDisplay';
import { ArrowLeft, Home } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const NavigationBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
  }
`;

const NoResultsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const NoResultsTitle = styled.h2`
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: #718096;
  font-size: 1.125rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    // Get prediction data from navigation state or localStorage
    const stateData = location.state?.predictionData;
    const storedData = localStorage.getItem('lastPrediction');
    
    if (stateData) {
      setPredictionData(stateData);
      // Store in localStorage for persistence
      localStorage.setItem('lastPrediction', JSON.stringify(stateData));
    } else if (storedData) {
      try {
        setPredictionData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored prediction data:', error);
        localStorage.removeItem('lastPrediction');
      }
    }
  }, [location.state]);

  const handleNewPrediction = () => {
    navigate('/predict');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!predictionData) {
    return (
      <PageContainer>
        <Container>
          <NavigationBar>
            <NavButton onClick={handleGoBack}>
              <ArrowLeft size={18} />
              Go Back
            </NavButton>
            <NavButton onClick={handleGoHome}>
              <Home size={18} />
              Home
            </NavButton>
          </NavigationBar>
          
          <NoResultsContainer>
            <NoResultsTitle>No Results Found</NoResultsTitle>
            <NoResultsText>
              It looks like you haven't made a prediction yet, or the results have expired.
              Start a new prediction to see your heart disease risk assessment.
            </NoResultsText>
            <ActionButton onClick={handleNewPrediction}>
              Start New Prediction
            </ActionButton>
          </NoResultsContainer>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container>
        <NavigationBar>
          <NavButton onClick={handleGoBack}>
            <ArrowLeft size={18} />
            Go Back
          </NavButton>
          <NavButton onClick={handleGoHome}>
            <Home size={18} />
            Home
          </NavButton>
          <NavButton onClick={handleNewPrediction}>
            New Prediction
          </NavButton>
        </NavigationBar>
        
        <ResultsDisplay 
          predictionData={predictionData} 
          onNewPrediction={handleNewPrediction}
        />
      </Container>
    </PageContainer>
  );
};

export default ResultsPage;
