import React, { Component } from 'react';
// import Camera from './views/camera';
// import CameraModal from './views/cameraModal';
// import Index from './views/index';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Button,
  Vibration,
  TouchableOpacity,
} from 'react-native';
import { Constants, FileSystem, Camera, Permissions } from 'expo';

export default class App extends Component {
  state = {
    modalVisible: false,
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photoId: 1,
    photos: [],
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  componentDidMount() {
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  takePicture = async function () {
    if (this.camera) {
      this.camera.takePictureAsync().then(data => {
        FileSystem.moveAsync({
          from: data.uri,
          to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
        }).then(() => {
          this.setState({
            photoId: this.state.photoId + 1,
          });
          Vibration.vibrate();
        });
      });
    }
  };

  openModal() {
    this.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
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
              {/* <View style={styles.innerContainer}> */}
              <Camera ref={ref => {
                this.camera = ref;
              }}
                style={{
                  flex: 1,
                }} style={{ flex: 1 }} type={this.state.type}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                  }}>
                  <Button
                    style={{
                      flex: 0.1,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                    }}
                    onPress={this.takePicture.bind(this)}
                    title="SNAP">
                    {/* <Text style={{ fontSize: 30, color: 'white', margin: 10 }}>
                        {' '}SNAP{' '}
                      </Text> */}
                  </Button>
                  {/* <TouchableOpacity
                      style={{
                        flex: 0.1,
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        this.setState({
                          type: this.state.type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back,
                        });
                      }}>
                      <Text
                        style={{ fontSize: 30, marginBottom: 10, color: 'white' }}>
                        {' '}Flip{' '}
                      </Text>
                    </TouchableOpacity> */}
                </View>
              </Camera>
              <Button
                onPress={() => this.closeModal()}
                style={{ fontSize: 30, fex: 1, marginTop: 50, color: 'white' }}
                title="Close camera"
              >
              </Button>
              {/* </View> */}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  innerContainer: {
    alignItems: 'center',
  },
});
