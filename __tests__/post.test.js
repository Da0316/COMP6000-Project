import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Post from "../screens/Post";
import * as ImagePicker from "expo-image-picker";
import { SelectList } from "react-native-dropdown-select-list";

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock("react-native-dropdown-select-list", () => ({
  SelectList: "MockSelectList",
}));

const fetch = require("node-fetch");

jest.mock("node-fetch");

test("renders correctly", () => {
  const { getByPlaceholderText, getByText } = render(<Post />);
  const taskTitleInput = getByPlaceholderText("task Title");
  const taskDetailsInput = getByPlaceholderText("task details");
  const priceInput = getByPlaceholderText("£");
  const uploadImageButton = getByText("Upload Image");
  const postButton = getByText("Post");
  const speciality = getByText("Task speciality:");

  expect(taskTitleInput).toBeDefined();
  expect(taskDetailsInput).toBeDefined();
  expect(priceInput).toBeDefined();
  expect(uploadImageButton).toBeDefined();
  expect(postButton).toBeDefined();
  expect(speciality).toBeDefined();
});

test("can change values", () => {
  const { getByPlaceholderText, getByText } = render(<Post />);
  const taskTitleInput = getByPlaceholderText("task Title");
  const taskDetailsInput = getByPlaceholderText("task details");
  const priceInput = getByPlaceholderText("£");

  fireEvent.changeText(taskTitleInput, "Fence Painting");
  fireEvent.changeText(taskDetailsInput, "I need my fence painted");
  fireEvent.changeText(priceInput, "15");

  expect(taskTitleInput).toHaveAccessibilityValue("Fence Painting");
  expect(taskDetailsInput).toHaveAccessibilityValue("I need my fence painted");
  expect(priceInput).toHaveAccessibilityValue("15");
});
