import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Heart, Activity, Brain, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #718096;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: rgba(255, 255, 255, 0.5);
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  color: #667eea;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #718096;
  line-height: 1.6;
`;

const StatusSection = styled.section`
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.3);
`;

const StatusContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const StatusCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const StatusTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatusText = styled.p`
  color: #718096;
  margin-bottom: 1rem;
`;

const StatusIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  background: ${props => props.status === 'healthy' ? '#c6f6d5' : '#fed7d7'};
  color: ${props => props.status === 'healthy' ? '#22543d' : '#742a2a'};
`;

const HomePage = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await apiService.healthCheck();
      setApiStatus(response);
      toast.success('API connection established!');
    } catch (error) {
      setApiStatus({ status: 'error', message: error.message });
      toast.error('API connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            AI-Powered Heart Disease Prediction
          </HeroTitle>
          <HeroSubtitle>
            Get instant, accurate heart disease predictions and personalized drug recommendations 
            using advanced machine learning and clinical expertise.
          </HeroSubtitle>
          <HeroButton to="/predict">
            Start Prediction
            <ArrowRight size={20} />
          </HeroButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle>Why Choose Our System?</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>
                <Brain size={48} />
              </FeatureIcon>
              <FeatureTitle>AI-Powered Analysis</FeatureTitle>
              <FeatureDescription>
                Advanced machine learning models trained on extensive clinical data 
                provide accurate predictions with high confidence scores.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Activity size={48} />
              </FeatureIcon>
              <FeatureTitle>Comprehensive Assessment</FeatureTitle>
              <FeatureDescription>
                Analyzes 13 key clinical parameters including age, blood pressure, 
                cholesterol, and exercise test results for complete evaluation.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <Shield size={48} />
              </FeatureIcon>
              <FeatureTitle>Drug Recommendations</FeatureTitle>
              <FeatureDescription>
                Get personalized drug recommendations based on your specific 
                risk profile and clinical parameters.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>

      <StatusSection>
        <StatusContainer>
          <StatusCard>
            <StatusTitle>
              <Heart size={24} />
              System Status
            </StatusTitle>
            <StatusText>
              Real-time monitoring of our prediction system
            </StatusText>
            {isLoading ? (
              <StatusIndicator status="loading">
                <div className="loading-spinner" />
                Checking...
              </StatusIndicator>
            ) : apiStatus?.status === 'healthy' ? (
              <StatusIndicator status="healthy">
                <CheckCircle size={16} />
                System Online
              </StatusIndicator>
            ) : (
              <StatusIndicator status="error">
                Connection Error
              </StatusIndicator>
            )}
            {apiStatus && (
              <StatusText style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                Database: {apiStatus.database || 'Unknown'} | 
                Last Check: {new Date().toLocaleTimeString()}
              </StatusText>
            )}
          </StatusCard>
        </StatusContainer>
      </StatusSection>
    </HomeContainer>
  );
};

export default HomePage;
