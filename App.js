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
import { StackNavigator } from 'react-navigation';

const images = {
  galleryIcon: require('./image-gallery.png'),
  cameraIcon: require('./photo-camera.png')
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome'
  };
  // constructor(props) {
  //   super(props);
  state = {
    cameraVisible: false,
    galleryVisibile: false,
    previewVisibile: false,
    hasCameraPermission: null,
    permissionsGranted: false,
    type: Camera.Constants.Type.back,
    photoId: 1,
    photos: [],
    autoFocus: 'on',
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
      this.camera.takePictureAsync()
        .then(data => {
          //before the move, preview screen pops up
          //ask for title and save
          FileSystem.moveAsync({
            from: data.uri,
            to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
          }).then(() => {
            this.setState({
              photoId: this.state.photoId + 1
            });
            Vibration.vibrate();
          }).then(this.printImageUri(data.uri))
            .catch(err => console.error("error: " + err));
        });
    }
  };

  deleteAllGallery = async function () {
    FileSystem.deleteAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory and files deleted');
    })
  };

  printImageUri(imagePath) {
    console.log(imagePath)
  }

  toggleCamera() {
    this.setState({ cameraVisible: !this.state.cameraVisible });
  }

  renderGallery() {
    return
    <Gallery />;
  }
  renderGalleryIcon() {
    return <Image style={styles.icon} source={images.galleryIcon} />;
  }

  renderLastTakenPicture() {
    return
    <Image
      style={styles.icon}
      source={{
        uri: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`
      }} />;
  }
  render() {
    const { navigate } = this.props.navigation;
    //const preview = this.state.previewVisibile ? this.renderPreview() : null;
    const image = this.state.photoId > 1 ? this.renderLastTakenPicture() : this.renderGalleryIcon();
    const content = this.state.galleryVisibile ? this.renderGallery() : this.renderGalleryIcon();
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Family Photo</Text>
        <Text style={styles.text}> Take a picture!</Text>
        {/* credit later taken from https://www.flaticon.com/free-icon/photo-camera_3901#term=camera&page=1&position=8 */}

        <Modal
          visible={this.state.cameraVisible}
          animationType={'slide'}
          onRequestClose={() => this.toggleCamera()}
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
                  onPress={
                    this.takePicture.bind(this)}
                >
                  <Text style={styles.cameraButton}>SNAP</Text>
                </TouchableOpacity>
                {/* <View> {preview} </View> */}
              </View>
              <TouchableOpacity
                onPress={() => this.toggleCamera()}
              >
                <Text style={styles.cameraButton}>Close Camera</Text>
              </TouchableOpacity>
            </Camera>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => this.toggleCamera()}>
          <Image style={styles.icon} source={images.cameraIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => this.deleteAllGallery.bind(this)}>
          <Text style={styles.text}> delete directory</Text>
        </TouchableOpacity> */}
        {/* <Text style={styles.text}> last taken photo </Text> */}
        <Text style={styles.text}> View existing pictures</Text>
        <TouchableOpacity onPress={() => navigate('Gallery')}>
          <Image style={styles.icon} source={images.galleryIcon} />
          {/* <View style={styles.imageContainer}>{content}</View> */}
        </TouchableOpacity>
      </View>
    );
  }
}

class GalleryScreen extends React.Component {
  static navigationOptions = {
    title: 'Gallery'
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Gallery />
    );
  }
}

export const Home = StackNavigator({
  Home: { screen: HomeScreen },
  Gallery: { screen: GalleryScreen },
});

export default class App extends Component {

  // renderPreview() {
  //   <View>
  //     {/* <Text>Label it?</Text> */}
  //     <Image
  //       style={styles.icon}
  //       source={{
  //         uri: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`
  //       }} />
  //   </View>;
  // }

  // renderNoPermissions() {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
  //       <Text style={{ color: 'black' }}>
  //         Camera permissions not granted - cannot open camera preview.
  //       </Text>
  //     </View>
  //   );
  // }

  render() {
    return (
      <Home />
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    bottom: 0,
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
    padding: 20,
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
