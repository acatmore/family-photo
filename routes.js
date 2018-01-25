import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    Button,
    TextInput,
    Vibration,
    AsyncStorage,
    TouchableOpacity,
} from 'react-native';
import { Constants, FileSystem, Camera, Permissions } from 'expo';
import Gallery from './gallery';
import { StackNavigator } from 'react-navigation';

const images = {
    galleryIcon: require('./image-gallery.png'),
    cameraIcon: require('./photo-camera.png')
}

export class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome'
    };
    // constructor(props) {
    //   super(props);
    state = {
        hasCameraPermission: null,
        permissionsGranted: false,
    };
    // }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermissions: status === 'granted' });
    }

    componentDidMount() {
        //delete old local files
        // FileSystem.deleteAsync(FileSystem.documentDirectory + 'photos').catch(e => {
        //   console.log(e, 'Directory and files deleted');
        // }),
        FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
            // console.log(e, 'Directory exists');
        });
    }
    previewAndSnap() {

    }

    render() {
        const { navigate } = this.props.navigation;
        //const preview = this.state.previewVisibile ? this.renderPreview() : null;
        //const image = this.state.photoId > 1 ? this.renderLastTakenPicture() : this.renderGalleryIcon();
        //const content = this.state.galleryVisibile ? this.renderGallery() : this.renderGalleryIcon();
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Family Photo</Text>
                <Text style={styles.text}> Take a picture!</Text>
                <TouchableOpacity onPress={() => navigate('Camera')}>
                    <Image style={styles.icon} source={images.cameraIcon} />
                </TouchableOpacity>

                <Text style={styles.text}> View existing pictures</Text>
                <TouchableOpacity onPress={() => navigate('Gallery')}>
                    <Image style={styles.icon} source={images.galleryIcon} />
                </TouchableOpacity>
                <Text style={styles.text}>preview last photo</Text>
                <TouchableOpacity onPress={() => navigate('Preview')}>
                    <Text style={styles.text}>preview</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export class CameraScreen extends React.Component {
    state = {
        hasCameraPermission: null,
        permissionsGranted: false,
        type: Camera.Constants.Type.back,
        //newPhoto: false,
        //gonna have to make photoId be read from last elment in the JSON file
        photoId: 1,
        label: 'none',
        folder: 'main',
        photos: [],
        autoFocus: 'on',
        JSON: '',
    };
    static navigationOptions = {
        title: 'Camera'
    };

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermissions: status === 'granted' });
    }

    takePicture = async function () {
        if (!this.camera) {
            return
        }
        if (this.camera) {
            this.camera.takePictureAsync()
                // .then(data => {
                //   return this.state.JSON = JSON.stringify({
                //     photoId: this.state.photoId,
                //     uri: data.uri,
                //     label: this.state.label,
                //     folder: this.state.folder,
                //   })
                // })
                // .then(data => {
                //   return FileSystem.moveAsync({
                //     from: this.state.JSON,
                //     to: `${FileSystem.documentDirectory}photos/Data_${this.state.photoId}.JSON`,
                //   });
                // })
                .then(data => {
                    return FileSystem.moveAsync({
                        from: data.uri,
                        to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
                    });
                })
                .then(() => {
                    this.setState({
                        photoId: this.state.photoId + 1
                    });
                    Vibration.vibrate();
                });
        }
    };

    render() {
        //const photoTaken = this.state.newPhoto ? renderPreviewForm() : null;
        const { navigate } = this.props.navigation;
        return (
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
                    <TouchableOpacity
                        onPress={() => navigate('Preview')}
                    >
                        <Text style={styles.cameraButton}>Preview</Text>
                    </TouchableOpacity>
                </Camera>
            </View>
        )
    };
}


export class PreviewScreen extends React.Component {
    state = {
        label: 'none',
        folder: 'main',
    }
    static navigationOptions = {
        title: 'Preview'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text>Would you like to Label your photo?</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(label) => this.setState({ label })}
                    value={this.state.label}
                />
                <Text>Would you like to put this in a gallery?</Text>
                {/* list out folders from JSON */}
                <Text>or make a new gallery?</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(folder) => this.setState({ folder })}
                    value={this.state.folder}
                />
                <TouchableOpacity
                    // set newPhoto to false
                    // update JSON file
                    onPress={() => navigate('Gallery')}>
                    <Text style={styles.cameraButton}>SAVE</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export class GalleryScreen extends React.Component {
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

export const Routes = StackNavigator({
    Home: { screen: HomeScreen },
    Gallery: { screen: GalleryScreen },
    Camera: { screen: CameraScreen },
    Preview: { screen: PreviewScreen },
});

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