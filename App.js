import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Family Photo</Text>
        <Text style={styles.text}> Take a picture!</Text>
        {/* credit later taken from https://www.flaticon.com/free-icon/photo-camera_3901#term=camera&page=1&position=8 */}
        <Image style={styles.icon} source={require('./photo-camera.png')} />
        <Text style={styles.text}> View existing pictures</Text>
        {/* <View style={styles.container}>
          <Text style={styles.container}>My Family</Text>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
