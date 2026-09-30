// FooterCarousel.styles.js
import { StyleSheet, Dimensions,PixelRatio } from 'react-native';
const { width,height } = Dimensions.get('window');

const dotSize = PixelRatio.roundToNearestPixel(20); // Base size
const responsiveDotSize = dotSize * PixelRatio.getFontScale();

export default StyleSheet.create({
     

    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  
    modal: {
      justifyContent: 'space-between',
      // alignItems: 'center',
      backgroundColor: '#f6f6f6',
      // height: '20%' ,
      // width: '80%',
      borderRadius: 0,
      borderWidth: 1,
      marginTop: 50,
      marginBottom: Dimensions.get('window').height / 10,
      // marginLeft: 40,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    marker: {
      backgroundColor: 'red',
      // marginLeft: 46,
      // marginTop: 33,
      // fontWeight: 'bold',
    },
  
    bubble: {
      backgroundColor: 'rgba(250,2500,250,0)',
  
      paddingHorizontal: 28,
      paddingVertical: 2,
      borderRadius: 30,
    },
  
    lightbubble: {
      backgroundColor: 'rgba(20,20,20,0)',
      // paddingHorizontal: 28,
      paddingVertical: 2,
      borderRadius: 40,
    },
  
    footerButton: {
      backgroundColor: '#f9f9f9',
      borderColor: 'orange',
      borderWidth: 1,
  
      marginTop: 0,
      marginRight: 0,
      marginLeft: 0,
      marginBottom: 15,
      // paddingHorizontal: 5,
      paddingVertical: 5,
      borderRadius: 0,
    },
  
    footerBox: {
      width: '100%',
      backgroundColor: 'rgba(20,20,20,0)',
      // marginTop: 5,
      marginRight: 5,
      marginLeft: 5,
      // marginBottom:5,
      // paddingHorizontal: 5,
      // paddingVertical: 5,
    },
    button: {
      marginTop: 2,
      paddingHorizontal: 2,
      alignItems: 'center',
      marginHorizontal: 1,
    },
    buttontext: {
      color: 'white',
    },
  
    searchbuttontext: {
      color: 'gray',
      padding: 5,
      paddingLeft: 20,
      paddingRight: 20,
    },
    buttonContainer: {
      flexDirection: 'column',
      marginVertical: 2,
      backgroundColor: 'transparent',
    },
  
    LeftbuttonContainer: {
      flexDirection: 'column',
      backgroundColor: 'transparent',
      position: 'absolute',
  
      top: 10,
      right: 10,
    },
  
    RighbuttonContainer: {
      flexDirection: 'column',
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 150,
      right: 10,
    },
    satellitebuttonContainer: {
      flexDirection: 'column',
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 230,
      left: 10,
    },
  
    CenterbuttonContainer: {
      flexDirection: 'column',
      backgroundColor: 'transparent',
      position: 'absolute',
      top: '30%',
      right: '45%',
    },
  
    spinnerView: {
      left: '130%',
    },
    cardBox: {
      opacity: 0.7,
      justifyContent: 'space-around',
    },
  
    input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1,
      textAlign: 'right',
    },
  
    toggleMapButton: {
      position: 'absolute', 
      top: 90,
      right: 5,
     
      backgroundColor: 'white',
      padding: 2,
      marginHorizontal:2,
      borderRadius: 20,
  
      padding: 2,
      // borderRadius: 30,
      elevation: 5,
      zIndex:10
    },

      toggleButton: {
      position: 'absolute', 
      top: 120,
      right: 5,
     
      backgroundColor: 'white',
      padding: 2,
      marginHorizontal:2,
      borderRadius: 20,
  
      padding: 2,
      // borderRadius: 30,
      elevation: 5,
      zIndex:10
    },

    toggleLocationButton: {
      position: 'absolute', 
      top: 120,
      right: 5,
     
      backgroundColor: 'white',
      padding: 2,
      marginHorizontal:2,
      borderRadius: 20,
  
      padding: 2,
      // borderRadius: 30,
      elevation: 5,
      zIndex:10
    },

    userHelpButton : {

         position: 'absolute', 
      top: 170,
      right: 5,
     
      backgroundColor: 'white',
      padding: 2,
      marginHorizontal:2,
      borderRadius: 20,
  
      padding: 2,
      // borderRadius: 30,
      elevation: 5,
      zIndex:10
    },
  
    headerSearchAndFilter: {
      position: 'absolute',
      width: '100%',
      height: 70,
      backgroundColor: 'gray',
    },
  
    filterButton: {
      position: 'absolute',
      top: 25,
      left: 70,
      // backgroundColor: 'rgba(0,0,0,0.6)',
      backgroundColor: 'white',
      color: 'gray',
      padding: 10,
      borderRadius: 2,
    },
  
    fullScreenModalContainer: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      // backgroundColor: 'rgba(0,0,0,0.7)', // Optional dimming background
      backgroundColor: 'white', // Optional dimming background
    },
  
    fullScreenFilterModalContainer: {
      flex: 1,
    },
  
    filterModalContent: {
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
  
      // justifyContent: 'center',
      // alignItems: 'center',
    },
  
    modalContent: {
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    searchInput: {
      width: '80%',
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
      direction: 'rtl',
      textAlign: 'right',
    },
    searchModalButton: {
      backgroundColor: '#ff5722',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    searchModalButtonText: {
      color: '#fff',
      fontSize: 18,
    },
    closeModalButton: {
      position: 'absolute',
  top: 15,
  right: 6,
  padding: 8,
  backgroundColor: 'rgba(0,0,0,0.4)', // Darker color for better contrast
  borderRadius: 25,

  // Shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,

  // Elevation for Android
  elevation: 5,
      
    },

    ResetModalButton: {
      position: 'absolute',
      top: 20,
      right: 15,
      padding: 5,
      backgroundColor: 'rgba(136, 133, 133, 0.3)',
      borderRadius: 5,
    },

    
    closeModalButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  
    priceLabelActive: {
      backgroundColor: 'green',
      paddingHorizontal: 5,
      paddingVertical: 5,
      borderRadius: 10,
      fontFamily: 'iransans',
      marginBottom: 5,
      elevation: 5, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
  
    priceLabel: {
      backgroundColor: '#b92a31',
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 10,
      fontFamily: 'iransans',
      marginBottom: 5,
      elevation: 5, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 3,
      borderWidth:1,
      borderColor:'white'
    },
  
    priceText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333',
    },
  
    text: {
      fontSize: 9,
      color: 'white',
    },
    boldText: {
      fontWeight: 'bold',
      fontSize: 9,
    },
    pin: {
      textAlign: 'center',
    },
    drawerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    grabber: {
      width: 50,
      height: 5,
      backgroundColor: 'gray',
      borderRadius: 2.5,
      alignSelf: 'center',
      marginBottom: 10,
    },
  
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
    },
  
    categoryBox: {
      // position: 'absolute',
      // top: 70,
      // right: 10,
      // backgroundColor: 'rgba(0,0,0,0.6)',
      backgroundColor: 'white',
      padding: 5,
      marginHorizontal:2,
      borderRadius: 20,
      // borderWidth: 2,
      // borderColor: '#bc323a',
    },
    categoryText: {
      textAlign: 'center',
      fontFamily: 'iransans',
      color: '#555',
      fontSize: 14,
      // fontWeight: 'bold',
      paddingHorizontal: 1,
      marginHorizontal:2
    },
  
    catText: {
      fontSize: 18,
      color: '#333',
      fontFamily: 'iransans',
    },
    topbar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 400,
      backgroundColor: 'white',
      elevation: 5,
      zIndex: 2,
    },
    topbarContent: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
  
    categoryButton: {
      backgroundColor: '#bc323a', // Button background color
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginVertical: 5,
      alignItems: 'center',
      elevation: 3, // Shadow for Android
      shadowColor: '#000', // Shadow for iOS
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    categoryButtonText: {
      color: '#fff', // Text color
      fontSize: 16,
      fontWeight: 'bold',
    },
    noCategoriesText: {
      fontSize: 16,
      color: '#999',
      textAlign: 'center',
      marginTop: 20,
    },
  
    buttonWrapper: {
      display: 'flex',
      flexDirection: 'row',
    },
  
    arrow: {
      marginLeft: 10,
      marginRight: 5, // Optional: adjust spacing of the arrow icon
    },
  
    spinnerContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{translateX: -25}, {translateY: -25}], // Centers the spinner
    },
  
    spinnerImageView: {
      flex: 1, // Fullscreen container
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
      backgroundColor: '#fff', // Optional: Background color (use #FFA500 for Ajur orange)
    },
    spinnerImage: {
      width: 150, // Adjust the width of your GIF
      height: 150, // Adjust the height of your GIF
    },
  
    searchResultWrapper: {
      minHeight: '60%',
      maxHeight: '60%',
    },
  
    singleSearchResult: {
      padding: 10,
      marginVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: '#fff',
      textAlign: 'right',
    },
  
    filterWrapper: {
      width: '100%',
      marginBottom: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      padding: 10,
    },
    accordionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
    },
    filterInfo: {
      fontSize: 12,
      textAlign: 'right',
      color: '#555',
      marginVertical: 5,
    },
    deleteButton: {
      backgroundColor: '#ff4d4d',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    deleteButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    filterTitle: {
      fontSize: 14,
      color: '#333',
      marginRight: 10,
      textAlign: 'right',
    },
    sliderWrapper: {
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    divider: {
      height: 1,
      backgroundColor: '#555',
      marginVertical: 10,
    },
  
    filterBarWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      marginTop: 20,
      marginHorizontal: 20, 
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
  
      height: 60,
    },
    filterBarButton: {
      fontSize: 16,
      color: '#b92a31', // Blue color for buttons
      fontWeight: 'bold',
      textAlign: 'center',
    },
    filterBarText: {
      fontSize: 16,
      color: '#333',
      textAlign: 'right', // Align RTL text properly
    },
    divider: {
      backgroundColor: '#555',
      marginVertical: 10,
      height: 1, // Default height for the divider
    },
  
    filtersWrapper: {
      display: 'flex',
  
      textAlign: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 80,
      margin: 20,
  
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
  
    singleFilter: {
      margin: 10,
      padding: 10,
      textAlign: 'center',
    },
  
    actionBar: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: '#b92a31', // Primary color
      paddingVertical: 25,
      alignItems: 'center',
    
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    
      // Elevation for Android
      elevation: 12,
    
      // Optional: slight rounded top
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    
    actionText: {
      color: 'white',
      textAlign: 'center',
      fontFamily: 'iransans',
      fontSize: 20,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
    },
  
    singleTypeWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    singleIcon: {
      marginRight: 10,
    },
    singleInfo: {
      flex: 1,
    },
  
    regionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 20,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    resetButton: {
      backgroundColor: 'white',
    },
    resetButtonText: {
      color: 'black',
      fontSize: 13,
    },
    allAreasButton: {
      backgroundColor: 'transparent',
    },
    allAreasButtonText: {
      color: 'black',
      fontSize: 13,
    },
    confirmButton: {
      backgroundColor: '#f57c00', // Accent color
    },
    confirmButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  
    visisbleMarkerButton: {
      position: 'absolute',
      bottom: 80,
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 2,
    },
  
    visisbleMarkerText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  
    tickField_container: {
      width: '100%',
      paddingHorizontal: 15,
    },
    tickField_row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginVertical: 10,
    },
    tickField_text: {
      textAlign: 'right',
      color: '#555',
      fontSize: 14,
      flexShrink: 1,
    },
    tickField_strong: {
      fontWeight: 'bold',
    },
    tickField_divider: {
      height: 1,
      backgroundColor: '#555',
      marginHorizontal: 10,
      marginVertical: 4,
    },
  
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 12,
      backgroundColor: '#fff',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#ddd',
    },
  
    mapLoader: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: [{translateX: -20}, {translateY: -20}],
      backgroundColor: '#f9f9f950',
      borderRadius: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
  
    header2: {
      position: 'absolute', // Positions it absolutely within the parent container
      top: 70, // Positions at the top of the container (adjust as needed)
      left: 0, // Aligns it to the left side (can adjust as needed)
      right: 0, // Ensures it spans the full width of the parent container
      flexDirection: 'row', 
      alignItems: 'center', 
      paddingHorizontal: 10, 
      paddingVertical: 10, 
      borderBottomWidth: StyleSheet.hairlineWidth, 
      borderBottomColor: '#ddd',
      // backgroundColor: '#fff', 
      justifyContent: 'space-between',
      zIndex: 10, // Makes sure it stays on top of other elements
    },
    searchContainer: {
      flex: 0.9,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 40,
    },
    searchContainerFocused: {
      backgroundColor: '#fff',
      // backgroundColor: 'green',
  
      borderWidth: 1,
      borderColor: '#007AFF', // iOS-like blue focus
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      paddingVertical: 0, // Android fix
      includeFontPadding: false, // Android text alignment
      textAlign: 'right',
    },
    filterButton: {
      flex: 0.1,
      alignItems: 'flex-end', // Align icon to right
      justifyContent: 'center',
      paddingLeft: 10, // Space from search
    },
  
    carouselContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      backgroundColor: 'white',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: -3},
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 10,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      padding: 20,
    },
  
    rtlFilterScroll: {
      flexDirection: 'row-reverse', // RTL layout
    },
    filtersBasedOnCategorySelected: {
      marginBottom: 60,
      marginHorizontal: 2,
    },

    
      simpleDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#b92a3160",
      },
    
      dotSimpleText :{
          textAlign:'center',
          
          color:'#fff',
          backgroundColor:'#b92a3190',
          borderRadius: 50,
      },

    dotSimple: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#b92a3190',
      justifyContent: 'center',
      alignItems: 'center',
    },

    dotSimpleActive : {
      width: 60,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'green',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dotSimpleTextActive: {
      color:'white',
      
    },

    // Cluster markers
  // cluster: {
  //   width: 28,
  //   height: 28,
  //   borderRadius: 14,
  //   backgroundColor: '#b92a31',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderWidth: 2,
  //   borderColor: '#fff',
  // },
  
  // // Cluster text
  // clusterText: {
  //   color: '#fff',
  //   fontSize: 12,
  //   fontWeight: 'bold',
  // },
  
  cluster: {
    backgroundColor: '#b92a31',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  clusterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Debug view (optional)
  debugInfo: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 5,
  },
  Safecontainer : {
    flex: 1
  },

  SkeletonWrapperfooter :{

    position: 'absolute',
    bottom: 2,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5, 
    
  },

  searchHistoryContainer: {
  padding: 10,
  backgroundColor: '#f8f9fa',
  borderBottomWidth: 1,
  borderBottomColor: '#e9ecef',
},
searchHistoryHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
searchHistoryTitle: {
  fontSize: 14,
  color: '#6c757d',
  fontFamily: 'iransans',
},
clearHistoryText: {
  fontSize: 12,
  color: '#dc3545',
  fontFamily: 'iransans',
},
searchHistoryChips: {
  flexDirection: 'row-reverse',
  flexWrap: 'wrap',
},
searchHistoryChip: {
  flexDirection: 'row-reverse',
  alignItems: 'center',
  backgroundColor: '#e9ecef',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
  marginLeft: 8,
  marginBottom: 8,
},
searchHistoryChipText: {
  marginRight: 4,
  fontSize: 14,
  color: '#495057',
  fontFamily: 'iransans',
},

// Add these to your styles
locationButtonContainer: {
  position: 'absolute',
  top: 9,
  right: 0,
  alignItems: 'center',
},
locationHint: {
  backgroundColor: 'rgba(0,0,0,0.8)',
  paddingHorizontal: 12,
  paddingVertical: 2,
  borderRadius: 8,
  marginBottom: 10,
  maxWidth: 300,
  top:130,
  right:40
},
locationHintText: {
  color: 'white',
  fontSize: 12,
  fontFamily: 'iransans',
  textAlign: 'center',
},
userLocationButtonInactive: {
  opacity: 0.7,
},
locationIconInactive: {
  opacity: 0.9,
},

  });