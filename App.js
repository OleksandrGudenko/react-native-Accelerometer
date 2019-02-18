import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import AccelerometerSensor from './Accelerometer';

export default class App extends React.Component {
  render() {
    return (
        <View style={styles.container}>
            <AccelerometerSensor />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: "center"
  },
});
