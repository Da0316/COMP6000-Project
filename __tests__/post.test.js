import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Post from '../screens/Post';
import * as ImagePicker from "expo-image-picker";
import {
    SelectList,
  } from "react-native-dropdown-select-list";

  jest.mock("expo-image-picker", () => ({
    launchImageLibraryAsync: jest.fn(),
  }));


jest.mock("react-native-dropdown-select-list", () => ({
    SelectList: "MockSelectList",
    }));  


    describe("<Post >", () => {
        test("renders correctly", () => {
          const { getByPlaceholderText, getByText } = render(<Post />);
          const taskTitleInput = getByPlaceholderText("task Title");
          const taskDetailsInput = getByPlaceholderText("task details");
          const priceInput = getByPlaceholderText("£");
          const uploadImageButton = getByText("Upload Image");
          const postButton = getByText("Post");
      
          expect(taskTitleInput).toBeTruthy();
          expect(taskDetailsInput).toBeTruthy();
          expect(priceInput).toBeTruthy();
          expect(uploadImageButton).toBeTruthy();
          expect(postButton).toBeTruthy();
        });
      
        test("displays an error message when price is not set", () => {
          const { getByText, getByPlaceholderText } = render(<Post />);
          const taskTitleInput = getByPlaceholderText("task Title");
          const taskDetailsInput = getByPlaceholderText("task details");
          const postButton = getByText("Post");
      
          fireEvent.changeText(taskTitleInput, "Test Task Title");
          fireEvent.changeText(taskDetailsInput, "Test Task Details");
          fireEvent.press(postButton);
      
          expect(getByText("You have to set a price")).toBeTruthy();
        });
        
        // Add more test cases for other functionality
      });
