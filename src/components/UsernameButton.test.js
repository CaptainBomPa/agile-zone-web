import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsernameButton from './UsernameButton';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "@emotion/react";
import { getLoginTheme } from "./WebTheme";

describe('UsernameButton Component', () => {
    it('opens the menu and displays the correct options for an administrator', () => {
        const handleLogoutMock = jest.fn();
        render(
            <ThemeProvider theme={getLoginTheme(true)}>
                <Router>
                    <UsernameButton
                        firstName="John"
                        lastName="Doe"
                        isAdministrator={true}
                        handleLogout={handleLogoutMock}
                        isProjectSupervisor={false}
                    />
                </Router>
            </ThemeProvider>
        );
        fireEvent.click(screen.getByText('John Doe'));
        expect(screen.getByText('Requests')).toBeInTheDocument();
        expect(screen.getByText('User Management')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Manage tags')).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Logout'));
        expect(handleLogoutMock).toHaveBeenCalled();
    });
});
