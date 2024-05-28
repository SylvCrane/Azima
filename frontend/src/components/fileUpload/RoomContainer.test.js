import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoomContainer from "./RoomContainer";

describe("Room Container", () => {
    // Use beforeEach to setup each test with a fresh render
    beforeEach(() => {
        // eslint-disable-next-line testing-library/no-render-in-setup
        render(<RoomContainer />);
    });
  
    // Testing initial creation of a tour
    test("renders the initial creation of a tour", () => {
        // User first writes tour name
        expect(screen.getByPlaceholderText(/Type your tour name/)).toBeInTheDocument();
    
        // User then clicks add room button
        const addButton = screen.getByText(/add room/i);
        fireEvent.click(addButton);
    
        // Create test image upload
        const imageUpload = new File(['content'], 'room1.jpg', { type: 'image/jpeg' });
        const fileInput = screen.getByLabelText(/Upload a 360° image/); // Adjust the label to match your actual input if necessary
    
        // Simulate file upload
        fireEvent.change(fileInput, { target: { files: [imageUpload] } });
    
        // Assert that file is set to the input (optional, depends on how you show file name or handle files)
        expect(fileInput.files[0]).toBe(imageUpload);
        expect(fileInput.files).toHaveLength(1);
    });

    // Testing when save all button is clicked
    test("renders save button when clicked", () => {
        const saveButton = screen.getByText(/save all/i);
        expect(saveButton).toBeInTheDocument();
    });
});