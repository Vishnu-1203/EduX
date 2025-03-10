import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
export default function Courses({navigation}) {
  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.container} >
        <TouchableOpacity
          style={styles.courses}
          onPress={() =>
            navigation.navigate('Course1', {courseId: 'Nhz16jWrtUwXvsCN3z4y'})
          }>
          <Image
            source={require('../../../src/assets/dashboard/courses1.png')}
            style={styles.courses1}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.courses}>
          <Image
            source={require('../../../src/assets/dashboard/courses2.png')}
            style={styles.courses2}
            resizeMode="contain"
          />
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
    padding: '1.8%',
    margin: '1%',
    borderRadius: 15,
    height: 250,
    width: 435,
    borderWidth: 2,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerText: {
    fontSize: 25,
  },
  courses1: {
    width: '102%',
  },
  courses2: {
    marginTop: '60%',
    width: '102%',
  },
});
