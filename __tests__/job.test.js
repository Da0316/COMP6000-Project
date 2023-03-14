import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Job from '../screens/job';

describe('Job', () => {
  const mockRoute = {
    params: {
      jobID: '1',
    },
  };
  const mockNavigation = {
    navigate: jest.fn(),
  };

  test('renders job title and description', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByTestId('title')).toBeDefined();
      expect(getByTestId('description')).toBeDefined();
    });
  });

  test('renders job speciality', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByTestId('speciality')).toBeDefined();
    });
  });

  test('renders job date', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByTestId('date')).toBeDefined();
    });
  });

  test('renders job hourly rate', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByTestId('rate')).toBeDefined();
    });
  });

  test('renders job image', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByTestId('job_image')).toBeDefined();
    });
  });

  test('navigates to CreateApplication screen when create application button is pressed', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    const createApplicationButton = getByTestId('create-application-button');
    createApplicationButton.props.onPress();
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('CreateApplication', { jobID: '1' });
    });
  });

  test('navigates to JobApplications screen when view applications button is pressed', async () => {
    const { getByTestId } = render(<Job route={mockRoute} navigation={mockNavigation} />);
    const viewApplicationsButton = getByTestId('view-applications-button');
    viewApplicationsButton.props.onPress();
    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('JobApplications', { jobID: '1' });
    });
  });
});
