import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import ViewJob from "../components/ViewJob";
import { SelectList } from "react-native-dropdown-select-list";


const SearchScreen = ({ navigation, route }) => {
  const query = route.params;
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState([]); 

  const [specialities, setSpecialities] = useState([]); 
  const [selectedSpeciality, setSelectedSpeciality] =  useState([]); 
  
  const [filterChoices, setFilterChoices] = useState([
    { key: "1", value: "Most relevant" },
    { key: "2", value: "Price: Low to High" },
    { key: "3", value: "Price: High to Low" },
    { key: "4", value: "Newest" },
    { key: "5", value: "Oldest" },
  ]);


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
        setSpecialities(specialities);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [fetched, setFetched] = useState(true);

    useEffect(() => {
      console.log("Selected speciality:", selectedSpeciality);
      //console.log(setSelectedSpeciality(selectedSpeciality));
    if (fetched && (specialities.length > 0)) {
      initalFetch();
    }
  }, [route, filter, specialities, selectedSpeciality]);

  const sortJobs = () => {
    var array = [
      { id: "1", date: "2023-02-23" },
      { id: "2", date: "Mon Feb  6 17:51:00 2023" },
    ];
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
  // if (!Array.isArray(specialities) || specialities.length === 0) {
  //   console.log(specialities)
  //   console.log("empty")
  // }else{
  //   console.log(specialities)
  //   console.log("notempty")
    
  // }

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <ViewJob key={item.id} ID={item.id} />
    </View>
  );

  const sortBySpeciality = () => {
    //console.log(specialities)
    console.log(selectedSpeciality)
    var par = 5;

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

        //specialityID: specialityID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const ids = [];
        console.log(responseJson.sep);
        for (let i = 0; i < responseJson.length; i++) {
          const formatDateed = formatDate(responseJson[i].posted_date);
          let object = {
            id: responseJson[i].jobID,
            date: formatDateed,
            price: responseJson[i].price,
            //specialityID: responseJson[i].specialityID,
          };
          
          // if (responseJson[i].userID != global.userID) {
          //   ids.push(object);
          // }

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
  };

  const sort = () => {
    
    var par = 0;
    //const specialityID = selectedSpeciality && selectedSpeciality.value;
    //let specialityID = selectedSpeciality ? selectedSpeciality.key : null;
    //console.log(specialityID);
    //const specialityID = selectedSpeciality ? selectedSpeciality.key : null;
    //let specialityID = selectedSpeciality;

    if (filter == "Price: Low to High") {
      par = 1;
    } else if (filter == "Price: High to Low") {
      par = 2;
    } else if (filter == "Newest") {
      par = 3;
    } else if (filter == "Oldest") {
      par = 4;
    }

    // let specialityID = null;
    // if (selectedSpeciality !== null) {
    //   specialityID = selectedSpeciality.value;
    // }
    console.log(par);

    
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

        //specialityID: specialityID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        const ids = [];
        //console.log(responseJson);
        for (let i = 0; i < responseJson.length; i++) {
          const formatDateed = formatDate(responseJson[i].posted_date);
          let object = {
            id: responseJson[i].jobID,
            date: formatDateed,
            price: responseJson[i].price,
            //specialityID: responseJson[i].specialityID,
          };
          
          // if (responseJson[i].userID != global.userID) {
          //   ids.push(object);
          // }

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

  const initalFetch = () => {
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
        // getSpecialities: true,
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

          // if (responseJson[i].userID != global.userID) {
          //   ids.push(object);
          //   console.log(responseJson[i])
          // }

          if (responseJson[i].userID != global.userID && (!selectedSpeciality || responseJson[i].specialityID == selectedSpeciality.key)) {
            ids.push(object);
          }


        }

        // if (responseJson[i].userID != global.userID) {
        //   if (specialityID === null || responseJson[i].specialityID === specialityID){
        //     ids.push(object);
        //   }
        // }

        // if (specialityID !== null) {
        //   const filteredJobs = ids.filter(job => job.specialityID === specialityID);
        //   setJobs(filteredJobs);
        // } else {
        //   setJobs(ids);
        // }


        setJobs(ids);
      })
      .catch((error) => {
        //SystemMessage.out.println(error);
        console.log(error);
        alert(error);
      });

    setFetched(false);
  };

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
