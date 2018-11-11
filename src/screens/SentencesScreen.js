


import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity

} from 'react-native';

import { MonoText } from '../components/StyledText';
import {Card} from '../components/card';
import CustomHeader from '../components/CustomHeader';
import Colors from '../constants/Colors';
import { Storage } from '../classes/storage';

export default class SentencesScreen extends React.Component {

  constructor(props) {
    super();
    this.initSentences();
    storageInstance = Storage.getInstance();
    // storageInstance.removeItem('sentences');
    this.state = {
      title: "العبارات",
      sentences: [],
      selectedSentences: [],
      selectMode: false,
      test: '',
      defaultSentences: [
        { label: 'المفضلة'},
        { label: 'تحياتي'},
        { label: 'عام'},
        { label: 'السفر'},
        { label: 'السوق'},
        { label: 'العمل'},
        { label: 'المستشفى'},
        { label: 'المطعم'},
        { label: 'المدرسة'},
      ]
    };
    // this.load();
    // props.navigation.addListener('willFocus', this.load)
  }
  static navigationOptions = {
    header: null
  };
  
  load = () => {
    this.cancelSelectMode();
      // if(!this.state.selectMode) {
        this.updateSentences(); /* didn't work in constructor because comp doesn't get killed ! solve caching
        /* make it a class prop (part of state) */
      // }
}
  // componentDidMount() {
  // }
  render() {
  
    return (
      <View style={styles.container}>
        {/* <Header
          statusBarProps={{ barStyle: 'light-content' }}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent= {<CustomHeader title="Home" drawerOpen={() => this.props.navigation.navigate('DrawerOpen')} />}
          rightComponent={{ icon: 'home', color: '#fff' }}
         /> */}
         <CustomHeader title={this.state.title} onNewClicked= {() => this.props.navigation.navigate('NewSentenceScreen')}
          onSelectClicked= {
            this.state.sentences.length > this.state.defaultSentences.length ? () =>
             this.setState({selectMode: true}) : null
          }
         />
         {/* <Header centerComponent = {{ text: 'MY nerro', style: { color: '#fff' } }} />  */}
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={styles.cardsContainer}>
          {
            this.state.sentences.map((sentence, index) => {
              return(
            //     <View key ={index}>
                
            //  </View>
          //   <TouchableOpacity   onPress={() => {
          //     this.sentenceToggled(index)
          //  }}>
          <View>
                       {/* <MonoText style={styles.getStartedText}>
              {index}
            </MonoText> */}
              <Card key ={sentence.label} cardInfo = {sentence} selectMode= {this.state.selectMode}
                selected = {sentence.selected} // this.state.selectedSentences.includes(sentence)

                  onCardToggeled= {() =>  this.sentenceToggled(index)}
                 
              />
              </View>
              );
            })
          }
          </View>

            <MonoText>{this.state.test}</MonoText>
          {/* <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}


            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/SentencesScreen.js</MonoText>
            </View>

            <MonoText style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </MonoText>
          </View> */}

          {/* <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <MonoText style={styles.helpLinkText}>Help, it didn’t automatically reload!</MonoText>
            </TouchableOpacity>
          </View> */}
        </ScrollView>

        {/* <View style={styles.tabBarInfoContainer}>
          <MonoText style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</MonoText>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View> */}
       {
         this.state.selectMode ? 
         <View  style={styles.buttonsWrapper} >
         <TouchableOpacity>
           <MonoText onPress={() => {
             this.cancelSelectMode();
               }}>
           الغاء
             </MonoText>
         </TouchableOpacity>
         <TouchableOpacity  onPress={() => {
              this.removeSelectedSentences()
            }}>
         <MonoText>
           حذف
             </MonoText>
         </TouchableOpacity>
         </View> : null
       }
      </View>
    );
  }

  initSentences = ()  => {
    this.storageInstance = Storage.getInstance(); // temp 
    const result = {value: 'null'};
    this.storageInstance.getItem('sentences', result).then(res => {
      if(!result.value || result.value === 'error') {
        this.setState({
            sentences: this.state.defaultSentences
          });
          this.storageInstance.setItem('sentences', this.state.defaultSentences);
        } else {
            this.setState({
                sentences: result.value
           });
      }
    });
  }


  updateSentences = ()  => {
    this.storageInstance = Storage.getInstance(); // temp 
    const result = {value: 'null'};
    this.storageInstance.getItem('sentences', result).then(res => {
      if(result.value) {
        this.setState({
          sentences: result.value
        });
      } 
    })
  }

  sentenceToggled(sentenceIndex) {
    const sentences = this.state.sentences;
    sentences[sentenceIndex].selected = !sentences[sentenceIndex].selected;
    this.setState({
      sentences: sentences
    });
    // const selectedSentences = this.state.selectedSentences;
    // const sentences = this.state.sentences;

    // if(sentences[sentenceIndex].selected && !selectedSentences.includes(sentenceIndex) ) {
    //   selectedSentences.push(sentenceIndex)
    // } else if( !sentences[sentenceIndex].selected && selectedSentences.includes(sentenceIndex) ) {
    //   selectedSentences.splice(sentenceIndex, 1);
    // }
    // sentences[sentenceIndex].selected =  !sentences[sentenceIndex].selected;
    // this.setState({ sentences: sentences, selectedSentences: selectedSentences});
    
    
    // this.state.sentences[sentenceIndex].setState({ selected: !this.state.sentences[sentenceIndex].selected});
  }


  cancelSelectMode = () => {
    const sentences = this.state.sentences;
    sentences.map(sentence => sentence.selected = false);
    this.setState({
      selectMode: false,
      sentences: sentences
    });
  }; 

  removeSelectedSentences = ()  => {
    const unselectedSentences = this.state.sentences.filter(sentence => !sentence.selected);
    this.storageInstance.setItem('sentences', unselectedSentences).then(res => {
        this.setState({
          sentences: unselectedSentences,
        });
      // this.updateSentences();

    });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  cardsContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    // display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  buttonsWrapper: {
    display: 'flex',
    flexDirection: 'row'
  }
  // welcomeImage: {
  //   resizeMode: 'contain',
  // },
  // tabBarInfoContainer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: 'black',
  //       shadowOffset: { height: -3 },
  //       shadowOpacity: 0.1,
  //       shadowRadius: 3,
  //     },
  //     android: {
  //       elevation: 20,
  //     },
  //   }),
  //   alignItems: 'center',
  //   backgroundColor: '#fbfbfb',
  //   paddingVertical: 20,
  // }
});

