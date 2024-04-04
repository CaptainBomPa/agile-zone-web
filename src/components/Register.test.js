import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Register from './Register';
import { ThemeProvider } from "@emotion/react";
import { getLoginTheme } from "./WebTheme";

jest.mock('axios');

describe('Register Component', () => {
    beforeEach(() => {
        axios.post.mockClear();
    });

    it('renders correctly', () => {
        const props = {
            setOnRegisterForm: jest.fn(),
            useDarkMode: false,
            showAutoHideAlert: jest.fn(),
        };
        render(
            <ThemeProvider theme={getLoginTheme(props.useDarkMode)}>
                <Register {...props} />
            </ThemeProvider>
        );
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByText('Request Register')).toBeDisabled();
    });

    it('updates input fields and validates email', () => {
        const props = {
            setOnRegisterForm: jest.fn(),
            useDarkMode: false,
            showAutoHideAlert: jest.fn(),
        };
        render(
            <ThemeProvider theme={getLoginTheme(props.useDarkMode)}>
                <Register {...props} />
            </ThemeProvider>
        );
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrongemail' } });
        fireEvent.blur(screen.getByLabelText('Email'));
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
});
