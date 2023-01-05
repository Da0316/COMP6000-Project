import {useState, useEffect} from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import Constants from 'expo-constants';
//import CheckBox from '@react-native-community/checkbox';
import {Card, Checkbox} from 'react-native-paper';

export default SelectSpecialities = ({route, navigation}) => {
  const [options, setOptions] = useState([]);
  const {userID} = route.params;

  useEffect(() => {
    fetch('https://raptor.kent.ac.uk/proj/comp6000/project/08/specialities.php', {
      method: 'post',
      header: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let counter = 0;
        const newOptions = [];
        for (let i = 0; i < responseJson.length / 2; i++) {
          let object = {
            id: Number(responseJson[counter]),
            speciality: responseJson[counter + 1],
            checked: false,
          };
          newOptions.push(object);
          counter = counter + 2;
        }
        setOptions(newOptions);
      })
      .catch((error) => {
        // alert(error);
      });
  }, []);

  const handleChange = (id) => {
    const temp = options.map((option) => {
      if (id === option.id) {
        return {...option, checked: !option.checked};
      }
      return option;
    });
    setOptions(temp);
  };

  let selected = options.filter((option) => option.checked);

  const renderList = (renderData) => {
    return (
      <FlatList
        data={renderData}
        renderItem={({item}) => (
          <Card style={{margin: 5}}>
            <View style={styles.card}>
		        <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <Checkbox
                  status={item.checked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    handleChange(item.id);
                  }}
                />
                <Text>{item.speciality}</Text>
              </View>
            </View>
          </Card>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>{renderList(options)}</View>
      <Text style={styles.text}>Selected</Text>
      <View style={{flex: 1}}>{renderList(selected)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },

  card: {
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
