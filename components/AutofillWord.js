import React from 'react';
import {Text, StyleSheet, TouchableOpacity } from 'react-native';

const AutofillWord = (props) => {
  const utterance = new SpeechSynthesisUtterance(props.letter);
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.item, props.position == 0 && styles.leftBorder]}>
        <Text style={styles.text}>{props.string}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    borderRightWidth: 1,
    borderColor: '#848484',
    minWidth: 180
  },
  leftBorder: {
    borderLeftWidth: 1,
    borderColor: '#848484'
  },
  text: {
      color: 'black',
      fontSize: 16,
      fontWeight: 400,
      padding: '20px',
  }
});

export default AutofillWord;