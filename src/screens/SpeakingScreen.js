import React from 'react';
import { ScrollView, StyleSheet, TextInput, View, TouchableOpacity, TouchableHighlight, Image, Keyboard} from 'react-native';
// import { ExpoLinksView } from '@expo/samples';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import { TextToSpeach } from '../classes/TextToSpeach';
import { MonoText } from '../components/StyledText';
import { Storage } from '../classes/Storage';
import { TextPredection } from '../classes/TextPrediction';
import commonStyles from '../styles/commonStyles';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';

export default class TextToSpeachScreen extends React.Component {
  constructor(props) {
    super();
    this.state = {
      inputPlaceholder: "أكتب",
      text: '',
      predectedWords: [],
      toolsBar: [
        {
          title: 'نطق',
          iconName: 'volume-up',
          iconSize: 28,
          onPress: () => this.speak(),
           styles: [styles.tool]
        },
        {
          title: 'مسافة',
          customIcon: styles.spaceIcon,
          onPress: () => this.addSpace(),
          // style={styles.space}
          styles: [styles.space]
        },
        {
          title: 'المفضلة',
          iconName: 'star',
          onPress: () => this.toggleFavourites(),
          styles: [styles.tool]
        },
        {
          title: 'مسح',
          iconName: 'trash',
          onPress: () => this.clear(),
          styles: [styles.tool]
        }
      ],
      toolsColors: {
        'نطق': Colors.brand,
        'المفضلة': Colors.borderColor,
        'مسح': Colors.borderColor,
        'مسافة': Colors.borderColor
      },
      activeToolName: '' // 'نطق',
    };
    this.initFavourites();
    props.navigation.addListener('willFocus', this.load)
  }

  load = () => {
    this.initFavourites();
    this.setState({
      text: '',
      // activeToolName: 'نطق',
      toolsColors: {
        'نطق': Colors.brand,
        'المفضلة': Colors.borderColor,
        'مسح': Colors.borderColor,
        'مسافة': Colors.borderColor
      },
    predectedWords: []
    });
    this.onTextChanged('');
 }

  componentDidMount() {
    TextPredection.getInstance().initIndexedDefaultWords() 
  }
 
  static navigationOptions = {
    header: null
  };


  render() {
    return (
      <TouchableOpacity
      style={styles.container}
      activeOpacity = {1}
      onPress={Keyboard.dismiss} 
    >
        <CustomHeader navigation = {this.props.navigation} />

      <View style={commonStyles.center}>


      <View style={styles.inputAndToolsWrapper}> 
        <TextInput value={this.state.text} style={styles.textInput} onChangeText={(text) => this.onTextChanged(text)}
        placeholder= {this.state.inputPlaceholder}  multiline = {true} />
     
     
        <View style={styles.toolsbar}> 

        {
            this.state.toolsBar.map(tool => {
              return(
            <TouchableHighlight style={tool.styles}
            underlayColor = "transparent"
            onPress={tool.onPress} 
            onShowUnderlay={()=>this.setState({activeToolName:tool.title})}
            onHideUnderlay={()=>this.setState({activeToolName:''})}>    
          <View> 
          {
            tool.customIcon ?
            <MonoText     
            style={[tool.customIcon, 
              {backgroundColor:  this.state.toolsColors[tool.title]}]} > </MonoText>
              // this.state.activeToolName === 'مسافة' ?  Colors.brand : Colors.borderColor}
        
            : <Icon style={{textAlign: 'center'}}  name={tool.iconName} size={tool.iconSize || 24} color={this.state.toolsColors[tool.title]}/> 
            // color={ this.state.activeToolName === tool.title ? Colors.brand: Colors.borderColor}
          }
            <MonoText style={{ textAlign: 'center',  color: this.state.toolsColors[tool.title]}}> {tool.title} </MonoText>
            {/* color: this.state.activeToolName === tool.title ? Colors.brand: Colors.borderColor */}
          </View>
        </TouchableHighlight>
              )})
            }
        </View>
        </View> 

        </View>

  

        <View style={styles.predectionsWrapper}>
        {
            this.state.predectedWords.map(word => {
              return(
        <TouchableOpacity  style={[styles.predectedWord, commonStyles.shadow ]} onPress={() =>
          this.onTextChanged(this.state.text.concat(' ').concat(word))}>
            <MonoText style={styles.predectedWordText}> {word} </MonoText>
    </TouchableOpacity>
              )})
              }
          </View>

        {
         this.state.showConfirmDialog ? <ConfirmDeleteDialog
        customizedText = {"هل أنت متأكد أنك تربد حذف" 
        + " '" +  this.state.text + " '" + 
        "من المفضلات"}  
         onConfirm={() => {
          this.setState({
            showConfirmDialog: false
          });
           this.deleteFavourite();
         }}
         onCancel={() => {
          this.setState({
            showConfirmDialog: false
          });
        }}> </ConfirmDeleteDialog> : null
       }
      </TouchableOpacity>
    );
  }
  onTextChanged(text) {
    const toolsColors = this.state.toolsColors;
    toolsColors['المفضلة'] = this.state.favourites.includes(text) ? Colors.brand : Colors.borderColor;
    this.setState({
      text: text,
      toolsColors: toolsColors,
      predectedWords: TextPredection.getInstance().getPredectedWords(text).slice(0, 12)
    });
  }

