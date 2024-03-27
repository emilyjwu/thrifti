import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'


export default class ListingScreen extends Component {
  render() {
    return (
      <ScrollView>
        <Text> See Listing Component! </Text>
        <View style={styles.bottomBar}>
          <Text>Bottom Bar</Text>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  bottomBar: {
    height: 50, 
    backgroundColor: 'black', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});