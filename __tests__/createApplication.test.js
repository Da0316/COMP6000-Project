import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import CreateApplication from "../screens/createApplication";

const mockRoute = {
  params: {
    jobID: "1",
  },
};

test("renders default elements", () => {
  const { getAllByText, getByPlaceholderText, getByTestId } = render(
    <CreateApplication route={mockRoute} />
  );

  expect(getAllByText("Create Application").length).toBe(1);
  expect(getAllByText("Apply").length).toBe(1);
  expect(getByPlaceholderText("Price Offer*")).toBeDefined();
  expect(getByTestId("apply_button")).toBeDefined();
});

test("outstandingJob", async () => {
  const { getByTestId, getByPlaceholderText } = render(
    <CreateApplication route={mockRoute} />
  );
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve("true"),
    })
  );

  fireEvent.changeText(getByPlaceholderText("Price Offer*"), "15");
  fireEvent.press(getByTestId("apply_button"));
  await waitFor(() =>
    expect(alertMock).toHaveBeenCalledWith(
      "You have an outstanding job with this user"
    )
  );
  window.alert.mockRestore();
});

test("calls submit", async () => {
  const { getByTestId, getByPlaceholderText } = render(
    <CreateApplication route={mockRoute} />
  );
  const alertMock = jest.fn();
  window.alert = alertMock;
  global.fetch = jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve("false"),
    })
  );

  const submit = jest.fn();

  fireEvent.changeText(getByPlaceholderText("Price Offer*"), "");
  fireEvent.press(getByTestId("apply_button"));

  submit();
  await waitFor(() => expect(submit).toHaveBeenCalled());

  window.alert.mockRestore();
});


