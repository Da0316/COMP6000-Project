import React from "react";
// import renderer from "react-test-renderer";
import {
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import Signup from "../screens/signUp";
import DatePicker from 'react-native-modern-datepicker';
import mockRNComponents from 'react-native-mock';
mockRNComponents.mockDatePicker();

jest.mock("react-native-modern-datepicker");

test("render default elements", () => {
    const { getAllByText, getByPlaceholderText } = render(<Signup />);

    getByPlaceholderText("First name*");
    getByPlaceholderText("Last name*");
    getByPlaceholderText("Set Username*");
    expect(getAllByText("Date of birth:").length).toBe(1); 
    getByPlaceholderText("Email address");
    getByPlaceholderText("Phone Number*");
    expect(getAllByText("Enter your full address").length).toBe(1); 
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