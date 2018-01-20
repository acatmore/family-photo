import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Modal, Button, TouchableOpacity } from 'react-native';

export default class App extends React.Component {
  state = {
    modalVisible: false,
  };

  openModal() {
    this.setState({modalVisible:true});
  }
  
  closeModal() {
    this.setState({modalVisible:false});
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Family Photo</Text>
        <Text style={styles.text}> Take a picture!</Text>
        {/* credit later taken from https://www.flaticon.com/free-icon/photo-camera_3901#term=camera&page=1&position=8 */}
        
        <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
          >
            <View style={styles.cameraContainer}>
              <View style={styles.innerContainer}>
                <Text>This is content inside of modal component</Text>
                <Button
                    onPress={() => this.closeModal()}
                    title="Close camera"
                >
                </Button>
              </View>
            </View>
          </Modal>

          <TouchableOpacity onPress={() => this.openModal()}>
            <Image style={styles.icon} source={require('./photo-camera.png')} />
          </TouchableOpacity>

        <Text style={styles.text}> View existing pictures</Text>
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
    padding: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  innerContainer: {
    alignItems: 'center',
  },
});
