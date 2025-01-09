import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
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
          <Image
            source={require('../../src/assets/dashboard/courses.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setComponent(<Profile navigation={navigation} />);
          }}
          style={styles.navItem}>
          <Image
            source={require('../../src/assets/dashboard/profile.png')}
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setComponent(<Settings navigation={navigation} />);
          }}
          style={styles.navItem}>
          <Image
            source={require('../../src/assets/dashboard/settings.png')}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0325',
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
    backgroundColor: '#0E0325',
    paddingVertical: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: -2,
    marginLeft: -2,
    marginRight: -2,
    shadowColor: '#7979B2',
    shadowOffset: {width: 0, height: -20},
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 100,
    borderWidth: 2,
    borderColor: '#7979B2',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  navText: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: 72,
    height: 72,
    color: 'white',
  },
});
