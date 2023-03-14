import React from "react";
// import renderer from "react-test-renderer";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Signup from "../screens/signUp";

jest.mock("react-native-modern-datepicker", () => ({
  DatePicker: jest.fn(),
}));
jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(),
}));

test("render default elements", () => {
    const { getAllByText, getByPlaceholderText } = render(<Signup />);

    getByPlaceholderText("First name*");
    getByPlaceholderText("Last name*");
    getByPlaceholderText("Set Username*");
    expect(getAllByText("Date of birth:").length).toBe(1); 
    getByPlaceholderText("Email address*");
    getByPlaceholderText("Phone Number*");
    expect(getAllByText("Enter your full address:").length).toBe(1); 
    getByPlaceholderText("address Line 1*");
    getByPlaceholderText("address Line 2");
    getByPlaceholderText("City*");
    getByPlaceholderText("Post Code*");
    expect(getAllByText("Password must containt at least:").length).toBe(1); 
    expect(getAllByText("* 1 UpperCase Character").length).toBe(1); 
    expect(getAllByText("* 1 LowerCase Character").length).toBe(1); 
    expect(getAllByText("* 1 Special Character").length).toBe(1);
    expect(getAllByText("* at least 8 characters long").length).toBe(1);
    getByPlaceholderText("Password*");
    getByPlaceholderText("Confirm password*");
})

test("email not valid" , () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "test")
  fireEvent.press(getByTestId("signUpButton"));

  expect(alertMock).toHaveBeenCalledWith("email is not valid");

  window.alert.mockRestore();
})

test("password length not valid", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "1")
  fireEvent.press(getByTestId("signUpButton"));

  expect(alertMock).toHaveBeenCalledWith("password is not of valid form, must containt at least 1 upper 1 lowercase 1 special and 8 characters long");

  window.alert.mockRestore();
});

test("address 1 blank", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.press(getByTestId("signUpButton"));
  // fireEvent.changeText(getByTestId("datePicker"), "")
  expect(alertMock).toHaveBeenCalledWith("please enter address line 1");
  window.alert.mockRestore();
})

test ("address city blank", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.changeText(getByPlaceholderText("address Line 1*"), "23 Downs Road")
  fireEvent.press(getByTestId("signUpButton"));
  expect(alertMock).toHaveBeenCalledWith("please enter the address city");
  window.alert.mockRestore();
})

test ("address postcode blank", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.changeText(getByPlaceholderText("address Line 1*"), "23 Downs Road")
  fireEvent.changeText(getByPlaceholderText("City*"), "Canterbury")
  fireEvent.press(getByTestId("signUpButton"));
  expect(alertMock).toHaveBeenCalledWith("please enter the address post code");
  window.alert.mockRestore();
})

test ("passwords dont match", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.changeText(getByPlaceholderText("address Line 1*"), "23 Downs Road")
  fireEvent.changeText(getByPlaceholderText("City*"), "Canterbury")
  fireEvent.changeText(getByPlaceholderText("Post Code*"), "CT2 7AY")
  fireEvent.changeText(getByPlaceholderText("Confirm password*"), "Hello13.")
  fireEvent.press(getByTestId("signUpButton"));
  expect(alertMock).toHaveBeenCalledWith("Passwords must match!");
  window.alert.mockRestore();
})

test ("invalid address", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.changeText(getByPlaceholderText("address Line 1*"), "23")
  fireEvent.changeText(getByPlaceholderText("City*"), "Cantebury")
  fireEvent.changeText(getByPlaceholderText("Post Code*"), "CT2AY")
  fireEvent.changeText(getByPlaceholderText("Confirm password*"), "Hello123.")
  fireEvent.press(getByTestId("signUpButton"));
  expect(alertMock).toHaveBeenCalledWith("address does not exist");
  window.alert.mockRestore();
})

test ("Missing Fields", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("First name*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.changeText(getByPlaceholderText("address Line 1*"), "23 Downs Road")
  fireEvent.changeText(getByPlaceholderText("City*"), "Canterbury")
  fireEvent.changeText(getByPlaceholderText("Post Code*"), "CT2 7AY")
  fireEvent.changeText(getByPlaceholderText("Confirm password*"), "Hello123.")
  fireEvent.press(getByTestId("signUpButton"));
  expect(alertMock).toHaveBeenCalledWith("Please fill out all the fields");
  window.alert.mockRestore();
})

test ("Missing Fields", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve("email already exists"),
    })
  );

  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("First name*"), "Lukas")
  fireEvent.changeText(getByPlaceholderText("Last name*"), "Kaas Andersen")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  fireEvent.changeText(getByPlaceholderText("address Line 1*"), "23 Downs Road")
  fireEvent.changeText(getByPlaceholderText("City*"), "Canterbury")
  fireEvent.changeText(getByPlaceholderText("Post Code*"), "CT2 7AY")
  fireEvent.changeText(getByPlaceholderText("Confirm password*"), "Hello123.")
  fireEvent.press(getByTestId("signUpButton"));
  expect(alertMock).toHaveBeenCalledWith("Please fill out all the fields");
  window.alert.mockRestore();
})

