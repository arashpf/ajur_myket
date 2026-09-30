import { StyleSheet, PixelRatio  } from 'react-native';

// const deviceScreen = require('Dimensions').get('window')

var React = require('react-native');
var {
  Dimensions
} = React;
const deviceScreen = Dimensions.get('window');

module.exports = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
backgroundColor:'#b92a31',
    height:60,

  },
  headerBackground: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height/6,

  },
  header:{

  },
  headerIcon: {
    color:'#f9f9f9',
    fontSize:30
  },
  headerTtitle: {
    color:'#f9f9f9',
    textAlign:'center'
  },
  controlPanel: {
    flex: 1,
    backgroundColor:'#9898e6',
    borderColor:'white',
    borderLeftWidth:1,
    shadowColor: '#000000',
    shadowOpacity: 0.9,
    shadowRadius: 3


  },
  controlPanelText: {
    color:'white',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',

  },
  controlPanelWelcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 25,
    color:'white',
    fontWeight:'bold',
  },
  categoryLabel: {
    fontSize: 15,
    textAlign: 'right',
    right: 10,
    padding:4,
    backgroundColor:'white',
    fontWeight:'bold',
  },
  linkLabel: {
    fontSize: 16,
    textAlign: 'right',
    right: 5,
    padding:10,
    color:'white',

  },
  row: {
    flexDirection: 'row',
    backgroundColor:'white',
    borderRadius: 0,
    borderWidth: 0,
    padding:0,
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    padding:10,
    alignItems: 'center'
  },
  lastRow: {
    flexDirection: 'row',
    backgroundColor:'white',
    borderRadius: 0,
    borderWidth: 0,
    padding:0,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
    padding:10,
    alignItems: 'center'
  },
  rowLabel: {
    left:10,
    fontSize:15,
    flex:1,
    color:'white',
  },
  rowInput: {
    right:10,
  },
  sliderMetric: {
    right:10,
    width:30,
  },
  slider: {
    width: 150,
    height: 30,
    margin: 10,
  },
  picker: {
    backgroundColor:'white',
    borderRadius: 0,
    borderWidth: 0,
    padding:0,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderTopWidth: 1 / PixelRatio.get(),
    borderColor: '#d6d7da',
  },
  label: {
    fontSize: 20,
    textAlign: 'left',
    margin: 0,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderColor: '#eeeeee',
    borderWidth:1,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#aaaaaa',
    marginRight:20,
    marginLeft:20,
    alignSelf: 'center',
  },





/////////////////// sidebar or controll pannel styles goes here ////////////////////////////

cpanelListItem: {
  flex:1,

  flexDirection:'column',

},

cpanelListExit:{
  alignSelf:'flex-end',
  textAlign:'right',
  alignItems:'flex-end',
  backgroundColor:'#9898e6'
},

cpanelListLink:{


  alignSelf:'flex-end',
  textAlign:'right',
  alignItems:'flex-end',


},

 cpanelText:{
  //  flexDirection:'row',

  // fontWeight:'400',
  // textAlign:'right',
  // fontSize:18,
  // fontFamily:'IRAN Sans',
  //  // fontFamily: "IRAN Sans",
  color:'#444',
  fontSize:17,
  textAlign:'right',
  paddingTop:20,
  fontFamily: "iransans",
  // fontFamily:'yekan'


},

cpanelIcons: {
  color:'#999',
  // color:'silver',
  fontSize:24,
  textAlign:'right'
  ,padding:20

},

cpanelVersionIcons: {
  color:'rgba(20,20,20,.2)',

},

cpanelIconsExit:{
  color:'#b92a31',

  // color:'silver',
  fontSize:24,
  textAlign:'right'
  ,padding:20
}








});
