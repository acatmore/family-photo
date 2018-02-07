import React from "react";
import {
  Text,
  View,
  List,
  Image,
  Modal,
  Button,
  FlatList,
  TextInput,
  Vibration,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import { Constants, FileSystem, Camera, Permissions } from "expo";
import { StackNavigator } from "react-navigation";
//import PropTypes from "prop-types";
import galleryIcon from "./image-gallery.png";
import cameraIcon from "./photo-camera.png";

const images = {
  galleryIcon,
  cameraIcon
};
const pictureSize = 175;

export class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Welcome"
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Family Photo</Text>
        <Text style={styles.text}> Take a picture!</Text>
        <TouchableOpacity onPress={() => navigate("Camera")}>
          <Image style={styles.icon} source={images.cameraIcon} />
        </TouchableOpacity>

        <Text style={styles.text}> View existing pictures</Text>
        <TouchableOpacity onPress={() => navigate("GroupGallery")}>
          <Image style={styles.icon} source={images.galleryIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

export class CameraScreen extends React.Component {
  state = {
    hasCameraPermission: false,
    permissionsGranted: true,
    type: Camera.Constants.Type.back,
    label: "none",
    folder: "misc.",
    photos: 1,
    autoFocus: "on",
    zoom: 0
  };
  static navigationOptions = {
    title: "Camera"
  };
  //look at expo
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    if (status !== "granted") {
      alert("Hey! You might want to enable your camera for my app");
    }
  }

  toggleFacing() {
    this.setState({
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    });
  }

  takePicture = async () => {
    let photos = this.props.screenProps.database.photos;
    let lastPhoto = photos.length;
    let data;
    if (!this.camera) {
      return;
    }
    if (this.camera) {
      this.camera
        .takePictureAsync()
        .then(_data => {
          // adding to database
          data = _data;
          return this.props.screenProps.addToDatabase({
            photoId: lastPhoto,
            uri: _data.uri,
            label: this.state.label,
            folder: this.state.folder
          });
        })
        .then(() => {
          //creating a picture jpg to read
          return FileSystem.moveAsync({
            from: data.uri,
            to: `${FileSystem.documentDirectory}photos/Photo_${lastPhoto}.jpg`
          });
        })
        .then(() => {
          Vibration.vibrate();
        });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    const { hasCameraPermission } = this.state;
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          autoFocus={this.state.autoFocus}
          type={this.state.type}
          zoom={this.state.zoom}
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent"
            }}
          >
            <TouchableOpacity onPress={this.takePicture.bind(this)}>
              <Text style={styles.cameraButton}>SNAP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleFacing.bind(this)}>
              <Text style={styles.cameraButton}>FLIP</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigate("Preview")}>
            <Text style={styles.cameraButton}>Preview</Text>
          </TouchableOpacity>
        </Camera>
      </View>
    );
  }
}

export class PreviewScreen extends React.Component {
  state = {
    label: "none",
    folder: "main"
  };
  static navigationOptions = {
    title: "Preview"
  };

  updateLabel() {
    let photos = this.props.screenProps.database.photos;
    return this.props.screenProps.updateDatabaseLabel(
      photos.length - 1,
      this.state.label
    );
  }
  updateFolder() {
    let photos = this.props.screenProps.database.photos;
    return this.props.screenProps.updateDatabaseFolder(
      photos.length - 1,
      this.state.folder
    );
  }

  render() {
    let photos = this.props.screenProps.database.photos;
    let lastPhoto = photos.length - 1;
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Would you like to Label your photo?</Text>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={label => this.setState({ label })}
          value={this.state.label}
        />
        <TouchableOpacity onPress={() => this.updateLabel()}>
          <Text style={{ padding: 10, color: "black", fontSize: 30 }}>
            SAVE
          </Text>
        </TouchableOpacity>
        <Text>Would you like to put this in a gallery?</Text>
        <Text>or make a new gallery?</Text>
        <TextInput
          style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
          onChangeText={folder => this.setState({ folder })}
          value={this.state.folder}
        />
        <TouchableOpacity onPress={() => this.updateFolder()}>
          <Text style={{ padding: 10, color: "black", fontSize: 30 }}>
            SAVE
          </Text>
        </TouchableOpacity>
        <Image
          style={{ height: 300, width: 300, marginLeft: 50, marginTop: 50 }}
          source={{
            uri: `${FileSystem.documentDirectory}photos/Photo_${lastPhoto}.jpg`
          }}
        />
      </View>
    );
  }
}

export class GalleryGroupingsScreen extends React.Component {
  static navigationOptions = {
    title: "Gallery"
  };

  render() {
    const { navigate } = this.props.navigation;
    const { database } = this.props.screenProps;
    //get rid of duplicate folders for display mapping
    const uniqueDatabase = [
      ...new Set(database.photos.map(photo => photo.folder))
    ];
    return (
      <View style={styles.container}>
        <ScrollView contentCompentStyle={{ flex: 1 }}>
          {uniqueDatabase.map(folder => (
            <TouchableOpacity key={folder}>
              <Text
                key={folder}
                style={styles.text}
                onPress={photo => navigate("Gallery", { folder: `${folder}` })}
              >
                {folder}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

export class GalleryScreen extends React.Component {
  static navigationOptions = {
    title: "folder"
  };
  render() {
    const { navigate } = this.props.navigation;
    const { database } = this.props.screenProps;
    const currentFolder = this.props.navigation.state.params.folder;
    const gallery = database.photos.filter(
      photo => photo.folder === currentFolder
    );
    return (
      <View style={styles.container}>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {gallery.map(photo => (
              <View style={styles.pictureWrapper} key={photo.photoId}>
                <Text key={photo.label} style={styles.text}>
                  {photo.label}
                </Text>
                <Image
                  key={photo.photoId}
                  style={styles.picture}
                  source={{
                    uri: `${FileSystem.documentDirectory}photos/Photo_${
                      photo.photoId
                    }.jpg`
                  }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export const Routes = StackNavigator({
  Home: { screen: HomeScreen },
  Camera: { screen: CameraScreen },
  Preview: { screen: PreviewScreen },
  GroupGallery: { screen: GalleryGroupingsScreen },
  Gallery: { screen: GalleryScreen }
});
//path: "folder/:folder"
// path: `${this.state.database.photos.folder}`

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  imageContainer: {
    position: "relative",
    bottom: 0
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  text: {
    fontSize: 10,
    padding: 20
  },
  icon: {
    width: 50,
    height: 50,
    padding: 20
  },
  cameraButton: {
    fontSize: 30,
    marginHorizontal: 2,
    color: "white",
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  innerContainer: {
    alignItems: "center"
  },
  pictureText: {
    fontSize: 20,
    position: "absolute"
  },
  pictures: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  picture: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 50,
    top: 0,
    resizeMode: "contain"
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    margin: 5
  }
});
