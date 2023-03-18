//chatapp.js - main chatpage
//imports
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

//Main function for the chatapp, navigation as a param
export default function ChatApp(navigation) {
  //setting useStates
  const [currentPage, setCurrentPage] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [myData, setMyData] = useState(null);
  const [jobID, setJobID] = useState(null);
  const [userPostedID, setUserPostedID] = useState(null);

  //if the current page hasn't been set yet
  if (currentPage == null) {
    try {
      //gets the database
      const database = getDatabase();
      //fetch call to get chat information
      fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/chat.php", {
        method: "post",
        header: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        //backend params
        body: JSON.stringify({
          userID: global.userID,
        }),
      })
        .then((response) => response.json())
        .then(async (username) => {
          //finds the user in the firebase
          const user = await findUser(username);
          if (user) {
            //sets data to the user data if the user is found
            setMyData(user);
          } else {
            //creates a new user in the firebase for the user logged in 
            const newUserObj = {
              username: String(username),
              avatar:
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fnobita.me%2Fresources%2Favatar-from-url.86%2F&psig=AOvVaw1HkgvX6GHC1E4KWum1aYA8&ust=1667929212435000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCJDj19POnPsCFQAAAAAdAAAAABAO",
            };

            //sets data to new user information
            set(ref(database, "users/" + username), newUserObj);
            setMyData(newUserObj);
          }
          //gets the friends of the user
          const myUserRef = ref(database, "users/" + username);
          onValue(myUserRef, (snapshot) => {
            const data = snapshot.val();
            setUsers(data.friends);
            setMyData((prevData) => ({
              ...prevData,
              friends: data.friends,
            }));
          });
          //sets the current page to users
          setCurrentPage("users");
        })
        //catches errors
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  //function that handles when user wants to go back a page
  const onBack = () => {
    //if page is on viewUser ot leaveReview, goes back to the chat page
    if (currentPage == "viewUser" || currentPage == "leaveReview") {
      setCurrentPage("chat");
    //if user is on the chatpage, goes back to users page
    } else if (currentPage == "chat") {
      setCurrentPage("users");
    }
  };

  //function that finds the user from the firebase given a username, and returns a snapshot of the user
  const findUser = async (name) => {
    const database = getDatabase();
    const mySnapshot = await get(ref(database, "users/" + name));
    return mySnapshot.val();
  };

  //function that handles when a user clicks on another user, taking the other user as a param
  const onClickUser = (user) => {
    //sets the current page to chat
    setCurrentPage("chat");
    //sets selected user
    setSelectedUser(user);
  };

  //function that sets the page to viewUse
  const viewUser = () => {
    setCurrentPage("viewUser");
  };

  //function that takes the jobID and userPostedID as a param, and sets the variables and changest the page
  const leaveReview = (jobID, userPostedID) => {
    setJobID(jobID);
    setUserPostedID(userPostedID);
    setCurrentPage("leaveReview");
  };

  //function for when a friend is added, 
  const onAddFriend = async (name) => {
    try {
      //gets the database and the user
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

        //creates chatroom
        const newChatroomRef = push(ref(database, "chatrooms"), {
          firstUser: myData.username,
          secondUser: user.username,
          messages: [],
        });

        const newChatroomId = newChatroomRef.key;
        const userFriends = user.friends || [];

        //adds each other to friend list
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
      //catches errors
    } catch (error) {
      console.error(error);
    }
  };

  //switch case that displays component depending on what page its on
  switch (currentPage) {
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
