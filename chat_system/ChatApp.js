import React, { useState } from "react";
import Chat from "./Chat";
import Login from "./Login";
import Users from "./Users";
import ViewUser from "./ViewUser";
import LeaveReview from "./LeaveReview";
import {
  getDatabase,
  get,
  ref,
  set,
  onValue,
  update,
  push,
} from "firebase/database";

export default function ChatApp(navigation) {
  const [currentPage, setCurrentPage] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [myData, setMyData] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [userPostedID, setUserPostedID] = useState(null);
  if (currentPage == null) {
    try {
      const database = getDatabase();
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/chat.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userID: global.userID,
        }),
      })
        .then((response) => response.json())
        .then(async (username) => {
          const user = await findUser(username);
          if (user) {
            setMyData(user);
          } else {
            const newUserObj = {
              username: String(username),
              avatar:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fnobita.me%2Fresources%2Favatar-from-url.86%2F&psig=AOvVaw1HkgvX6GHC1E4KWum1aYA8&ust=1667929212435000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDj19POnPsCFQAAAAAdAAAAABAO",
            };

            set(ref(database, "users/" + username), newUserObj);
            setMyData(newUserObj);
          }
          const myUserRef = ref(database, "users/" + username);
          onValue(myUserRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data.friends);
            setMyData((prevData) => ({
              ...prevData,
              friends: data.friends,
            }));
          });
          setCurrentPage("users");
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const onBack = () => {
    if (currentPage == "viewUser" || currentPage == "leaveReview") {
      setCurrentPage("chat");
    } else if (currentPage == "chat") {
      setCurrentPage("users");
    }
  };

  const findUser = async (name) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, "users/" + name));
    return mySnapshot.val();
  };

  const onClickUser = (user) => {
    setCurrentPage("chat");
    setSelectedUser(user);
  };

  const viewUser = () => {
    setCurrentPage("viewUser");
  };

  const leaveReview = (jobID, userPostedID) => {
    setJobID(jobID);
    setUserPostedID(userPostedID);
    setCurrentPage("leaveReview");
  };

  const onAddFriend = async (name) => {
    try {
      const database = getDatabase();
      const user = await findUser(name);
      if (user) {
        if (user.username == myData.username) {
          return;
        }
        if (
          myData.friends &&
          myData.friends.findIndex((f) => f.username === user.username) > 0
        ) {
          return;
        }
        const newChatroomRef = push(ref(database, "chatrooms"), {
          firstUser: myData.username,
          secondUser: user.username,
          messages: [],
        });

        const newChatroomId = newChatroomRef.key;
        const userFriends = user.friends || [];

        update(ref(database, "users/" + user.username), {
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

        update(ref(database, "users/" + myData.username), {
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
    case "login":
      return (
        <Login
          onLogin={onLogin}
          username={username}
          setUsername={setUsername}
        />
      );
    case "users":
      return (
        <Users
          users={users}
          onClickUser={onClickUser}
          userToAdd={userToAdd}
          setUserToAdd={setUserToAdd}
          onAddFriend={onAddFriend}
        />
      );
    case "chat":
      return (
        <Chat
          myData={myData}
          selectedUser={selectedUser}
          onBack={onBack}
          viewUser={viewUser}
          leaveReview={leaveReview}
        />
      );
    case "viewUser":
      return <ViewUser selectedUser={selectedUser} onBack={onBack}></ViewUser>;
    case "leaveReview":
      return (
        <LeaveReview
          jobID={jobID}
          userPostedID={userPostedID}
          onBack={onBack}
        ></LeaveReview>
      );
    default:
      return null;
  }
}
