import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Help } from './Help';  // Adjust the import path based on your project structure

describe("Help Form", () => {
    // Test to ensure all form fields and submit button are rendered
    test("renders the form with all fields and a submit button", () => {
        render(<Help />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
    });

    // Test to check for an error message when email format is incorrect
    test("shows validation messages when email format is incorrect", async () => {
        render(<Help />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'email@gmail' } });  // Incorrect format
        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    
        const invalidEmailMessage = await screen.findByText(/Invalid email address./i);
        expect(invalidEmailMessage).toBeInTheDocument();  
    });

    // // Test for checking validation when trying to submit an empty form
    // test("shows validation messages when trying to submit an empty form", async () => {
    //     render(<Help />);
    //     fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    //     fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    //     fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: '' } });
    //     fireEvent.change(screen.getByLabelText(/message/i), { target: { value: '' } });
    //     fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    //     // Use findByText to wait for the error message to appear
    //     const alertMessage = await screen.findByText(/Cannot be left empty./i);
    //     expect(alertMessage).toBeInTheDocument();
    // });

    // Test for checking successful form submission with a success message
    test("shows a success message when the form is submitted with valid data", async () => {
        // Mock the fetch call to simulate a successful form submission
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ status: 'ok' })
            })
        );

        render(<Help />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Maxinne' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'maxinnesjs@gmail.com' } });
        fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Help' } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'I need help with Azima.' } });
        fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

        await waitFor(() => {
            const successMessage = screen.getByText(/Message has been sent. The Azima team will get back to you when we can!/i);
            expect(successMessage).toBeInTheDocument();
        });

        // Restore the original fetch implementation after the test
        global.fetch.mockRestore();
    });
});
