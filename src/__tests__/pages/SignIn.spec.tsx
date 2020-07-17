import React from 'react';

import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({ push: mockedHistoryPush }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/authContext.tsx', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

jest.mock('../../hooks/toastContext.tsx', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignIn Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // Pegamos a referência pros dois inputs
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('senha');
    const buttonElement = getByText('Entrar');

    // Simula uma ação do usuário,
    // nesse caso a ação de preencher o campo email e password
    fireEvent.change(emailField, {
      target: {
        value: 'johndoe@example.com',
      },
    });

    fireEvent.change(passwordField, {
      target: {
        value: '12341234',
      },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('it should be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // Pegamos a referência pros dois inputs
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('senha');
    const buttonElement = getByText('Entrar');

    // Simula uma ação do usuário,
    // nesse caso a ação de preencher o campo email e password
    fireEvent.change(emailField, {
      target: {
        value: 'not-valid-email',
      },
    });

    fireEvent.change(passwordField, {
      target: {
        value: '12341234',
      },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('it should display an error if the sign in fails', async () => {
    // Vamos sobrescrever a mock, para realizarmos um erro no código
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // Pegamos a referência pros dois inputs
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('senha');
    const buttonElement = getByText('Entrar');

    // Simula uma ação do usuário,
    // nesse caso a ação de preencher o campo email e password
    fireEvent.change(emailField, {
      target: {
        value: 'johndoe@example.com',
      },
    });

    fireEvent.change(passwordField, {
      target: {
        value: '12341234',
      },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      );
    });
  });
});
