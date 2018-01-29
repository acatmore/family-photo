import React, { Component } from "react";
import { Routes } from "./routes";
import { View } from "react-native";
import { StackNavigator } from "react-navigation";
import { Constants, FileSystem, Camera, Permissions } from "expo";

const database = FileSystem.documentDirectory + "photos/database.json";

export default class App extends Component {
  state = {
    database: null
  };
  componentDidMount() {
    //delete old local files
    // FileSystem.deleteAsync(FileSystem.documentDirectory + 'photos').catch(e => {
    //   console.log(e, 'Directory and files deleted');
    // });
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "photos")
      .catch(e => {
        // console.log(e, 'Directory exists');
      })
      .then(() => {
        return FileSystem.getInfoAsync(database);
      })
      .then(details => {
        if (!details.exists) {
          return FileSystem.writeAsStringAsync(
            database,
            JSON.stringify({ photos: [] })
          );
        }
      })
      .then(() => {
        return FileSystem.readAsStringAsync(database);
      })
      .then(jsonString => {
        const data = JSON.parse(jsonString);
        this.setState({
          database: data
        });
      });
  }

  addToDatabase(photo) {
    this.setState({
      database: {
        ...this.state.database,
        photos: [...this.state.database.photos, photo]
      }
    });
    return this.saveToDatabase();
  }
  updateDatabaseLabel(id, label) {
    this.setState({
      database: {
        ...this.state.database,
        photos: this.state.database.photos.map(photo => {
          console.log(photo);
          if (photo.photoId !== id) {
            return photo;
          }
          return {
            ...photo,
            label: label
          };
        })
      }
    });
    setTimeout(() => {
      this.saveToDatabase();
    }, 100);
    return this.saveToDatabase();
  }

  updateDatabaseFolder(id, folder) {
    this.setState({
      database: {
        ...this.state.database,
        photos: this.state.database.photos.map(photo => {
          console.log(photo);
          if (photo.photoId !== id) {
            return photo;
          }
          return {
            ...photo,
            folder: folder
          };
        })
      }
    });
    setTimeout(() => {
      this.saveToDatabase();
    }, 100);
    return this.saveToDatabase();
  }

  saveToDatabase() {
    return FileSystem.writeAsStringAsync(
      database,
      JSON.stringify(this.state.database)
    );
  }

  render() {
    //console.log(this.props.database.photos[1].folder);
    if (!this.state.database) {
      return <View />;
    }
    return (
      <Routes
        screenProps={{
          database: this.state.database,
          addToDatabase: this.addToDatabase.bind(this),
          updateDatabaseLabel: this.updateDatabaseLabel.bind(this),
          updateDatabaseFolder: this.updateDatabaseFolder.bind(this)
        }}
      />
    );
  }
}
