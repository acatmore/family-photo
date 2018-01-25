import React, { Component } from 'react';
import {
  Routes,
  HomeScreen,
  CameraScreen,
  PreviewScreen,
  GalleryScreen
} from './routes';
import Gallery from './gallery';
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
import { StackNavigator } from 'react-navigation';

export default class App extends Component {
  render() {
    return (
      <Routes />
    );
  }
}

