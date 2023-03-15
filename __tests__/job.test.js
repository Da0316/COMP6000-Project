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
});
