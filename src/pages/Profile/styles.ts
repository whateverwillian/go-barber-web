import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;

  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;

      svg {
        height: 24px;
        width: 24px;
        color: #999591;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  width: 100%;
  margin: -150px auto 0;

  form {
    margin: 50px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  h1 {
    margin-bottom: 24px;
    font-size: 20px;
    text-align: left;
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
`;

export const DefaultAvatar = styled.div`
  width: 186px;
  height: 186px;
  border-radius: 50%;
  color: #ff9000;
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    background: #ff9000;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    bottom: 0;
    transition: background-color 0.2s;
    color: black;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }
`;
