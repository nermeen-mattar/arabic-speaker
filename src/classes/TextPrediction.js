import bigramData from "../constants/default-words/bigramData";
import trigramData from '../constants/default-words/trigramData';
import quadgram from '../constants/default-words/quadgram';
import { Storage } from '../classes/Storage';

export class TextPrediction {
  staticWords = ['هل', 'متى',  'أين' ,'كيف' ,'بكم' ,'افتح' ,'ممكن' ,'طيب' ,'السلام' ,'عطني' ,'أنا' ,'لماذا']
  userWords = [{}, {}, {}];
    defaultWords = [ bigramData, trigramData, quadgram];
    static instance;
    constructor() {
        const storageInstance = Storage.getInstance();
        // storageInstance.deleteItem('userWords');
        const result = {value: 'null'};
        storageInstance.getItem('userWords', result).then(res => {
          if(result.value) {
            this.userWords = result.value;
            //  Alert.alert(
            //   'Alert Title',
            //   JSON.stringify(this.userWords),
      
            //   [
            //     {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            //     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            //     {text: 'OK', onPress: () => console.log('OK Pressed')},
            //   ],
            //   { cancelable: false }
            // )
          } 
      });
        
    }
 
    static getInstance() {
        if(!this.instance) {
            this.instance = new TextPrediction();    
        }
        return TextPrediction.instance;
    }

    initIndexedDefaultWords() {
        const indexedDefaultWords = [];
        this.defaultWords.forEach((sentences, index) => {
          indexedDefaultWords.push({});
          sentences.forEach(sentence => {
            const nextWordIndex = sentence.lastIndexOf(' ');
            if(indexedDefaultWords[index][sentence.slice(0, nextWordIndex)]) {
              indexedDefaultWords[index][sentence.slice(0, nextWordIndex)].push(sentence.slice(nextWordIndex + 1));
            } else {
              indexedDefaultWords[index][sentence.slice(0, nextWordIndex)] = [sentence.slice(nextWordIndex + 1)];
            }
          });
        });
        this.defaultWords = indexedDefaultWords;
      }
  

      getPredectedWords(enteredWords) { // ماذا تريد أن
        let userPredectedWords, defaultPredectedWords;
        enteredWords = enteredWords.trim();
        enteredWords = enteredWords.replace(/\s\s+/g, ' ');
        enteredWords = enteredWords.replace(/^أ/g, 'ا');
        enteredWords = enteredWords.replace(/\sأ/g, ' ا');
          const numberEnteredOfWords = enteredWords.split(' ').length; //  enteredWords.split(/.+ .+/g);
          if(enteredWords === '') {
              return this.staticWords;
          } 
          if ( numberEnteredOfWords > this.defaultWords.length) {
              return this.getPredectedWords(this.getLastWords(enteredWords));
          } 
        //   this.addToUserWordsIfNewWhileTyping(enteredWords, numberEnteredOfWords);
        userPredectedWords = this.userWords[numberEnteredOfWords - 1][enteredWords] || [];
        // if(predectedWords.length < 12) {
        defaultPredectedWords = this.defaultWords[numberEnteredOfWords - 1][enteredWords] || []
        // }
        let combinedResults =  userPredectedWords.concat(defaultPredectedWords.slice(0, 12 - userPredectedWords.length));
        
        /* commented cz I don't think this requirment is correct (replaced with the last line in this fucntion)*/
        // if(combinedResults.length  === 0) {
        //   combinedResults = this.staticWords;
        // } 

        if (combinedResults.length  < 12  && numberEnteredOfWords> 1) {    
            const endOfFirstWord =  enteredWords.indexOf(' ') + 1;
            let predectedWords = this.getPredectedWords(enteredWords.slice( endOfFirstWord, enteredWords.length));
            predectedWords = predectedWords.filter(word => !combinedResults.includes(word))
            combinedResults= combinedResults.concat(predectedWords.slice(0, 12 - combinedResults.length));
          }
          return combinedResults.concat(this.staticWords.slice(0, 12 - combinedResults.length));
      }

      getLastWords(sentence) {
        var wordsArray = sentence.split(' ');
        return  wordsArray.slice(wordsArray.length - (this.defaultWords.length - 1), wordsArray.length).join(' ');
      }

