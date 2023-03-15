import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../screens/homeScreen";

jest.mock("expo-location", () => ({
  Location: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

test("renders default elements", async () => {
  const { getAllByText, getByText, getByPlaceholderText, getByTestId } = render(
    <HomeScreen navigation={mockNavigation} />
  );
});
