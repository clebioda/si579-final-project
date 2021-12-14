import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

const LetterButton = (props) => {
  console.log('Rendering Child Item')
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.item, props.type == 1 && styles.number,
    props.type == 2 && styles.consonant, props.type == 3 && styles.vowel, props.type == 4 && styles.punctuation,
    props.type == 5 && styles.functional]}>
        <Text style={styles.text}>{props.letter}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex: 1,
    backgroundColor: 'white',
    color: 'white',
    margin: '5px',
    minWidth: 50,
    borderRadius: 5,
    shadowOffset:{  width: 0,  height: 3 },
    shadowOpacity: 0.9,
  },
  punctuation: {
    shadowColor: '#FF3334',
  },
  consonant: {
    shadowColor: '#0F96E4',
  },
  vowel: {
    shadowColor: '#F6BB1D'
  },
  number: {
    shadowColor: "#1FB742",
  },
  functional : {
    flex: 2
  },
  text: {
      color: 'black',
      fontSize: 24,
      fontWeight: 600,
      padding: '20px',
  }
});

export default LetterButton;