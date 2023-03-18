import React from "react";
// import renderer from "react-test-renderer";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import ForgotPassword from "../screens/ForgotPassword";

test("renders components", () => {
  const { getByText, getByPlaceholderText } = render(<ForgotPassword />);

  expect(
    getByText("Enter your email address to reset your password.")
  ).toBeDefined();
  expect(getByPlaceholderText("Email Address")).toBeDefined();
  expect(getByPlaceholderText("New Password")).toBeDefined();
  expect(getByText("Reset Password")).toBeDefined();
});

test("email empty", () => {
  const { getByTestId } = render(<ForgotPassword />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.press(getByTestId("resetButton"));

  expect(alertMock).toHaveBeenCalledWith("Please enter your email address.");
  window.alert.mockRestore();
});

test("empty password", () => {
  const { getByTestId, getByPlaceholderText } = render(<ForgotPassword />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(
    getByPlaceholderText("Email Address"),
    "lukas@gmail.com"
  );
  fireEvent.press(getByTestId("resetButton"));

  expect(alertMock).toHaveBeenCalledWith("Please enter valid new password.");
  window.alert.mockRestore();
});

test("invalid password", () => {
  const { getByTestId, getByPlaceholderText } = render(<ForgotPassword />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(
    getByPlaceholderText("Email Address"),
    "lukas@gmail.com"
  );
  fireEvent.changeText(getByPlaceholderText("New Password"), "hello");
  fireEvent.press(getByTestId("resetButton"));

  expect(alertMock).toHaveBeenCalledWith("Please enter valid new password.");
  window.alert.mockRestore();
});

test("email doesn't exist", async () => {
  const { getByTestId, getByPlaceholderText } = render(<ForgotPassword />);
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve("email doesn't exist"),
    })
  );

  fireEvent.changeText(
    getByPlaceholderText("Email Address"),
    "lukas@gmail.com"
  );
  fireEvent.changeText(getByPlaceholderText("New Password"), "hello1233");
  fireEvent.press(getByTestId("resetButton"));

  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith("email doesn't exist")
  );
  window.alert.mockRestore();
});

test("successfuly password change", async () => {
    const { getByTestId, getByPlaceholderText } = render(<ForgotPassword />);
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve("success"),
    })
  );

  fireEvent.changeText(
    getByPlaceholderText("Email Address"),
    "lukas@gmail.com"
  );
  fireEvent.changeText(getByPlaceholderText("New Password"), "hello1233");
  fireEvent.press(getByTestId("resetButton"));

  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith("Password updated successfully")
  );
  window.alert.mockRestore();
})
