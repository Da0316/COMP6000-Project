import React from "react";
// import renderer from "react-test-renderer";
import {
  render,
  fireEvent,
  waitFor,
  getDefaultNormalizer,
} from "@testing-library/react-native";
import SelectSpecialities from "../screens/selectSpecialities";

jest.mock("expo-constants", () => ({
  Constants: jest.fn(),
}));

const mockRoute = {
  params: {
    userID: "1",
  },
};

test("renders default components", () => {
  const { getByTestId, getAllByText } = render(
    <SelectSpecialities route={mockRoute} />
  );
  const submit = getByTestId("submitButton");

  expect(submit).toBeDefined();
  expect(
    getAllByText("Select your specialities from the list below:").length
  ).toBe(1);
  expect(getAllByText("Selected:").length).toBe(1);
});

test("submit", async () => {
  const { getByTestId, getAllByText } = render(
    <SelectSpecialities route={mockRoute} />
  );
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() => 
    Promise.resolve({
        json: () => Promise.resolve(1)
    })
  )

  fireEvent.press(getByTestId("submitButton"));

  await waitFor(() => 
  expect(alertMock).toHaveBeenCalledWith("Successfully inputted Specialities")
  )

});
