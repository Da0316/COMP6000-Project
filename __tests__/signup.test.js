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

test("date picker", () => {
  const { getByPlaceholderText, getByTestId } = render(<Signup />);
  const alertMock = jest.fn();
  window.alert = alertMock;
  fireEvent.changeText(getByPlaceholderText("Email address*"), "lukas@lukas.com")
  fireEvent.changeText(getByPlaceholderText("Password*"), "Hello123.")
  const datePicker = getByTestId("datePicker");
  expect(datePicker).toBeDefined();
  fireEvent(datePicker, 'dateChange', ''); 
  expect(alertMock).toHaveBeenCalledWith("please select DOB");
})

