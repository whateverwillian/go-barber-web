import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import signInBackgroundImg from '../../assets/sign-in-background.png';

const apperFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  width: 100%;
  max-width: 700px;
`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  width: 100%;
  max-width: 700px;

  animation: ${apperFromLeft} 0.5s;

  form {
    margin: 50px 0;
    width: 340px;
    text-align: center;
  }

  h1 {
    margin-bottom: 24px;
  }

  a {
    display: block;
    color: #f4ede8;
    margin-top: 20px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }
  }

  > a {
    font-weight: 500;
    color: #ff9000;

    svg {
      margin-right: 5px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background-size: cover;
`;
