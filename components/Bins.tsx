import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default class Bins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bins: ['Upload Image 1']
    };
  }

  addBin = () => {
    const { bins } = this.state;
    const newBin = `Upload Image ${bins.length + 1}`;
    this.setState({ bins: [...bins, newBin] });
  };

  render() {
    const { bins } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {bins.map((bin, index) => (
          <View key={index} style={styles.bin}>
            <View style={styles.inner}>
              <Text>{bin}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity onPress={this.addBin} style={styles.addButton}>
          <Text>Add Item</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 5,
    paddingBottom: 200,
  },
  bin: {
    width: '48%',
    aspectRatio: 1,
    padding: 5,
    marginBottom: 5,
  },
  inner: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '48%',
    aspectRatio: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    marginBottom: 5, 
  },
});
