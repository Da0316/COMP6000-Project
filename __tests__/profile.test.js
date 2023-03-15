// import React from "react";
// // import renderer from "react-test-renderer";
// import { render, fireEvent, waitFor } from "@testing-library/react-native";
// import Profile from "../screens/profile";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// jest.mock("react-native-vector-icons/MaterialCommunityIcons", () => ({
//   Icon: jest.fn(() => Promise.resolve()),
// }));

// jest.mock("@react-native-async-storage/async-storage", () => ({
//   setItem: jest.fn(() => Promise.resolve()),
// }));

// jest.mock("@react-navigation/native", () => ({
//   useIsFocused: jest.fn(),
// }));

// const mockNavigation = {
//   navigate: jest.fn(),
// };

// test("render elements", () => {
//   const { getByTestId } = render(<Profile />);

//   const profilePic = getByTestId("profile_pic");
// });
