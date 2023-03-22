import React from "react";
// import renderer from "react-test-renderer";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";

// Import the component to be tested
import Login from "../screens/login";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock the useIsFocused hook
jest.mock("@react-navigation/native", () => ({
  useIsFocused: jest.fn(),
}));

test("render default elements", () => {
  const { getAllByText, getByPlaceholderText } = render(<Login />);

  expect(getAllByText("Login").length).toBe(1);
  expect(getAllByText("Signup").length).toBe(1);
  expect(getAllByText("Forgot Password? Press here").length).toBe(1);

  getByPlaceholderText("Username");
  getByPlaceholderText("Password");
});

test("username blank", () => {
  const { getByTestId } = render(<Login />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.press(getByTestId("loginButton"));

  expect(alertMock).toHaveBeenCalledWith("Please enter username");

  window.alert.mockRestore();
});

test("password blank", () => {
  const { getByTestId } = render(<Login />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByTestId("usernameTest"), "test");
  fireEvent.press(getByTestId("loginButton"));

  expect(alertMock).toHaveBeenCalledWith("Please enter a password");

  window.alert.mockRestore();
});

test("incorrect details", async () => {
  const { getByTestId } = render(<Login />);
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(-1),
    })
  );
  fireEvent.changeText(getByTestId("usernameTest"), "testuser");
  fireEvent.changeText(getByTestId("passwordTest"), "testpassword");
  fireEvent.press(getByTestId("loginButton"));
  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith("Wrong Login Details")
  );
  window.alert.mockRestore();
});

test ("correct details & async storage", async () => {
  const { getByTestId } = render(<Login />);
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve("1"),
    })
  );
  fireEvent.changeText(getByTestId("usernameTest"), "lkaasan");
  fireEvent.changeText(getByTestId("passwordTest"), "hello");
  fireEvent.press(getByTestId("loginButton"));
  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith("Successfully Login"),
  );

  expect(AsyncStorage.setItem).toHaveBeenCalledWith(
    "user_id",
    JSON.stringify(1)
  );

  window.alert.mockRestore();
})
