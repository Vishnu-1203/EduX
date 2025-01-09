import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
export default function Courses({navigation}) {
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.container} s>
        <TouchableOpacity
          style={styles.courses}
          onPress={() =>
            navigation.navigate('Course1', {courseId: 'Nhz16jWrtUwXvsCN3z4y'})
          }>
          <Text style={styles.innerText}>UI/UX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courses}>
          <Text style={styles.innerText}>Course 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.courses}>
          <Text style={styles.innerText}>Course 3</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 100,
  },

  courses: {
    padding: '2%',
    margin: '1%',
    backgroundColor: 'white',
    borderRadius: 15,
    height: 250,
    width: 435,
    borderWidth: 2,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerText: {
    fontSize: 25,
  },
});
