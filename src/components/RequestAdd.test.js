import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from "@emotion/react";
import { getLoginTheme } from "./WebTheme";
import RequestAdd from './RequestAdd';
import * as UsersInfoService from '../service/UsersInfo';

jest.mock('../service/UsersInfo');

describe('RequestAdd Component', () => {
    beforeEach(() => {
        UsersInfoService.getAllBlocked.mockResolvedValue([
            { id: '1', username: 'User1', firstName: 'First1', lastName: 'Last1', email: 'email1@test.com' },
            { id: '2', username: 'User2', firstName: 'First2', lastName: 'Last2', email: 'email2@test.com' }
        ]);
    });

    it('loads and displays user data on mount', async () => {
        render(
            <ThemeProvider theme={getLoginTheme(true)}>
                <RequestAdd />
            </ThemeProvider>
        );
        expect(await screen.findByText('User1')).toBeInTheDocument();
        expect(await screen.findByText('User2')).toBeInTheDocument();
        expect(await screen.findByText('ID')).toBeInTheDocument();
        expect(await screen.findByText('Username')).toBeInTheDocument();
        expect(await screen.findByText('Accepts users')).toBeInTheDocument();
        expect(await screen.findByText('Delete requests and users')).toBeInTheDocument();
    });
});
