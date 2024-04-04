import { render, screen, fireEvent } from '@testing-library/react';
import AutoHideAlert from './AutoHideAlert'; // Ścieżka do Twojego komponentu

describe('AutoHideAlert', () => {
    it('closes when the close icon is clicked', () => {
        const mockSetAlertOpen = jest.fn();
        render(<AutoHideAlert alertOpen={true} alertType="success" alertMessage="Close me" setAlertOpen={mockSetAlertOpen} />);
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);
        expect(mockSetAlertOpen).toHaveBeenCalledWith(false);
    });
});
