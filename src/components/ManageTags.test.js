import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from "@emotion/react";
import { getLoginTheme } from "./WebTheme";
import ManageTags from './ManageTags';
import { getAllTagsWithStats, addNewTag, removeTag } from "../service/Tags";

jest.mock("../service/Tags");

describe('ManageTags Component', () => {
    beforeEach(() => {
        getAllTagsWithStats.mockResolvedValue([
            { id: '1', tagName: 'TestTag1', relatedItemCount: 3 },
            { id: '2', tagName: 'TestTag2', relatedItemCount: 2 }
        ]);
    });

    it('loads and displays tags on mount', async () => {
        render(
            <ThemeProvider theme={getLoginTheme(true)}>
                <ManageTags />
            </ThemeProvider>
        );
        await waitFor(() => {
            expect(screen.getByText('TestTag1')).toBeInTheDocument();
            expect(screen.getByText('TestTag2')).toBeInTheDocument();
        });
    });

    it('allows the user to add a new tag and updates the list', async () => {
        const newTag = { id: '3', tagName: 'NewTag', relatedItemCount: 0 };
        addNewTag.mockResolvedValue(newTag);
        render(
            <ThemeProvider theme={getLoginTheme(true)}>
                <ManageTags />
            </ThemeProvider>
        );
        fireEvent.change(screen.getByLabelText('Add new tag'), { target: { value: 'NewTag' } });
        fireEvent.click(screen.getByText('ADD NEW TAG'));
        await waitFor(() => {
            expect(screen.getByText('NewTag')).toBeInTheDocument();
        });
    });
});
