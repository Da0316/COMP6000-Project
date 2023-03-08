import React from 'react';
import renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Import the component to be tested
import Login from '../screens/login';

// Mock the AsyncStorage module
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock the useIsFocused hook
jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

describe('<Login />', () => {
  // Declare variables needed for the tests
  let component;
  let instance;

  beforeEach(() => {
    // Set the default mocked values for AsyncStorage and useIsFocused
    AsyncStorage.getItem.mockResolvedValue(null);
    useIsFocused.mockReturnValue(true);

    // Render the component
    component = renderer.create(<Login />);
    instance = component.getInstance();
  });

  afterEach(() => {
    // Clear the mocked values after each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('resets the inputs when the screen is focused', () => {
    instance.setState({ userName: 'test', password: '1234' });
    useIsFocused.mockReturnValueOnce(false);
    useIsFocused.mockReturnValueOnce(true);
    instance.componentDidUpdate();
    expect(instance.state.userName).toEqual('');
    expect(instance.state.password).toEqual('');
  });

  it('saves the user id to AsyncStorage after successful login', async () => {
    const mockResponseJson = '1';
    fetch.mockResolvedValueOnce({ json: () => mockResponseJson });
    await instance.signIn();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('user_id', mockResponseJson);
  });

  it('navigates to HomeScreen after successful login', async () => {
    const mockResponseJson = '1';
    fetch.mockResolvedValueOnce({ json: () => mockResponseJson });
    const navigate = jest.fn();
    instance.props.navigation.navigate = navigate;
    await instance.signIn();
    expect(navigate).toHaveBeenCalledWith('HomeScreen');
  });

  it('shows an error message if username is not entered', () => {
    instance.setState({ userName: '', password: '1234' });
    instance.signIn();
    expect(alert).toHaveBeenCalledWith('Please enter username');
  });

  it('shows an error message if password is not entered', () => {
    instance.setState({ userName: 'test', password: '' });
    instance.signIn();
    expect(alert).toHaveBeenCalledWith('Please enter a password');
  });

  it('shows an error message if login details are incorrect', async () => {
    const mockResponseJson = '-1';
    fetch.mockResolvedValueOnce({ json: () => mockResponseJson });
    instance.setState({ userName: 'test', password: '1234' });
    await instance.signIn();
    expect(alert).toHaveBeenCalledWith('Wrong Login Details');
  });

  it('shows an error message if fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    instance.setState({ userName: 'test', password: '1234' });
    await instance.signIn();
    expect(alert).toHaveBeenCalledWith('incorrect details');
  });
});