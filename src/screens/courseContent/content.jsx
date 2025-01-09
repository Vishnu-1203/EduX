import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const CourseContent = ({route, navigation}) => {
  const [courseData, setCourseData] = useState(null); // State for course data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('UI/UX');
        if (storedData) {
          const parsedData = JSON.parse(storedData); // Parse the stored JSON
          setCourseData(parsedData); // Update state with retrieved data
        } else {
          console.log("No data found in AsyncStorage for 'UI/UX'");
        }
      } catch (error) {
        console.error('Error fetching or parsing AsyncStorage data:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []); // Runs only once after the component mounts

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Ensure courseData is available before proceeding
  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text>No course data available.</Text>
      </View>
    );
  }

  const {chapters} = courseData.contents; // Access chapters from retrieved data

  // Render each chapter title
  const renderItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('cardsPage', {
          fullData: courseData.contents, // Passing all chapters' data
          chapterTitle: item.title,
          chapterContent: item.content, // Passing the content of the chapter
          chapterIndex: index, // Passing the index of the chapter
        })
      }>
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={()=>navigation.goBack()}>
        <Image
          source={require('../../../src/assets/dashboard/backbutton.png')}
          style={styles.backButton}
          resizeMode="contain"
          aspectRatio={1}
        />
      </TouchableOpacity>
      <Image
        source={require('../../../src/assets/dashboard/coursefirst.png')}
        style={styles.coursefirst}
        resizeMode="contain"
      />
      <Text style={styles.title}>Course Content</Text>
      <FlatList
        data={chapters} // Rendering chapters
        renderItem={renderItem}
        keyExtractor={item => (item.id ? item.id.toString() : item.title)} // Ensure key is unique
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0E0325',
  },
  card: {
    backgroundColor: '#0E0325',
    padding: 16,
    borderWidth: 3,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#7979B2',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 10,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#7979B2',
    paddingTop: 35,
    paddingBottom: 35,
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'lightgrey',
  },
  coursefirst: {
    width: '100%',
    marginBottom: '-29%',
    marginTop: '-15%',
  },
  backButton: {
    position: 'absolute',
    zIndex: 1,
    top: '3.5%',
    left: '5%',
    width: 40,
    height: 40,
  },
});

export default CourseContent;
