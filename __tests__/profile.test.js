import React from "react";
// import renderer from "react-test-renderer";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Profile from "../screens/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";


jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => ({
  Icon: jest.fn(() => Promise.resolve()),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("@react-navigation/native", () => ({
  useIsFocused: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

test("render elements", () => {
  const { getAllByText } = render(<Profile navigation={mockNavigation}/>);

  expect(getAllByText("Logout").length).toBe(1)
  expect(getAllByText("Ratings Level").length).toBe(1);
  expect(getAllByText("Edit Profile").length).toBe(1);
  expect(getAllByText("View Jobs/Applications").length).toBe(1);
  expect(getAllByText("Jobs Completed").length).toBe(1);
  expect(getAllByText("Reviews").length).toBe(1);
});
