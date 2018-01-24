import React from 'react';
import Expo from 'expo';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

const HomeScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
            onPress={() => navigation.navigate('Gallery')}
            title="Go to Gallery"
        />
    </View>
);

const GalleryScreen = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Gallery Screen</Text>
    </View>
);

const RootNavigator = StackNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            headerTitle: 'Home',
        },
    },
    Gallery: {
        screen: GalleryScreen,
        navigationOptions: {
            headerTitle: 'Gallery',
        },
    },
});

export default RootNavigator;