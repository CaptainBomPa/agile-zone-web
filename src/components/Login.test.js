import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login'; // Zakładając, że ścieżka do komponentu jest prawidłowa
import '@testing-library/jest-dom/extend-expect';
import { getLoginTheme } from '../components/WebTheme';
import { ThemeProvider } from '@emotion/react'; // Uwaga: upewnij się, że importujesz ThemeProvider z odpowiedniej biblioteki
import { loginUser } from '../service/UserLogin';

jest.mock('../service/UserLogin', () => ({
  loginUser: jest.fn(),
}));

describe('Login Component', () => {
  const commonProps = {
    setToken: jest.fn(),
    navigate: jest.fn(),
    setOnRegisterForm: jest.fn(),
    useDarkMode: false,
    setUseDarkMode: jest.fn(),
    showAutoHideAlert: jest.fn(),
  };

  beforeEach(() => {
    loginUser.mockClear();
  });

  it('renders the login form', () => {
    render(
      <ThemeProvider theme={getLoginTheme(commonProps.useDarkMode)}>
        <Login {...commonProps} />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Request Registration')).toBeInTheDocument();
  });

  it('calls loginUser with the correct credentials', async () => {
    const username = 'testuser';
    const password = 'testpass';
    loginUser.mockResolvedValue({ token: 'testtoken' });
    render(
      <ThemeProvider theme={getLoginTheme(commonProps.useDarkMode)}>
        <Login {...commonProps} />
      </ThemeProvider>
    );
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: username } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => expect(loginUser).toHaveBeenCalledWith({ username, password }, expect.any(Function)));
    expect(commonProps.setToken).toHaveBeenCalledWith('testtoken');
  });
});
