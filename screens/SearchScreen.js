//signUp.js - page for the sign up screen so users can create accounts
//@author - ajs215

import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import ViewJob from "../components/ViewJob";
import { SelectList } from "react-native-dropdown-select-list";

//main function for the search screen, has navigation to navigate back to the homescreen and route to pass the search paramter.
const SearchScreen = ({ navigation, route }) => {
  const query = route.params; //the variable query is set to the route paramters, which is the search input from the user
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState([]); 

  const [specialities, setSpecialities] = useState([]); 
  const [selectedSpeciality, setSelectedSpeciality] =  useState([]); 

  //array for the filter options
  const [filterChoices, setFilterChoices] = useState([
    { key: "1", value: "Most relevant" },
    { key: "2", value: "Price: Low to High" },
    { key: "3", value: "Price: High to Low" },
    { key: "4", value: "Newest" },
    { key: "5", value: "Oldest" },
  ]);

  //fetch to fetch the specialities so that we can sort by specific specialities 
  useEffect(() => {
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/specialities.php")
      .then((response) => response.json())
      .then(data => {
        const specialities = data.reduce((acc, cur, i) => {
          if (i % 2 === 0) {
            acc.push({
              key: cur,
              value: data[i + 1],
            });
          }
          return acc;
        }, []);
        setSpecialities(specialities); //saves the specialities in ann array
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [fetched, setFetched] = useState(true); //sets fetched to true once the sepecialities have been retrived

    useEffect(() => {
    if (fetched && (specialities.length > 0)) {
      initalFetch(); // if the specialities have been retrived then this fetch is preformed, fetching the jobs reltated to the search query
    }
  }, [route, filter, specialities, selectedSpeciality]);

  //function sortJobs - sorts the jobs based on the filter
  const sortJobs = () => {
    
    //switch case to sort the jobs based on which option in the filter is selcted 
    switch (filter) {
      case "Price: Low to High":
        setJobs(jobs.sort((a, b) => a.price - b.price));
        break;
      case "Price: High to Low":
        setJobs(jobs.sort((a, b) => b.price - a.price));
        break;
      case "Newest":
        setJobs(jobs.sort((a, b) => new Date(b.date) - new Date(a.date)));
        break;
      case "Oldest":
        setJobs(jobs.sort((a, b) => new Date(a.date) - new Date(b.date)));
        break;
      default:
        setJobs(jobs);  
        sort();
    }
  };
  
  //function renderItem renders the jobs on the page
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ViewJob key={item.id} ID={item.id} />
    </View>
  );

  //function sortBySpeciality sorts the jobs based on the speciality filter
  const sortBySpeciality = () => {
    
    var par = 5; //variable to pass to php script to indicate which case it needs to call

    //below is the fetch call to retrive the jobs sorted by speciality
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/search.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchInput: query,
        id: global.userID,
        filter: par,
        specialityID: selectedSpeciality,

      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const ids = [];//array ids delceared to store objects for jobs
        //console.log(responseJson.sep);
        //loops through the return array
        for (let i = 0; i < responseJson.length; i++) {
          const formatDateed = formatDate(responseJson[i].posted_date);//formates the date for our date sorter 
          let object = { //creates an object of all the data we return
            id: responseJson[i].jobID,
            date: formatDateed,
            price: responseJson[i].price,
          };

            //if statement to make sure the jobs arent from the user that is logged in
            if (responseJson[i].userID != global.userID && (!selectedSpeciality || responseJson[i].specialityID == selectedSpeciality.key)) {
                ids.push(object);
              }
        }
        setJobs(ids); //sets the jobs array, with the array of objects we have just created, ids
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    par = 0;
  };

  //function sort to sort the jobs by the filter
  const sort = () => {
    
    var par = 0;
    

    if (filter == "Price: Low to High") {
      par = 1;
    } else if (filter == "Price: High to Low") {
      par = 2;
    } else if (filter == "Newest") {
      par = 3;
    } else if (filter == "Oldest") {
      par = 4;
    }

    
    console.log(par);

    //fetch does the same thing as the fetch above, to re fetch the jobs based on the filter
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/search.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchInput: query,
        id: global.userID,
        filter: par,
        specialityID: selectedSpeciality,

        
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const ids = [];
        
        for (let i = 0; i < responseJson.length; i++) {
          const formatDateed = formatDate(responseJson[i].posted_date);
          let object = {
            id: responseJson[i].jobID,
            date: formatDateed,
            price: responseJson[i].price,
          };

            if (responseJson[i].userID != global.userID && (!selectedSpeciality || responseJson[i].specialityID == selectedSpeciality.key)) {
                ids.push(object);
              }
        }
        setJobs(ids);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    par = 0;
    //console.log(filter);
  };

  //function inital fetch, fetches the jobs to display on the screen when the search is first perfomred, displayed in the deafult filter
  const initalFetch = () => {

    //fetch the same as the one commented above
    fetch("https://raptor.kent.ac.uk/proj/comp6000/project/08/search.php", {
      method: "post",
      header: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchInput: query,
        id: global.userID,
        filter: 0,
        specialityID: selectedSpeciality,
        
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const ids = [];

        for (let i = 0; i < responseJson.length; i++) {
          const formatDateed = formatDate(responseJson[i].posted_date);
          let object = {
            id: responseJson[i].jobID,
            date: formatDateed,
            price: responseJson[i].price,
            specialityID: responseJson[i].specialityID,
          };

          if (responseJson[i].userID != global.userID && (!selectedSpeciality || responseJson[i].specialityID == selectedSpeciality.key)) {
            ids.push(object);
          }


        }
        setJobs(ids);
      })
      .catch((error) => {
        
        console.log(error);
        alert(error);
      });

    setFetched(false);
  };

  //function formateDate, formats the date in line for our sorting by date filter
  function formatDate(dateString) {
    const date = new Date(dateString.replace(/-/g, "/"));
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  }

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 5 }}>
        <Text style={styles.title}> Results for: "{query}" </Text>
        <View style={{flexDirection:"row",alignItems:"center",  alignSelf:"center"}}>
        <SelectList
          data={filterChoices}
          save="value"
          placeholder="Sort"
          searchPlaceholder="sort by"
          label="Sort by"
          onSelect={() => sort()}
          style={styles.sortBox}
          boxStyles={{
            alignSelf:"center",
            borderRadius: 15,
            marginHorizontal: 5,
            backgroundColor: "#EBEBEB",
            borderWidth: 1.5,
          }}
          dropdownStyles={{ borderRadius: 15, marginHorizontal: 5 }}
          setSelected={(val) => setSelectedSpeciality(val)}
        />
        
        <SelectList
          data={specialities}
          placeholder="Filter"
          save="key"
          searchPlaceholder="Filter specialities"
          label="specialities"
          //onSelect={(value) => setSelectedSpeciality(value)}
          onSelect={() => sortBySpeciality()}
          style={styles.sortBox}
          boxStyles={{
            borderRadius: 15,
            marginHorizontal: 5,
            backgroundColor: "#EBEBEB",
            borderWidth: 1.5,
          }}
          dropdownStyles={{ borderRadius: 15, marginHorizontal: 10 }}
          setSelected={(val) => setSelectedSpeciality(val)}
          //renderItem={(item, index) => ({ label: item, value: index })}
        
        />
        
        </View>

        
      </View>
      <FlatList
        data={jobs}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    marginVertical: 5,
    backgroundColor: "fff",
  },
  upperView: {
    width: "100%",
    height: "22%",
    backgroundColor: "#f9ce40",
    borderBottomRightRadius: 45,
    borderBottomLeftRadius: 45,
    elevation: 10,
  },
  bottomView: {
    width: "100%",
    height: "78%",
    marginBottom: 20,
  },
  header: {
    justifyContent: "center",
    paddingLeft: 20,
    fontSize: 16,
    paddingVertical: 5,
    paddingTop: 8,
  },
  sortBox: {
    //flexGrow: 1,
    //alignSelf: "flex-end",
    justifyContent:"space-evenly",
    marginVertical: 8,
    borderColor: "#f9ce40",
  },

  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  Button: {
    backgroundColor: "green",
    borderRadius: 25,
    width: 80,
    marginLeft: 10,
    mardinRight: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  items: {},
  ScrollView: {
    margin: 5,
  },
  gridContainer: {
    padding: 5,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
  },
});
