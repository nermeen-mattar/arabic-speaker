


import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
  Modal
} from 'react-native';

import { MonoText } from '../components/StyledText';
import Colors from '../constants/Colors';
import CustomHeader from '../components/CustomHeader';
import commonStyles from '../styles/commonStyles';


export default class AboutUsScreen extends React.Component {
    constructor(props) {
        super();
        this.state = {
          circlesSection: [
            {
              img: require('../../assets/images/about-us/ear.png'),
              text: 'سمعي'
            }, 
            {
              img: require('../../assets/images/about-us/eye.png'),
              text: 'بصري'
            },
            {
              img: require('../../assets/images/about-us/wheelchair.png'),
              text: 'حركي'
            }, 
            {
              img: require('../../assets/images/about-us/couple.png'),
              text: 'كبار السن'
            },
            {
              img: require('../../assets/images/about-us/baby.png'),
              text: 'أطفال'
            },
            {
              img: require('../../assets/images/about-us/reading.png'),
              text: 'تعليمي'
            }, 
            {
              img: require('../../assets/images/about-us/care.png'),
              text: 'E-health'
            },
          ],
          isVisible: true,
          title:[ "حول التطبيق"],
          formFields: [
            {
              name: 'name',
              label: 'الإسم',
              type: 'text'
          },
          {
            label: 'البريد الإلكتروني',
            type: 'text',
            name: 'email'

        },
        {
          label: 'عنوان الرسالة',
          type: 'text',
          name: 'subject'
        }, {
          name: 'body',
          label: 'نص السالة',
          type: 'text',
          multiline: true
        }]
        };
      }

      
      render() {
    return (
      <Modal animationType="slide" transparent={false} visible={this.state.isVisible}>
      
     <CustomHeader  title={this.state.title}  onBackClicked= {() => {this.props.onBackClicked()}}/>


    <ScrollView style={styles.container}> 
    {/* first section */}
      <View style={styles.logoAndName}>
      <View style={[commonStyles.flexCenter, {position: 'relative', top: 14} ]} >
           <Image   source = {require('../../assets/images/about-us/logo.png')}/>
         </View>
      <MonoText  style={[styles.appNameArabic,  commonStyles.textCenter]}>
          المتحدث العربي
          </MonoText>

     <MonoText style={[styles.appNameEnglish, commonStyles.textCenter]}>
         Smart Arabic Speaker
          </MonoText>
        </View>


    {/* second section */}
     <View style ={[styles.secondSection, styles.paddingVertical18]}>
           <MonoText style={[commonStyles.textCenter, styles.primaryText]}>
         أحدث تطبيق للتحدث والتواصل باللغة العربية
         لذوي صعوبات النطق وكبار السن
          </MonoText>              
         {/* <MonoText style={ commonStyles.textCenter}>
      لذوي صعوبات النطق وكبار السن
          </MonoText>  */}
          <MonoText style={[ commonStyles.textCenter, styles.primaryText, styles.paddingVertical18, {color : Colors.borderColor}]}>
            V1 - 2018
          </MonoText> 
          <View
          style={styles.divider}
        />
             <MonoText style={[ commonStyles.textCenter, styles.paddingVertical18, {fontSize: 38}]}>
            إنتاج 
          </MonoText>     

      <View style={{ flexDirection: 'row', justifyContent: 'center'}} >
           <Image   source = {require('../../assets/images/about-us/logo_anas.png')}/>
         </View>
       <MonoText style={[styles.primaryText, commonStyles.textCenter] }>
         مركز أنس للتقنيات المساعدة لذوي الاحتياجات
          </MonoText> 

         </View>


          <View style={[commonStyles.flexCenter, {paddingTop: 22, backgroundColor: '#f7f7f7'}]}>
            {
              this.state.circlesSection.map(circleObj => {
                return( 
              <View style = {styles.circleAndText}> 
                 <View style={styles.whiteCircle}> 
                    <Image source = {circleObj.img}/>
                  </View>
                  <MonoText style={[commonStyles.textCenter, styles.primaryText]}> {circleObj.text} </MonoText>
              </View>
                )
              })
            }
            </View>

            <MonoText style={[commonStyles.textCenter, styles.primaryText,  {padding: 14}]}>  إشراف - د. أمل السيف </MonoText>


            <View style={[styles.contactDetails]}> 
            <View style={[styles.flexSpaceAround, {paddingVertical: 28}]}> 

              <View>
              <Image style={{marginLeft: 'auto', marginRight: 'auto'}} source = {require('../../assets/images/about-us/twitter.png')}/>
              <MonoText style={[commonStyles.textCenter, styles.primaryText]}> @AnasCenterAt </MonoText>


                </View>
              <View>
              <Image  style={{marginLeft: 'auto', marginRight: 'auto', marginVertical: 4.5}} source = {require('../../assets/images/about-us/mail.png')}/>
              <MonoText style={[commonStyles.textCenter, styles.primaryText]}> AnasCenterAT@Gmail.com </MonoText>

                </View>
              </View>
      
            <View style={styles.divider}/>
            <MonoText style={[styles.primaryText, commonStyles.textCenter, {paddingTop: 34}] }>
              شركاء النجاح
          </MonoText> 
            <View style={[styles.flexSpaceAround,  {paddingVertical: 42}]}> 
            <Image source = {require('../../assets/images/about-us/CCIS_Logo_2_Big.png')}/>
            <Image source = {require('../../assets/images/about-us/شعار_مدينة_سلطان.png')}/>
            <Image source = {require('../../assets/images/about-us/IT_LOGO.png')}/>
            </View>
            </View>
    </ScrollView>
  
                   
      </Modal>
    );
  }

  sendMessage() {

  }

  onTextChanged(text, fieldIndex) {
    const formFields = this.state.formFields;
    formFields[fieldIndex].value = text;
    this.setState({
        formFields: formFields
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBackground,
  },
  logoAndName: {
    backgroundColor: Colors.brand,
    // height: 274
  },
  appNameArabic: {
    color:'white',
    fontSize: 31,
    // textAlign: 'center'
  },
  appNameEnglish: {
    color:'white',
    fontSize: 21,
    marginBottom: 30
    // textAlign: 'center'
  },
  divider: {
    borderBottomColor: '#f2f2f2',
    width: 176,
    borderBottomWidth: 4,
    marginLeft:'auto',
    marginRight:'auto',
  },
  primaryText: {
    fontSize: 18,
  },
  secondSection: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
  },
  paddingVertical18: {
    paddingVertical: 18
  },
  flexSpaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  // circlesSection: {
  //   padding
  // },
  contactDetails: {
    backgroundColor: 'white',
  },
  whiteCircle: {
    backgroundColor: 'white',
    borderRadius: 36,
    // padding: 20
    width: 72,
    height: 72,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleAndText: {
    marginHorizontal: 5,
    marginBottom: 22,   
  }
});