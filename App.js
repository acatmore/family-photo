import React, { Component } from 'react';
// import Camera from './views/camera';
// import CameraModal from './views/cameraModal';
// import Index from './views/index';
import Gallery from './gallery';

import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Button,
  Vibration,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
import { Constants, FileSystem, Camera, Permissions } from 'expo';

export default class App extends Component {
  // constructor(props) {
  //   super(props);
  state = {
    cameraVisible: false,
    galleryVisibile: false,
    hasCameraPermission: null,
    permissionsGranted: false,
    type: Camera.Constants.Type.back,
    showGallery: false,
    galleryId: 0,
    photoId: 1,
    photos: [],
    autoFocus: 'off',
  };
  // }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermissions: status === 'granted' });
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

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  openCamera() {
    this.setState({ cameraVisible: true });
  }

  closeCamera() {
    this.setState({ cameraVisible: false });
  }

  // openGallery() {
  //   this.setState({ galleryVisibile: true });
  // }

  // closeGallery() {
  //   this.setState({ galleryVisibile: false })
  // }

  // renderGallery() {
  //   return <Gallery onPress={this.toggleView.bind(this)} />;
  // }



  render() {

    // const showGallery = this.state.showGallery
    //   ? this.renderGallery()
    //   : this. 

    // const cameraScreenContent = this.state.permissionsGranted
    //   ? this.renderCamera()
    //   : this.renderNoPermissions();
    // const content = this.state.showGallery ? this.renderGallery() : cameraScreenContent;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Family Photo</Text>
        <Text style={styles.text}> Take a picture!</Text>
        {/* credit later taken from https://www.flaticon.com/free-icon/photo-camera_3901#term=camera&page=1&position=8 */}

        <Modal
          visible={this.state.cameraVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeCamera()}
        >
          <View style={styles.cameraContainer}>
            <Camera ref={ref => {
              this.camera = ref;
            }}
              autoFocus={this.state.autoFocus}
              type={this.state.type}
              style={{
                flex: 1,
              }} style={{ flex: 1 }} type={this.state.type}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                }}>
                <TouchableOpacity
                  onPress={this.takePicture.bind(this)}
                >
                  <Text style={styles.cameraButton}>SNAP</Text>
                </TouchableOpacity>
              </View>
            </Camera>
            {/* <View style={styles.container}>{content}</View>; */}
          </View>

          <TouchableOpacity
            onPress={() => this.closeCamera()}
          >
            <Text style={styles.cameraButton}>Close Camera</Text>
          </TouchableOpacity>
        </Modal>

        <TouchableOpacity onPress={() => this.openCamera()}>
          <Image style={styles.icon} source={require('./photo-camera.png')} />
        </TouchableOpacity>

        <Text style={styles.text}> View existing pictures</Text>

        {/* <TouchableOpacity onPress={() => this.openGallery()}> */}
        <Image style={styles.icon} source={require('./image-gallery.png')} />
        <Gallery></Gallery>
        {/* </TouchableOpacity> */}

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
  cameraButton: {
    fontSize: 30,
    marginHorizontal: 2,
    color: 'white',
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
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
