import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeatureDialog from './FeatureDialog';
import { addNewFeature } from '../service/Features';
import { ThemeProvider } from '@mui/material/styles';
import { getLoginTheme } from './WebTheme';
import '@testing-library/jest-dom/extend-expect';

jest.mock('../service/Features', () => ({
    addNewFeature: jest.fn(),
}));

describe('FeatureDialog', () => {
    const commonProps = {
        setOpenEdit: jest.fn(),
        showAutoHideAlert: jest.fn(),
        data: [],
        setData: jest.fn(),
        userDetails: { project: 'Test Project' },
    };

    it('renders correctly in add mode', () => {
        render(
            <ThemeProvider theme={getLoginTheme(true)}>
                <FeatureDialog {...commonProps} edit={false} />
            </ThemeProvider>
        );
        expect(screen.getByText('New Feature')).toBeInTheDocument();
        expect(screen.getByLabelText('Feature Name')).toBeInTheDocument();
        expect(screen.getByText('Add')).toBeInTheDocument();
    });

    it('calls addNewFeature and showAutoHideAlert on successful addition', async () => {
        addNewFeature.mockResolvedValue({ id: 1, featureName: 'New Feature', project: 'Test Project' });
        render(
            <ThemeProvider theme={getLoginTheme(true)}>
                <FeatureDialog {...commonProps} edit={false} />
            </ThemeProvider>
        );
        fireEvent.change(screen.getByLabelText('Feature Name'), { target: { value: 'New Feature' } });
        fireEvent.click(screen.getByText('Add'));
        await waitFor(() => expect(addNewFeature).toHaveBeenCalledWith({
            featureName: 'New Feature',
            project: 'Test Project',
        }));
        expect(commonProps.showAutoHideAlert).toHaveBeenCalledWith('Feature added', 'success', 5000);
    });
});
