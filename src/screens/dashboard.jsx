import React, {useState} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import Profile from './dashboardComponents/profile';
import Courses from './dashboardComponents/courses';
import Settings from './dashboardComponents/settings';
import {handleLogout} from '../utils/loginfunctions';

export default function Dashboard({navigation}) {
  const [component, setComponent] = useState(<Profile />);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>{component}</View>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          onPress={() => {
            setComponent(<Courses navigation={navigation} />);
          }}
          style={styles.navItem}>
          <Text style={styles.navText}>Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setComponent(<Profile navigation={navigation} />);
          }}
          style={styles.navItem}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setComponent(<Settings navigation={navigation} />);
          }}
          style={styles.navItem}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 15,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navText: {
    color: '#fff',
    fontSize: 18,
  },
});
