import React, {useState} from 'react';
import Chat from './Chat';
import Login from './Login';
import Users from './Users';
import {getDatabase, get, ref, set, onValue, update, push} from 'firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatApp(){
    const [currentPage, setCurrentPage] = useState('login');
    const [username, setUsername] = useState(null);
    const [users, setUsers] = useState([]);
    const [userToAdd, setUserToAdd] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [myData, setMyData] = useState(null);
    const [userID, setUserID] = useState(null);
    const getUserID  = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@userID')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (error) {
          alert(error);
        }
      }

    const onLogin = async () => {
        console.log(getUserID());
        try {
            const database = getDatabase();
            /*fetch('http://192.168.1.123/chat.php', { //needs to be changed to your own ip
          method: 'post',
          header: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            // we will pass our input data to server
            userID: getUserID(),
          }),
        })
          .then((response) => response.text())
          .then((responseJson) => {
            alert(responseJson)
          })
          .catch((error) => {
            console.error(error);
          });*/
            const user  = await findUser(username);

            if (user){
                setMyData(user);
            } else {
                const newUserObj = {
                    username: username, 
                    avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fnobita.me%2Fresources%2Favatar-from-url.86%2F&psig=AOvVaw1HkgvX6GHC1E4KWum1aYA8&ust=1667929212435000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDj19POnPsCFQAAAAAdAAAAABAO'
                };

                set(ref(database, 'users/' + username), newUserObj)
                setMyData(newUserObj)
            }
            const myUserRef = ref(database, 'users/' + username);
            onValue(myUserRef, snapshot => {
                const data = snapshot.val();
                setUsers(data.friends);
                setMyData(prevData => ({
                    ...prevData,
                    friends:data.friends,
                }));
            });
            setCurrentPage('users');
        } catch (error) {
            console.error(error);
        }
    };

    const onBack = () => {
        setCurrentPage('users');
    }

    const findUser = async name => {
        const database = getDatabase();
        const mySnapshot = await get(ref(database, 'users/' + name));
        return mySnapshot.val();
    };
    const onClickUser = user => {
        setCurrentPage('chat');
        setSelectedUser(user);
    };

    const onAddFriend = async name => {
        try {
            const database = getDatabase();
            const user = await findUser(name);
            if (user){
                if (user.username == myData.username){
                    console.log("ll");
                    return;
                }
                if (myData.friends && myData.friends.findIndex(f=>f.username === user.username) > 0) {
                    return;
                }
                const newChatroomRef = push(ref(database, 'chatrooms'), {
                    firstUser: myData.username,
                    secondUser: user.username,
                    messages: [],
                });

                const newChatroomId = newChatroomRef.key;
                const userFriends = user.friends || [];

                update(ref(database, 'users/' + user.username), {
                    friends: [
                        ...userFriends,
                        {
                            username: myData.username,
                            avatar: myData.avatar,
                            chatroomId: newChatroomId,
                        },
                    ],
                });

                const myFriends = myData.friends || [];

                update(ref(database, 'users/' + myData.username), {
                    friends: [
                        ...myFriends,
                        {
                            username: user.username,
                            avatar: user.avatar,
                            chatroomId: newChatroomId,
                        },
                    ],
                });
            }   
        } catch (error) {
            console.error(error);
        }
    };

    switch (currentPage) {
        case 'login':
            return (
                <Login
                    onLogin={onLogin}
                    username={username}
                    setUsername={setUsername}
                />
            );
        case 'users':
            return (
                <Users
                    users={users}
                    onClickUser={onClickUser}
                    userToAdd={userToAdd}
                    setUserToAdd={setUserToAdd}
                    onAddFriend={onAddFriend}
                />
            );
        case 'chat':
            return (
                <Chat myData={myData} selectedUser={selectedUser} onBack={onBack} />
            );
        default:
            return null;
    }
}