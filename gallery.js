import React from "react";
import {
  Text,
  List,
  View,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { FileSystem } from "expo";

const pictureSize = 150;

export default class Gallery extends React.Component {
  state = {
    images: {},
    photos: [],
    photoData: this.props.screenProps.database.photos,
    folders: [],
    labels: []
  };
  //this.props.screenProps.database.photos
  componentDidMount() {
    FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "photos").then(
      photos => {
        this.setState({
          photos
        });
      }
    );
  }
  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos/data.JSON')
  // .then(data => {
  //   this.setState({
  //     data,
  //   })
  // });
  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentComponentStyle={{ flex: 1 }}>
          <View style={styles.pictures}>
            {this.state.photos.map(photoUri => (
              <View style={styles.pictureWrapper} key={photoUri}>
                <Image
                  key={photoUri}
                  style={styles.picture}
                  source={{
                    uri: `${FileSystem.documentDirectory}photos/${photoUri}`
                  }}
                />
              </View>
            ))}
            <List>
              <FlatList
                data={this.state.photoData}
                renderItem={({ item }) => (
                  <listItem
                    roundAvatar
                    title={`${item.photoId}`}
                    subtitle={`${item.label}`}
                    avatar={{ uri: item.uri }}
                  />
                )}
              />
            </List>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
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
    left: 0,
    top: 0,
    resizeMode: "contain"
  },
  pictureWrapper: {
    width: pictureSize,
    height: pictureSize,
    margin: 5
  }
});
