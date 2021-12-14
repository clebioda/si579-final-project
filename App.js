import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import LetterButton from './components/LetterButton';
import SavedWordItem from './components/SavedWordItem';
import AutofillWord from './components/AutofillWord';
import { Icon } from 'react-native-elements'
import Tts from 'react-native-tts';

const DEFAULTAUTOCOMPLETEWORDS = ['Yes', 'No', 'Mom', 'Dad', 'Help'];

export default function App() {
  const [textToBeRead, setTextToBeRead] = useState('');
  const [isLowerCase, setIsLowerCase] = useState(false);
  const [isPunctuation, setIsPunctuation] = useState(true);
  const [AutoComplete, setAutoComplete] = useState(DEFAULTAUTOCOMPLETEWORDS);
  const [savedWords, setSavedWords] = useState(['Basilio', 'I want new', 'I want more', 'No more', 'Thank you']);


  function playButtonClicked() {
    if(textToBeRead == '')
      return;
    const utterance = new SpeechSynthesisUtterance(textToBeRead);
    window.speechSynthesis.speak(utterance);
    //Tts.speak('Hello, world!');
    setSavedWords([textToBeRead, ...savedWords])
    setTextToBeRead('');
  }

  function onDelete() {
    const lastIndexofSpace = textToBeRead.lastIndexOf(' ');
    const newWord = textToBeRead.slice(0, -1);
    setTextToBeRead(newWord);
    updateAutocompleteWords(newWord.substring(lastIndexofSpace + 1));
  }

  function onClear() {
    setTextToBeRead('');
    setAutoComplete(DEFAULTAUTOCOMPLETEWORDS);
  }

  function Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  var savedWordsElements = savedWords.map((item, index) => {
    return (
      <TouchableOpacity key={index}  onPress={() => updateSentence(item)}>
        <SavedWordItem text={item} />
      </TouchableOpacity>
    )
  })

  var autoCompleteElements = AutoComplete.map((item, index) => {
    return (
      <AutofillWord string={item} position={index} key={index} onPress={() => updateSentence(item, true)} />
    )
  })

  //fake enum: 1 = number, 2 = consonant, 3 = vowel, 4 = punctuation
  const firstRow = [
    {string: '0', stringType: 1}, {string: '1', stringType: 1}, {string: '2', stringType: 1}, {string: '3', stringType: 1},
    {string: '4', stringType: 1}, {string: '5', stringType: 1}, {string: '6', stringType: 1}, {string: '7', stringType: 1},
    {string: '8', stringType: 1}, {string: '9', stringType: 1}, {string: '!', stringType: 4}];

  const secondRow = [
    {string: 'A', stringType: 3}, {string: 'B', stringType: 2}, {string: 'C', stringType: 2}, {string: 'D', stringType: 2},
    {string: 'E', stringType: 3}, {string: 'F', stringType: 2}, {string: 'G', stringType: 2}, {string: 'H', stringType: 2},
    {string: 'I', stringType: 3}, {string: 'J', stringType: 2}, {string: ',', stringType: 4}];

  const thirdRow = [
    {string: 'K', stringType: 2}, {string: 'L', stringType: 2}, {string: 'M', stringType: 2}, {string: 'N', stringType: 2},
    {string: 'O', stringType: 3}, {string: 'P', stringType: 2}, {string: 'Q', stringType: 2}, {string: 'R', stringType: 2},
    {string: 'S', stringType: 2}, {string: ';', stringType: 4}];

  const fourthRow = [
    {string: 'T', stringType: 2}, {string: 'U', stringType: 3}, {string: 'V', stringType: 2}, {string: 'W', stringType: 2},
    {string: 'X', stringType: 2}, {string: 'Y', stringType: 3}, {string: 'Z', stringType: 2}, {string: '.', stringType: 4},
    {string: '?', stringType: 4}];

  const keyboardFirstRow = firstRow.map((letterOriginal, index) => {
    const letter = isLowerCase ? letterOriginal.string.toLowerCase() : letterOriginal.string;
      return (<LetterButton letter={letter} type={letterOriginal.stringType} key={index} onPress={() => updateSentence(letter)} /> )
  });
  const keyboardSecondRow = secondRow.map((letterOriginal, index) => {
    const letter = isLowerCase ? letterOriginal.string.toLowerCase() : letterOriginal.string;
      return (<LetterButton letter={letter} type={letterOriginal.stringType} key={index} onPress={() => updateSentence(letter)} /> )
  });
  const keyboardThridRow = thirdRow.map((letterOriginal, index) => {
    const letter = isLowerCase ? letterOriginal.string.toLowerCase() : letterOriginal.string;
      return (<LetterButton letter={letter} type={letterOriginal.stringType} key={index} onPress={() => updateSentence(letter)} /> )
  });
  const keyboardFourthRow = fourthRow.map((letterOriginal, index) => {
    const letter = isLowerCase ? letterOriginal.string.toLowerCase() : letterOriginal.string;
      return (<LetterButton letter={letter} type={letterOriginal.stringType} key={index} onPress={() => updateSentence(letter)} /> )
  });

  function updateSentence(string, fromAutocomplete=false) {
    if((textToBeRead == '' || textToBeRead.endsWith(' '))  && string == ' ')
      return;

    //if an autocomplete work is selected, keep the previously entered sentence up to the last space seen
    const lastIndexOfSpace = textToBeRead.lastIndexOf(' ');
    const sentenceToKeep = lastIndexOfSpace == -1 ? string : textToBeRead.substring(0, lastIndexOfSpace) + ' ' + string;
    const newString = fromAutocomplete ? sentenceToKeep : textToBeRead.concat(string);
    const wordForAutocomplete = newString.split(' ').at(-1);

    if(newString.endsWith('.') || newString.endsWith('?') || newString.endsWith('!') || wordForAutocomplete.length > 0) {
      setIsPunctuation(true);
    }
    else {
      setIsPunctuation(false);
    }

    const utterance = string != ' ' ? new SpeechSynthesisUtterance(string) : new SpeechSynthesisUtterance(newString);
    window.speechSynthesis.speak(utterance);
    setTextToBeRead(newString);
    updateAutocompleteWords(wordForAutocomplete);
  }

  // can use useEffect for this probably
  async function updateAutocompleteWords(word) {
    let url = 'https://api.datamuse.com/sug?s=' + word;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const autocompleteWords = [];
        if(data.length > 0 && word != '') {
          for (let i = 0; i < 5; i++) {
            const word = isPunctuation ? Capitalize(data[i].word) : data[i].word;
            autocompleteWords.push(word);
          }
          setAutoComplete(autocompleteWords);
        }
        else {
          setAutoComplete(DEFAULTAUTOCOMPLETEWORDS);
        }
    } catch (error) {
        setAutoComplete(DEFAULTAUTOCOMPLETEWORDS);
        console.log("Failed to fetch from Datamuse API.");
    }
  }

  return (
    <View style={styles.main}>
      <View>
        <View style={styles.container}>
          <View style={styles.flex}>
            <TouchableOpacity style={styles.button}  onPress={() => playButtonClicked()}>
              <Icon name='play-arrow' type='material' color='black' />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.centerButton]} onPress={() => playButtonClicked()}>
              <Text style={styles.text}>{textToBeRead}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => onClear()}>
              <Icon name='clear' type='material' color='black' />
            </TouchableOpacity>
          </View>
          <View style={styles.scrollView}>
            <ScrollView>
              <View style={styles.flewrow}>
              {savedWordsElements}
              </View>
            </ScrollView>
          </View>
          <View style={styles.autocomplete}>
            {autoCompleteElements}
          </View>
          <View style={styles.keyboardLong}>
            {keyboardFirstRow}
            <TouchableOpacity style={[styles.button, styles.buttonLong]}  onPress={() => onDelete()}>
              <Icon style={styles.iconPadding} name='keyboard-backspace' type='material' color='black' />
            </TouchableOpacity>
          </View>
          <View style={styles.keyboardShort}>
            {keyboardSecondRow}
          </View>
          <View style={styles.keyboardLong}>
            {keyboardThridRow}
            <LetterButton letter={'enter'} type={5} onPress={() => playButtonClicked()} />
          </View>
          <View style={styles.keyboardShort}>
            <LetterButton letter={'caps'} type={5} onPress={() => setIsLowerCase(!isLowerCase)} />
            {keyboardFourthRow}
          </View>
          <View style={styles.keyboardLong}>
            <TouchableOpacity style={[styles.button, styles.buttonSpace]}  onPress={() => updateSentence(' ')}>
              <Icon style={styles.iconPadding} name='space-bar' type='material' color='black' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: 1024,
    height: 768,
    borderColor: 'black',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#DCDCDC'
  },
  button: {
    flex: 1,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    borderRadius: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 5,
    shadowOffset:{  width: 0,  height: 3 },
    shadowOpacity: 0.9,
  },
  buttonLong: {
    flex: 2
  },
  buttonSpace: {
    shadowColor: '#0F96E4'
  },
  iconPadding: {
    padding: '20px'
  },
  centerButton: {
    flex: 12,
    borderRadius: 2,
    borderBottomWidth: 0,
    shadowOffset:{  width: 0,  height: 0 },
    shadowOpacity: 0,
  },
  text: {
    fontSize: 24,
    fontWeight: 600
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    height: 80,
    marginBottom: '20px',
    marginTop: '20px'
  },
  autocomplete: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    width: '90%',
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
  },
  keyboardLong: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row'
  },
  keyboardShort: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row'
  },
  scrollView: {
    backgroundColor: 'white',
    height: '140px',
    width: '90%',
    marginBottom: '20px',
    borderRadius: '2px'
  },
  flewrow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
