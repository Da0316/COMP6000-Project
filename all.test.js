import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Login from './screens/login';

describe('Login', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('updates username state on user input', () => {
    const login = renderer.create(<Login />).getInstance();
    login.setState({ userName: '' });
    login.handleUserNameChange('testusername');
    expect(login.state.userName).toEqual('testusername');
  });

  it('updates password state on user input', () => {
    const login = renderer.create(<Login />).getInstance();
    login.setState({ password: '' });
    login.handlePasswordChange('testpassword');
    expect(login.state.password).toEqual('testpassword');
  });

  it('calls signIn function on login button press', () => {
    const navigation = { navigate: jest.fn() };
    const login = renderer.create(<Login navigation={navigation} />).getInstance();
    login.setState({ userName: 'testusername', password: 'testpassword' });
    login.signIn = jest.fn();
    login.forceUpdate();
    const loginButton = login.findByProps({ testID: 'loginButton' });
    loginButton.props.onPress();
    expect(login.signIn).toHaveBeenCalled();
  });
});