  speak() {
    TextPredection.getInstance().addToUserWordsIfNew(this.state.text); 
    TextToSpeach.getInstance().speak(this.state.text);
  }

  addSpace() {
    this.setState({
      text: this.state.text.concat(' '),
    });
  }

  clear() {
    this.setState({
      text: '',
    });
  }

  initFavourites() {
    const storageInstance = Storage.getInstance();
    const result = {value: null};
    storageInstance.getItem('favourites', result).then(res => {
      const currFavourites = result.value ? result.value : []; 
      this.setState({
        favourites: currFavourites
      });
    });
  }



  deleteFavourite() {
    let currFavourites = this.state.favourites;
    const storageInstance = Storage.getInstance();
    const toolsColors = this.state.toolsColors;
    toolsColors['المفضلة'] = Colors.borderColor;
    if(currFavourites.includes(this.state.text)) {
      currFavourites = currFavourites.filter(favourite => favourite !== this.state.text);
      storageInstance.setItem('favourites', currFavourites).then(res => {
      }); 
    }

    this.setState({
      favourites: currFavourites,
      toolsColors: toolsColors
    }); 
  }

  toggleFavourites() {
    if(!this.state.text.trim().length) {
      return;
    }
    const storageInstance = Storage.getInstance();
    const toolsColors = this.state.toolsColors;
    let currFavourites = this.state.favourites;
    if(toolsColors['المفضلة']  == Colors.brand) {
      this.setState({showConfirmDialog: true});   
    } else {
      toolsColors['المفضلة'] = Colors.brand;
      if(!currFavourites.includes(this.state.text)) {
        currFavourites = [...currFavourites,  this.state.text];
        storageInstance.setItem('favourites', currFavourites).then(res => {
        });
      }
    }
    this.setState({
      favourites: currFavourites,
      toolsColors: toolsColors
    }); 
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
    //     padding: 13,
  },
  inputAndToolsWrapper: {
    marginTop: 10,
    paddingTop: 12,
    height: 144,
    width: 350,
    position: 'relative',
    // marginHorizontal: 'auto',
    backgroundColor: Colors.primary,
    borderRadius: 10 /* **N** */
  },
  textInput: {
    // width: 350,
    height:  84,
    // backgroundColor: Colors.primary,
    fontSize: 21,
    //   color: Colors.textSecondary,
    textAlign: 'right',
    paddingHorizontal: 8, // 11
    // paddingVertical: 12, // 16 // moved to wrapper
    // marginLeft: 'auto', // 10, // 12
    // marginRight: 'auto',
},
toolsbar: {
  position: 'absolute',
  top: 84,
  backgroundColor: '#F7F7F7', // temp
  flexDirection: 'row',
  justifyContent: 'center',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  paddingTop: 10,
  paddingBottom: 6,
  // marginLeft: 'auto', // 10, // 12
  // marginRight: 'auto',
  height: 60,
  borderRadius: 10 /* **N** */

},
tool: {
  // width: 60,
  paddingHorizontal: 16,
  textAlign: 'center'
},
space: {
  // width: 150,
  paddingHorizontal: 18,
  textAlign: 'center',
},
spaceIcon: {
  width: 116, // 117
  height: 22,
  backgroundColor:  Colors.borderColor,
  borderRadius: 10,
  marginBottom: 4
}, 
predectionsWrapper: {
  flexDirection: 'row',
  justifyContent: 'center',
  flexWrap: 'wrap',
  paddingVertical: 14, 
  paddingHorizontal: 12  
}, 
predectedWord: {
  marginHorizontal: 10,
  backgroundColor: 'white',
  borderRadius: 10,
  paddingHorizontal: 24,
  paddingVertical: 10,
  marginBottom: 10
},
predectedWordText: {
  fontSize: 18
}
});

