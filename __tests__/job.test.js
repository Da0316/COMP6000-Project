import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Job from "../screens/Job";


describe("Job component", () => {
  const mockRoute = {
    params: {
      jobID: 1,
    },
  };

  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockResponse = [
    123,
    "Engineering",
    "Job Title",
    "Job description",
    "2022-03-13 15:00:00",
    20,
    1,
    "username",
    "image.png",
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders job details", async () => {
    const { getByText, getByTestId } = render(
      <Job route={mockRoute} navigation={mockNavigation} />
    );

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    expect(getByTestId("title")).toHaveTextContent("Job Title");
    expect(getByText("Job description")).toBeDefined();
    expect(getByText("Speciality: Engineering")).toBeDefined();
    expect(getByText("Date Posted: 2022-03-13 15:00:00")).toBeDefined()
  });
});