      addToUserWordsIfNew(enteredWords, gotUpdated) {
        enteredWords = enteredWords.trim();
        enteredWords = enteredWords.replace(/\s\s+/g, ' ');
        enteredWords = enteredWords.replace(/^أ/g, 'ا');
        enteredWords = enteredWords.replace(/\sأ/g, ' ا');
        const numberEnteredOfWords = enteredWords.split(' ').length; //  enteredWords.split(/.+ .+/g);
        if(numberEnteredOfWords === 1 ) {
            if(gotUpdated) {
                this.updateUserWords();
            }
            return;
        }
        if(this.userWords[numberEnteredOfWords - 2]) {
            // return;
        // }
        const indexOfLastWord = enteredWords.lastIndexOf(' ');
        if( !this.getPredectedWords(enteredWords.slice(0, indexOfLastWord)).includes(enteredWords.slice(indexOfLastWord + 1)) ) {
          if(!gotUpdated) {
            this.sendSentenceToBackend(enteredWords);
          }  
           gotUpdated = true;    
          if(this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)]) {
            this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)].push(enteredWords.slice(indexOfLastWord + 1));
          } else {
            this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)] = [enteredWords.slice(indexOfLastWord + 1)];
          }
        }
        this.addToUserWordsIfNew(enteredWords.slice(0, indexOfLastWord), gotUpdated);
        }
      }

     updateUserWords () {
        const storageInstance = Storage.getInstance();
        storageInstance.setItem('userWords', this.userWords ).then(res => {
        });
     }

     sendSentenceToBackend(sentence) {
      const storageInstance = Storage.getInstance(); // temp 
      const settings = {value: 'null'};
      storageInstance.getItem('settingsValues', settings).then(res => {
        if(settings.value) {
          if(settings.value.helpImproveApp) {
            fetch('http://18.224.240.0:8080/addWord?word='.concat(sentence), 
            { method: 'GET' }).then((response) => {
                response.json()
                this.displayAlertMessage();
           });
          }
        } 
      }); 
    }


     findWords(currentWords) {

        // let found=true;
        const listToSearchIn = userWords[currentWords.length] || defaultWords[currentWords.length];
        // do {
        if (listToSearchIn[currentWords.join('|')]) {
            predictions.push(listToSearchIn[currentWords.join('|')]);
        }
        // }
        // while (predictions.length < 4 ); // should be 12 in the case of user values

        if (predictions.length === 0) {
            predictions = staticPredictions;
        }

       return predictions;
    }

}

/* 
      addToUserWordsIfNewWhileTyping(enteredWords, numberEnteredOfWords) {
        const indexOfLastWord = enteredWords.lastIndexOf(' ');
        if( numberEnteredOfWords > 1 && 
          !this.getPredectedWords(enteredWords.slice(0, indexOfLastWord)).includes(enteredWords.slice(indexOfLastWord + 1)) ) {      
          if(this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)]) {
            this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)].push(enteredWords.slice(indexOfLastWord + 1));
          } else {
            this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)] = [enteredWords.slice(indexOfLastWord + 1)];
          }
        }
      }
*/


// function getPredectedWords(enteredWords) { // ماذا تريد أن
//     enteredWords = enteredWords.trim();
//       const numberEnteredOfWords = enteredWords.split(' ').length; //  enteredWords.split(/.+ .+/g);
//       if(numberEnteredOfWords > this.userWords.length) {
//           return [];
//       }
//       this.addToUserWordsIfNew(enteredWords, numberEnteredOfWords);
//      return this.userWords[numberEnteredOfWords - 1][enteredWords] || [];

//   }

  // function addToUserWordsIfNew(enteredWords, numberEnteredOfWords) {
  //   const indexOfLastWord = enteredWords.lastIndexOf(' ');
  //   if( numberEnteredOfWords > 1 && 
  //     !this.getPredectedWords(enteredWords.slice(0, indexOfLastWord)).includes(enteredWords.slice(indexOfLastWord + 1)) ) {      
  //     if(this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)]) {
  //       this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)].push(enteredWords.slice(indexOfLastWord + 1));
  //     } else {
  //       this.userWords[numberEnteredOfWords - 2][enteredWords.slice(0, indexOfLastWord)] = [enteredWords.slice(indexOfLastWord + 1)];
  //     }
  //   }
  // }