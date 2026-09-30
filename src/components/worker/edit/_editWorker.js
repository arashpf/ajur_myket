// import React, {useState, useEffect,useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
//   ImageBackground,
//   BackHandler,
//   Keyboard,
//   Platform,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//   FormControl
//   ,Input,
//   WarningOutlineIcon,
//   Divider,
//   HStack,
//   TextArea,
//   Box,
//   Center,
//   Button,
//   Avatar,
//   Image,
//   Actionsheet,
//   useDisclose,
//   useToast,
//   Checkbox,
//   Select
// } from 'native-base';
// import ImagePicker from 'react-native-image-crop-picker';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import Spinner from 'react-native-spinkit';
// import * as Progress from 'react-native-progress';
// import AwesomeAlert from 'react-native-awesome-alerts';
// import Modal from "react-native-modal";

// import PersianJs from 'persianjs';

// // import RichEditor, { RichToolbar } from "react-native-rich-editor";
// import {ProcessingManager} from 'react-native-video-processing';
// import RNFS from 'react-native-fs'; // For file system operations
// import {FFmpegKit} from 'react-native-ffmpeg';
// import VideoTrimmer from '../parts/VideoTrimmer';
// import VideoPlayer from 'react-native-video'; // For video playback

// const EditWorker = ({route, navigation}) => {
// const {catId, catName,itemId,details,old_images,old_videos,} = route.params;
// const toast = useToast();

//  const inputRef = useRef(null);



// const [token, set_token] = useState(null);

// const [paused, setPaused] = useState(false);

// const [showAlert, set_showAlert] = useState(false);

// const [showAlertForNoPic, set_showAlertForNoPic] = useState(false);
// const [loading, set_loading] = useState(true);
// const [loading1, set_loading1] = useState(true);
// const [cellphone, set_cellphone] = useState('000');
// const [description, set_description] = useState('');
// const [normal_fields, set_normal_fields] = useState([]);
// const [predefine_fields, set_predefine_fields] = useState([]);
// const [tick_fields, set_tick_fields] = useState([]);
// const [selected, set_selected] = useState(undefined);
// const [isModalVisible, set_isModalVisible] = useState(false);
// const [selectedNormalField, set_selectedNormalField] = useState(null);
// const [selectedNormalFieldSlug, set_selectedNormalFieldSlug] = useState(null);
// const [predefine_fields_data, set_predefine_fields_data] = useState('');
// const [images, set_images] = useState([]);
// const [videos, set_videos] = useState([]);
// const [imagesPicked, set_imagesPicked] = useState('no');
// const [properties, set_properties] = useState([]);
// const [normalField, set_normalField] = useState([]);
// const [title, set_title] = useState('');
// const [isImageChangedFlag, set_isImageChangedFlag] = useState(false);
// const [isVideoChangedFlag, set_isVideoChangedFlag] = useState(false);
// const [worker_id, set_worker_id] = useState(null);
// const [worker, set_worker] = useState(null);
// const [beginUpload, set_beginUpload] = useState(false);
// const [percent, set_percent] = useState(0);
// const [returnedId, set_returnedId] = useState(null);
// const [selectedVideo, setSelectedVideo] = useState(null);
// const [finalVideoUri, setFinalVideoUri] = useState(null);
// const [selectedVideoUri, setSelectedVideoUri] = useState(null);
// const [selectedImage, setSelectedImage] = useState([]);
// const [isImageModalVisible, set_isImageModalVisible] = useState(false);
// const [videoModalVisible, setVideoModalVisible] = useState(false);

//   const {
//     isOpen,
//     onOpen,
//     onClose
//   } = useDisclose();

//   useEffect(() => {

//     set_title(details.name);
//     set_description(details.description);
   

    
//     set_images([]);

//     old_images.map(function(image){

    

//       console.log('this is image number -----------');
//       console.log(image);

//       var newimager = [] ;

//       newimager.mime = 'image/jpeg';

 
//       newimager.uri = image.url;

//       newimager.height = 1080;

//       newimager.width = 1080;

     

//       set_images(images => [...images, newimager]);
      
      

//     })


//     set_videos([]);

//     old_videos.map(function(image){

    

//       console.log('this is image number -----------');
//       console.log(image);

//       var newimager = [] ;

//       newimager.mime = 'video/mp4';

 
//       newimager.uri = image.url;

//       newimager.height = 1080;

//       newimager.width = 1080;

     

//       set_videos(videos => [...videos, newimager]);
//       setSelectedVideoUri(newimager.path);
//       setSelectedVideo(newimager);
      
      

//     })

    
  

   


   

    

//     if(JSON.parse(details.json_properties)){
//       set_properties(JSON.parse(details.json_properties)); 
//     }


//     AsyncStorage.getItem('cellphone').then(cellphone => {
//       set_cellphone(cellphone);
//     });

//     axios({
//       method: 'get',
//       url: 'https://api.ajur.app/api/category-fields',
//       params: {
//         cat: catId,
//       },
//     }).then(function (response) {
//       set_normal_fields(response.data.normal_fields);
//       set_loading1(false);
//       set_tick_fields(response.data.tick_fields);
//       set_predefine_fields(response.data.predefine_fields);

//     });
//      const backAction = () => {
//        set_showAlert(true)
//      }

//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       backAction
//     );



//    return () => backHandler.remove();

//   }, []);

//   const openVideoModal = video => {
//     setSelectedVideo(video);
//     setVideoModalVisible(true);
//   };

//   const closeVideoModal = () => {
//     setVideoModalVisible(false);

//     setSelectedVideo(null); 
//   };
//   const handleDelete = () => {
//     deleteSingleVideo(selectedVideo);

//     closeVideoModal();
//   };


//   const newWorker3 = () => {



//   if (title === null){

//     toast.show({
//       render: () => {
//         return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
//               <Text style={{color:'white',fontSize:16}}>  عنوان را وارد کنید</Text>
//               </Box>;
//       }
//     });



//     }


//   else if (title.length < 3){

//     toast.show({
//       render: () => {
//         return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
//               <Text style={{color:'white',fontSize:16}}>عنوان باید حد اقل سه حرف باشد</Text>
//               </Box>;
//       }
//     });



//   }else if(images.length < 1){
//     set_showAlertForNoPic(true);
    
//     }else{
//       if(0){
//         navigation.navigate('Rlogin');
//       }else{


//         if(!isImageChangedFlag){
//           console.log('images not changed for edit -------------------');
//           set_images([]);
//         }

//         if(!isVideoChangedFlag){
//           console.log('videos not changed for edit -------------------')
//           set_videos([]);  
//         }


//         // begin of uploading post
//     AsyncStorage.getItem('id_token').then((token) => {



//       set_beginUpload(true);

//       var photos = images;
//       var data = new FormData();

//       if(photos){
//         photos.forEach(element => {
//           var datess = new Date();
//           var n = datess.toString();
//           var RandomNumber = Math.floor(Math.random() * 1000000);

//           var str = n.replace(/\s+/g, '-').toLowerCase().concat(RandomNumber).concat('.jpg');
//           const newFile = {
//             uri: element.uri, name: str, type: element.mime
//           }


//           data.append('upload[]', newFile);
//         });
//       }


//         // get and process video after image






//         if(videos.length > 0){
//           videos.forEach(element => {
//             var datess = new Date();
//             var n = datess.toString();
//             var RandomNumber = Math.floor(Math.random() * 1000000);

//             var str = n.replace(/\s+/g, '-').toLowerCase().concat(RandomNumber).concat('.jpg');
//             const newVideo = {
//               uri: element.uri, name: str, type: element.mime
//             }


//             data.append('videos[]', newVideo);
//           });
//         }else{
//           data.append('videos[]', null);
//         }



//         // end of get and procees video



//         axios({
//           method:'post',
//           url:'https://api.ajur.app/api/post-model-with-images',
//           timeout: 1000 * 30, // Wait for 35 seconds
//           params: {
//             token: token,
//             address: 'testing',
//             category_id:catId,
//             phone: cellphone,
//             title: title,
//             exid:itemId,
//             isImageChangedFlag,
//             isVideoChangedFlag,  
//             description:description,
//             properties:JSON.stringify(properties),
//           },

//           data:data,
//           onUploadProgress: function (progressEvent) {
//           console.log(Math.floor((progressEvent.loaded * 100) / progressEvent.total));
//           console.log('progress event no config is : -00-0-0-00-0-');
//           console.log(progressEvent.loaded);
//            let progresss = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
//            set_percent(progresss);
//          },
//         }).then(function (response) {

          

//           set_beginUpload(false);





//           navigation.navigate('NewWorker3', {
//             workerId: response.data.worker.id,
//             exLat:details.lat,
//             exLng:details.long,
//           });

//         }).catch(e => {


//           toast.show({
//             render: () => {
//               return <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
//                     <Text style={{color:'white',fontSize:16}}>axios error !!!</Text>
//                     </Box>;
//             }


//           });



//           set_beginUpload(false);



//          });



//     });
//     //end of uploading post







//       }

//     }


//   }

//   const handleTrimmedAndCompressed = compressedVideoUri => {
//     console.log('Compressed video URI:', compressedVideoUri);

//     var new_video = [];
//     new_video.mime = selectedVideo.mime;

//     new_video.uri = compressedVideoUri;

//     new_video.height = 1080;

//     new_video.width = 1080;

//     set_videos([...videos, new_video]);

//     setFinalVideoUri(compressedVideoUri);
//     // Process the compressed video
//   };


//   pickMultipleAgain = () => {
//     onClose();
//     ImagePicker.openPicker({
//       //  cropping: true,
//       multiple: true, // Enable multiple image selection
//       mediaType: 'photo', // Restrict selection to images only
//       // width: 1080,
//       // height: 1080,
//       waitAnimationEnd: false,

//       compressImageMaxWidth: 1080,
//       compressImageMaxHeight: 1080,
//       includeExif: true,
//       compressImageQuality: 1,

//       forceJpg: true,
//     })

//       .then(selectedImages => {
//         // Store the selected images

//         set_images(prevImages => [
//           ...prevImages, // Keep existing images
//           ...selectedImages.map(img => ({
//             uri: img.path,
//             width: img.width,
//             height: img.height,
//             mime: img.mime,
//           })),
//         ]);

//         // set_images(
//         //   selectedImages.map((img) => ({
//         //     uri: img.path,
//         //     width: img.width,
//         //     height: img.height,
//         //     mime: img.mime,
//         //   }))
//         // );
//       })
//       .catch(error => {
//         console.log('Error picking images:', error);
//       });

//     // .then(selectedImages => {

//     //   selectedImages.map((image) => {
//     //     var imager = [];
//     //     imager.mime = image.mime;

//     //     imager.uri = image.path;

//     //     imager.height = 1080;

//     //     imager.width = 1080;

//     //     set_images([...images, imager]);
//     //   })

//     // })
//     // .catch(e => alert(e));
//   };


//    const pickVideos = () => {


//         ImagePicker.openPicker({
//           mediaType: 'video',

//         }).then(image => {

//           set_isVideoChangedFlag(true);

          

//           var imager = [];
//           imager.mime = image.mime;


//           imager.uri = image.path;
         

//           imager.height = 1080;

//           imager.width = 1080;




//           set_videos([...videos, imager]);



//         }).catch(e => alert(e));
//   }


//   const showAlerting = () => {
//     set_showAlert(true);
//   };

//   const hideAlerting = () => {
//     set_showAlert(false);
//   };

//   const showAlertingForNoPic = () => {
//     set_showAlertForNoPic(true);
//   };

//   const hideAlertingForNoPic = () => {
//     set_showAlertForNoPic(false);
//   };

//   const ConfirmAlertingForNoPic = () => {
//     set_showAlertForNoPic(false);
//     newWorker3();

//   };

//   const openModal = ({fl}) => {
//     set_properties(
//       properties.filter(item => item.name !== fl.value)
//     )
//     set_normalField(fl);
//     set_selectedNormalField(fl.value);
//     set_selectedNormalFieldSlug(fl.slug);
//     set_isModalVisible(true);

//     }

// const closeModal = ()=> {

//   set_isModalVisible(false);

// }

// const confirmModal = ({fl,value}) => {




//   let prop = {
//   "name": fl.value,
//   "value": value,
//   "kind": 1,
//   "special": fl.special,
//   "order" : fl.sort
// }
//   set_properties([...properties, prop]);
//   set_isModalVisible(false);
//   // set_predefine_fields_data(null);

//   console.log('the fl right now is : =-=0-==-0=00=-');
//   console.log(fl);
// }




// const onDeletingingSingleCheckbox = ({fl}) => {

//   console.log('must deleted');
//   set_properties(
//     properties.filter(item => item.name !== fl.value)
//   )
//   console.log(fl);

// }



// const onPressingSingleCheckbox = ({fl}) => {


//   let prop = {

//   "name": fl.value,
//   "value": 1,
//   "kind": 2,
//   "special": fl.special,
//   "order" : fl.sort

//   }

//   set_properties([...properties, prop]);
//   console.log('the properties right now is : =-=0-==-0=00=-');
//   console.log(properties);

// }


// const onValueChange = (value: string,fl) => {

//     let prop = {
//     "name": fl.value,
//     "value": value,
//     "kind": 3,
//     "special": fl.special,
//     "order" : fl.sort
//   }
//   set_properties([...properties, prop]);
//   console.log('the properties right now is : =-=0-==-0=00=-');
//   console.log(properties);
// }

// const render_normal_fields_selected = ({fl}) => {

//   const x = properties.find(function(item) {
//       return item.name == fl.value
//   })

//     if(x == null){
//       return(
//         <Icon active name="remove" />
//       )
//     }else if(x == ' '){
//       return(
//         <Icon active name="remove" />
//       )
//     }else{
//       return(
//           <Text>{x.value}</Text>
//       )

//     }
//   }

//   const render_normal_fields = () => {
//     if(loading1 == true){
//       // if(1){

//     }else{

//       return normal_fields.map(fl =>



//         // <TouchableOpacity key={fl.value} onPress= { () => openModal({ fl })}  style={{ margin:15,flexDirection:'row',justifyContent:'space-between'}} >
//         //     <Text style={{ fontWeight: '600',fontFamily:'IRAN Sans',fontSize:16}}>{render_normal_fields_selected({fl})}</Text>
//         //   <Text style={{ fontWeight: '600',fontFamily:'IRAN Sans',fontSize:16}}>{fl.value} </Text>
//         // </TouchableOpacity>

//         <TouchableOpacity
//           key={fl.value}
//           onPress={() => openModal({fl})}
//           style={styles.single_normalFiled}>
//           <Text
//             style={{fontWeight: '600', fontFamily: 'iransans', fontSize: 16}}>
//             {render_normal_fields_selected({fl})}
//           </Text>
//           <Text
//             style={{fontWeight: '600', fontFamily: 'iransans', fontSize: 16}}>
//             {fl.special == 1 && <Text style={{color: 'red'}}> * </Text>}
//             {fl.value}
//           </Text>
//         </TouchableOpacity>


// );
//     }
//   }

//   const deleteSingleImage = img => {
//     set_isImageModalVisible(false);
//     let url = img.uri;

//     set_images(
//       images.filter(function (item) {
//         return item !== img;
//       }),
//     );
//   };

//    const  deleteSingleVideo = (vd) => {
//     set_isVideoChangedFlag(true);
//       let url = vd.uri;


//       set_videos(

//         videos.filter(function(item) {
//             return item !== vd
//         })
//       )
//     }


   
  
//     const openFullScreenImage = img => {
//       setSelectedImage(img);
//       set_isImageModalVisible(true);
//     };
  
//     const closeFullScreenImage = () => {
//       set_isImageModalVisible(false);
//       setSelectedImage([]);
//     };


//  const renderimagesin = () => {
//     return images.map((img, index) => (
//       <View key={img.uri}>
//         <Box cardBody>
//           <TouchableOpacity onPress={() => openFullScreenImage(img)}>
//             <ImageBackground
//               source={{uri: img.uri}}
//               resizeMode="contain"
//               style={{height: 100, width: 100, margin: 5}}>
//               {index == 0 && (
//                 <Button
//                   width={100}
//                   height={35}
//                   variant="outline"
//                   onPress={() => deleteSingleImage(img)}>
//                   {/* <Icon name="ios-close-circle-outline" size={16} color="red" /> */}
//                   <Text
//                     style={{
//                       backgroundColor: 'gray',
//                       opacity: 0.7,
//                       height: 40,
//                       width: 100,
//                       textAlign: 'center',
//                       color: 'white',
//                       paddingTop: 7,
//                     }}>
//                     عکس اصلی
//                   </Text>
//                 </Button>
//               )}
//               {/* <Button
//                 width={42}
//                 variant="outline"
//                 style={{backgroundColor: 'black', opacity: 0.7}}
//                 onPress={() => deleteSingleImage(img)}>
//                 <Icon name="ios-close-circle-outline" size={16} color="red" />
//               </Button>  */}
//             </ImageBackground>
//           </TouchableOpacity>
//         </Box>
//       </View>
//     ));
//   };

//   const onClickChangeFirstImage = selectedImage => {
//     const imager = selectedImage;

//     const allImagesExceptThisOne = images.filter(item => item !== imager);

//     console.log(allImagesExceptThisOne);

//     set_images([]);

//     // set_images(allImagesExceptThisOne);
//     const new_images_ordered = images =>
//       images.concat(imager, allImagesExceptThisOne);

//     set_images(images => images.concat(imager, allImagesExceptThisOne));

//     // props.onChaneImagesOrders(imager,images);
//     // props.onChaneImagesOrders(imager,allImagesExceptThisOne);

//     // toDataUrl(imager, function (myBase64) {
//     //   props.onDeleteImage(myBase64);
//     // });

//     // set_images(allImagesExceptThisOne);

//     set_isImageModalVisible(false);
//     // set_images(images.filter((item) => item !== imager));
//   };

//     const rendervideosin = () => {
//         return videos.map(vd => (
//           <View key={vd.uri}>
//             <TouchableOpacity onPress={() => openVideoModal(vd)}>
//               <ImageBackground
//                 source={{uri: vd.uri}}
//                 style={{height: 100, width: 100, margin: 5}}
//               />
//             </TouchableOpacity>
//           </View>
//         ));
//       };
    


//   const renderplusornot = () => {
//       if (images.length < 11) {
//         return (
//           <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
//             <View>
//               <Box cardBody>
//                 <TouchableOpacity onPress={onOpen} style={styles.AddIconWrapper}>
//                   <Icon
//                     style={styles.imagedAddIcon}
//                     name="image-outline"
//                     size={50}
//                     color="gray"
//                   />
  
//                   {/* <Image
//                     alt="add-image"
//                     square
//                     source={require('../assets/img/camera.png')}
//                     style={{height: 100, width: 100, padding:10,border}}
//                     style={styles.imagedAddIcon}
//                   /> */}
//                 </TouchableOpacity>
//               </Box>
//             </View>
  
//             {renderimagesin()}
  
//             {/* Full-Screen Modal */}
//             <Modal
//               isVisible={isImageModalVisible}
//               onBackdropPress={closeFullScreenImage}
//               style={styles.modal}>
//               <Box
//                 flex={1}
//                 bg="black"
//                 justifyContent="center"
//                 alignItems="center">
//                 {/* Close Button */}
//                 <Button
//                   position="absolute"
//                   top={2}
//                   left={5}
//                   size="sm"
//                   variant="unstyled"
//                   onPress={closeFullScreenImage}
//                   style={{zIndex: 10000}}
//                   _text={{color: 'white'}}>
//                   <Icon
//                     style={{
//                       color: 'white',
//                       fontSize: 40,
//                       backgroundColor: 'black',
//                       borderRadius: 5,
//                     }}
//                     name="ios-close"
//                   />
//                 </Button>
  
//                 {/* Full-Screen Image */}
//                 <ImageBackground
//                   source={{uri: selectedImage.uri}}
//                   style={styles.fullScreenImage}
//                   resizeMode="contain"
//                 />
  
//                 {/* Action Buttons */}
//                 <Box
//                   flexDirection="row"
//                   justifyContent="space-around"
//                   mt={5}
//                   width="80%">
//                   <Button
//                     colorScheme="red"
//                     onPress={() => deleteSingleImage(selectedImage)}>
//                     حذف این عکس
//                   </Button>
//                   <Button
//                     colorScheme="blue"
//                     onPress={() => onClickChangeFirstImage(selectedImage)}>
//                     انتخاب برای عکس اصلی
//                   </Button>
//                 </Box>
//               </Box>
//             </Modal>
//           </ScrollView>
//         );
//       } else {
//         return (
//           <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
//             {renderimagesin()}
//           </ScrollView>
//         );
//       }
//     };


//    const  rendervideoplusornot = () => {


//     if (!finalVideoUri) {
//       return (
//         <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
//           <View>
//             <Box cardBody>
//               <TouchableOpacity
//                 onPress={() => pickVideos()}
//                 style={styles.AddIconWrapper}>
//                 <Icon
//                   style={styles.imagedAddIcon}
//                   name="videocam"
//                   size={50}
//                   color="gray"
//                 />
//                 {/* <Image
//                   alt="add-image"
//                   square
//                   source={require('../assets/img/camera.png')}
//                   style={{height: 100, width: 100}}
//                 /> */}
//               </TouchableOpacity>
//             </Box>
//           </View>

//           <VideoTrimmer
//             videoUri={selectedVideoUri}
//             onTrimmedAndCompressed={handleTrimmedAndCompressed}
//           />

//           {rendervideosin()}

//           {/* VideoModal for video actions */}
//           <Modal
//             visible={videoModalVisible}
//             transparent
//             animationType="slide"
//             onRequestClose={closeVideoModal}>
//             <View style={styles.videoModalContainer}>
//               <View style={styles.videoModalContent}>
//                 {selectedVideo && (
//                   <VideoPlayer
//                     source={{uri: selectedVideo.uri}}
//                     style={styles.videoPlayer}
//                     controls
//                     resizeMode="contain"
//                     paused={paused}
//                     muted={paused}
//                   />
//                 )}
//                 <View style={styles.videoModalFooter}>
//                   <Button
//                     title="Delete Video"
//                     onPress={handleDelete}
//                     color="red"
//                     style={styles.smallButton}>
//                     delete video
//                   </Button>
//                   <Button
//                     title="Close"
//                     onPress={closeVideoModal}
//                     style={styles.smallButton}>
//                     close
//                   </Button>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </ScrollView>
//       );
//     } else {
//       return (
//         <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
//           <View>
//             <Box cardBody>
//               <TouchableOpacity
//                 onPress={() => pickVideos()}
//                 style={styles.AddIconWrapper}>
//                 <Icon
//                   style={styles.imagedAddIcon}
//                   name="videocam"
//                   size={50}
//                   color="gray"
//                 />
//                 {/* <Image
//                   alt="add-image"
//                   square
//                   source={require('../assets/img/camera.png')}
//                   style={{height: 100, width: 100}}
//                 /> */}
//               </TouchableOpacity>
//             </Box>
//           </View>
//           <VideoTrimmer
//             videoUri={selectedVideoUri}
//             onTrimmedAndCompressed={handleTrimmedAndCompressed}
//           />

//           {/* {rendervideosin()} */}
//         </ScrollView>
//       );
    


//   };




//     //  if (videos.length < 3) {
//     //    return (
//     //      <ScrollView
//     //         horizontal={true}
//     //         showsHorizontalScrollIndicator={false}
//     //       >




//     //            <View>
//     //              <Box cardBody>
//     //                    <TouchableOpacity onPress={() => pickVideos()} >

//     //                  <Image
//     //                   alt='add-image'
//     //                    square
//     //                    source={require('../../assets/img/camera.png')}
//     //                    style={{height: 100, width:100}}
//     //                  />
//     //                  </TouchableOpacity>
//     //              </Box>
//     //            </View>

//     //            {  rendervideosin() }


//     //        </ScrollView>
//     //    )
//     //  }else {
//     //    return (
//     //      <ScrollView
//     //         horizontal={true}
//     //         showsHorizontalScrollIndicator={false}
//     //       >
//     //            {  rendervideosin() }
//     //      </ScrollView>
//     //    )
//     //  }
//    }


//    const   renderVarchars = (fl) => {


//     return fl.varchars.map(vr =>

//       <Select.Item key={vr.id} label={vr.value} value={vr.value} />
// );
// }

//   const renderPlaceHolder = (fl) => {
//     return fl.value
//   }


//   const onOpenSelect = (fl) => {
//     console.log('the on open select is trigered right now');
//     set_properties(
//       properties.filter(item => item.name !== fl.value)
//     )
//   }


//    const render_predefine_fields = () => {
//     if(loading1 == true){
//       // if(1){
//       return(
//         <View style={styles.spinnerView}>
//           <Spinner
//             style={styles.spinner}
//             isVisible={true}
//             size={30} type='Circle' color='#b92a31'
//           />
//         </View>
//       )
//     }else{
//       return predefine_fields.map(fl =>

//             <TouchableOpacity style={styles.predefined_Wrapper} animation="fadeInUpBig"  key={fl.id} >
//                 <View>


//                   {/* <Icon active name="remove" /> */}
//                   <Select
//                      minWidth="150"


//               placeholder={renderPlaceHolder(fl)}

//               placeholderStyle={{ color: "#2874F0" }}
//               note={true}

//               onValueChange={(value) => onValueChange( value,fl)}
//               onOpen={ () => onOpenSelect(fl)}


//                   >
//                   <Select.Item disabled value='' label='-' />
//                   { renderVarchars(fl)}
//                 {/* Select.Item label="Wallet" value="key0" />
//                 Select.Item label="ATM Card" value="key1" />
//                 Select.Item label="Debit Card" value="key2" />
//                 Select.Item label="Credit Card" value="key3" />
//                 Select.Item label="Net Banking" value="key4" /> */}
//               </Select>


//             </View>

//                 <Text style={{paddingRight:10, fontWeight: '600'}}>{ fl.value }</Text>

//           </TouchableOpacity>
// );
//     }
//   }



//     const renderOnOff = (fl) => {

//     const x = properties.find(function(item) {
//         return item.name == fl.value
//     })
//       if (x) {
//         return(
//           <TouchableOpacity key={item.id} style={styles.checkboxsWrapper} animation="fadeInUpBig"  key={fl.id} onPress= { () => onDeletingingSingleCheckbox({ fl })}>
//               <View style={styles.checkboxsChecked}>
//                 <Icon 
//                   style={{color: '#111', fontSize: 24}}
//                   name="ios-checkbox"
//                 /> 
//               </View>
//               <Text style={{fontWeight: '600',padding:10}}>{ fl.value } </Text>


//         </TouchableOpacity>
//         )
//       }else{
//         return(

//           <TouchableOpacity key={item.id} style={styles.uncheckboxsWrapper} animation="fadeInUpBig"  key={fl.id} onPress= { () => onPressingSingleCheckbox({ fl })}>

//               <View style={styles.checkboxsChecked}>

//               <Icon 
//                   style={{color: '#555', fontSize: 24}}
//                   name="stop-outline"
//                 /> 
                
//               </View>
//                 <Text style={{fontWeight: '600',padding:10}}>{ fl.value } </Text>


//         </TouchableOpacity>
//         )

//       }
//     }



//    const render_tick_fields = () => {
//     if(loading1 == true){
//       // if(1){

//     }else{
//       return tick_fields.map(fl =>


//         <>
//         {renderOnOff(fl)}
//         </>


// );
//     }
//   }

//    const renderOrProgress = () => {
//      if(!beginUpload){
//        return(
//          <>
//          <View>
//            <HStack
//              bg="orange.600"
//              px="5"
//              py="3"
//              justifyContent="space-between"
//              alignItems="center"
//              w="100%"
//              maxW="100%">
//              <HStack alignItems="center">
//                <Text color="white" fontSize="15" fontWeight="bold">
//                  <Icon
//                    onPress={() => showAlerting()}
//                    style={{color: '#111', fontSize: 24}}
//                    name="ios-close"
//                  />
//                </Text>
//              </HStack>

//              <HStack>
//                <Text color="white" fontSize="17" fontWeight="bold">
//                  در دسته بندی {catName} کد {itemId}
//                </Text>
//              </HStack>
//            </HStack>





//            <FormControl>

//            <Text style={{color:'gray', margin:20}}>عنوان ملک (کوتاه و چشم گیر)</Text>

//            <Input
//              style={{
//                margin: 10,
//                backgroundColor: 'white',
//                textAlign: 'right',
//                color: 'gray',
//                fontSize:18
//              }}

//              value={title}
//              onChangeText={title => set_title(title)}
//              placeholder="عنوان ملک را اینجا وارد کنید"
//              maxLength={30}
//            />
               

//              {render_normal_fields()}
//               {render_tick_fields()}
//               {render_predefine_fields()}





//                <TextArea h={150}  placeholder="توضیحات اختیاری" w="100%" maxW="100%"
//                value={description}
//                onChangeText={description => set_description(description)}
//                style={{ backgroundColor: 'white', textAlign: 'right',fontSize:18}}
//                 />

//            </FormControl>
//          </View>
//          <Divider />
//          <View style={{backgroundColor: 'white'}}>
//                          <Text
//                            style={{
//                              color: 'gray',
//                              margin: 20,
//                              fontFamily: 'iransans',
//                              fontSize: 18,
//                            }}>
//                            عکس های ملک
//                          </Text>
//                          {renderplusornot()}
//                        </View>

//          <Divider />
//          <View>
//          <Text style={{color:'gray', margin:20}}>ویدیوهای ملک</Text>
//            { rendervideoplusornot() }
//          </View>

//          <Button style={{marginTop:20,heigh:50}} full outline onPress= { () => newWorker3()}>
//                        <Text style={{fontSize:22,color:'#f1f1f1'}}>مرحله بعد</Text>
//                      </Button>

//                      </>
//        )
//      }else{
//        return(
//          <View style={styles.progress_wrapper} >
//             <Progress.Bar width={350} progress={percent/100} size={100} color='blue' showsText={true}  />
//          </View>

//        )
//      }
//    }

   



//   const renderModalView = () => {
//       const handleSubmit = () => {
//         calculateAutomatic(normalField.value, predefine_fields_data);
  
//         confirmModal({fl: normalField, value: predefine_fields_data});
//       };
  
//       useEffect(() => {
//         // Focus the input field after the modal has appeared
//         setTimeout(() => {
//           if (inputRef.current) {
//             Keyboard.dismiss(); // Dismiss the keyboard if it's already open
//             inputRef.current.focus();
//           } else {
//             console.warn('Input ref is not available yet');
//           }
//         }, 100); // Delay to ensure modal is fully loaded
//       }, [isModalVisible]);
  
//       return (
//         <View style={styles.modalContent}>
//           <Button full light style={styles.valueButton}>
//             <Text style={styles.valueText}>
//               {normalField.value} - {normalField.unit}
//             </Text>
//           </Button>
  
//           <Text style={styles.descriptionText}>{numToPersian()}</Text>
  
//           <Input
//             ref={inputRef} // Assign the ref here
//             autoFocus
//             keyboardType="numeric"
//             style={styles.inputField}
//             placeholder="مقدار را وارد کنید"
//             returnKeyLabel={'search'}
//             onChangeText={title => set_predefine_fields_data(title)}
//             maxLength={14}
//             onSubmitEditing={handleSubmit}
//           />
  
//           {/* <Button
//           full
//           light
//           style={styles.confirmButton}
  
//           onPress={{handleSubmit}}
//           // onPress={() =>
            
//           //   confirmModal({fl: normalField, value: predefine_fields_data})
//           // }
          
          
          
//           >
//           <Text style={styles.confirmButtonText}>تایید</Text>
//         </Button> */}
//         </View>
//       );
//     };

//   //////////////////// number show in persian section



//   function calculateAutomatic(title, value) {
//     console.log('the title is ');
//     console.log(title);

//     console.log('the value is ');
//     console.log(value);

//     if (title == 'قیمت') {
//       const pilot = properties.filter(item => item.name == 'متراژ کل');
//       if (pilot[0]) {
//         const calculatedPricePerM2 = value / pilot[0].value;

//         const promise = new Promise((resolve, reject) => {
//           set_properties(
//             properties.filter(item => item.name !== 'قیمت هر متر'),
//           );

//           const filtered = 'fine';
//           resolve(filtered);
//         });

//         promise.then(filtered => {
//           console.log('-----sdfs--sdf-s-sd-fds-f------the result is --------');
//           console.log(filtered);

//           if (filtered) {
//             let prop = {
//               name: 'قیمت هر متر',
//               value: calculatedPricePerM2.toFixed(0),
//               kind: 1,
//               special: '1',
//               order: '3',
//             };
//             //  await set_properties([...properties, prop]);
//             set_properties(pr => pr.concat(prop));
//           }
//         });
//       }
//     }
//     if (title == 'متراژ کل') {
//       console.log('metraj is focused');

//       const price = properties.filter(item => item.name == 'قیمت');
//       if (price[0]) {
//         const calculatedPricePerM2 = price[0].value / value;

//         const promise = new Promise((resolve, reject) => {
//           set_properties(
//             properties.filter(item => item.name !== 'قیمت هر متر'),
//           );

//           const filtered = 'fine';
//           resolve(filtered);
//         });

//         promise.then(filtered => {
//           console.log('-----sdfs--sdf-s-sd-fds-f------the result is --------');
//           console.log(filtered);

//           if (filtered) {
//             let prop = {
//               name: 'قیمت هر متر',
//               value: calculatedPricePerM2.toFixed(0),
//               kind: 1,
//               special: '1',
//               order: '3',
//             };
//             //  await set_properties([...properties, prop]);
//             set_properties(pr => pr.concat(prop));
//           }
//         });
//       }
//     }

//     if (title == 'قیمت هر متر') {
//       const pilot = properties.filter(item => item.name == 'متراژ کل');
//       if (pilot[0]) {
//         const price = pilot[0].value * value;

//         const promise = new Promise((resolve, reject) => {
//           set_properties(properties.filter(item => item.name !== 'قیمت'));

//           const filtered = 'fine';
//           resolve(filtered);
//         });

//         promise.then(filtered => {
//           console.log('-----sdfs--sdf-s-sd-fds-f------the result is --------');
//           console.log(filtered);

//           if (filtered) {
//             let prop = {
//               name: 'قیمت',
//               value: price.toFixed(0),
//               kind: 1,
//               special: '1',
//               order: '3',
//             };
//             //  await set_properties([...properties, prop]);
//             set_properties(pr => pr.concat(prop));
//           }
//         });
//       }
//     }
//   }

// const  numToPersian = () => {


//   input = Number(predefine_fields_data);
//   if(!input){
//     input = 1;
//   }
//   // let final = String(PersianJs(input).digitsToWords());
// let final =  persianJs(input).digitsToWords().toString();
//   return final;




//   /**
//    *
//    * @type {string}
//    */
//   var delimiter = ' و ';
//   /**
//    *
//    * @type {string}
//    */

//   var zero = 'صفر';
//   /**
//    *
//    * @type {string}
//    */

//   var negative = 'منفی ';
//   /**
//    *
//    * @type {*[]}
//    */

//   var letters = [['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'], ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'], ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'], ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'], ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' بیلیارد', ' تریلیون', ' تریلیارد', ' کوآدریلیون', ' کادریلیارد', ' کوینتیلیون', ' کوانتینیارد', ' سکستیلیون', ' سکستیلیارد', ' سپتیلیون', ' سپتیلیارد', ' اکتیلیون', ' اکتیلیارد', ' نانیلیون', ' نانیلیارد', ' دسیلیون', ' دسیلیارد']];
//   /**
//    * Decimal suffixes for decimal part
//    * @type {string[]}
//    */

//   var decimalSuffixes = ['', 'دهم', 'صدم', 'هزارم', 'ده‌هزارم', 'صد‌هزارم', 'میلیونوم', 'ده‌میلیونوم', 'صدمیلیونوم', 'میلیاردم', 'ده‌میلیاردم', 'صد‌‌میلیاردم'];
//   /**
//    * Clear number and split to 3 sections
//    * @param {*} num
//    */


//    input = input.toString().replace(/[^0-9.-]/g, '');
//    var isNegative = false;
//    var floatParse = parseFloat(input); // return zero if this isn't a valid number

//    if (isNaN(floatParse)) {
//      return zero;
//    } // check for zero


//    if (floatParse === 0) {
//      return zero;
//    } // set negative flag:true if the number is less than 0


//    if (floatParse < 0) {
//      isNegative = true;
//      input = input.replace(/-/g, '');
//    } // Declare Parts


//    var decimalPart = '';
//    var integerPart = input;
//    var pointIndex = input.indexOf('.'); // Check for float numbers form string and split Int/Dec

//    if (pointIndex > -1) {
//      integerPart = input.substring(0, pointIndex);
//      decimalPart = input.substring(pointIndex + 1, input.length);
//    }

//    if (integerPart.length > 66) {
//      return 'خارج از محدوده';
//    } // Split to sections


//    var slicedNumber = () => prepareNumber(integerPart); // Fetch Sections and convert

//    var out = [];

//    for (var i = 0; i < slicedNumber.length; i += 1) {
//      var converted = tinyNumToWord(slicedNumber[i]);

//      if (converted !== '') {
//        out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
//      }
//    } // Convert Decimal part


//    if (decimalPart.length > 0) {
//      decimalPart = convertDecimalPart(decimalPart);
//    }

//    return (isNegative ? negative : '') + out.join(delimiter) + decimalPart;





//   var prepareNumber = prepareNumber(num);//tinyNumToWord convert 3tiny parts to word


//   var tinyNumToWord = tinyNumToWord(num);
//   /**
//    * Convert Decimal part
//    * @param decimalPart
//    * @returns {string}
//    * @constructor
//    */


//   var convertDecimalPart = convertDecimalPart(decimalPart);
//   /**
//    * Main function
//    * @param input
//    * @returns {string}
//    * @constructor
//    */


//   var Num2persian = Num2persian(input) ;


//   String.prototype.toPersianLetter = function () {
//     return Num2persian(this);
//   }; //@depercated


//   Number.prototype.toPersianLetter = function () {
//     return Num2persian(parseFloat(this).toString());
//   };

//   String.prototype.num2persian = function () {
//     return Num2persian(this);
//   };

//   Number.prototype.num2persian = function () {
//     return Num2persian(parseFloat(this).toString());
//   };



//   }


//    const  prepareNumber = (num) => {
//     var out = num;

//     if (typeof out === 'number') {
//       out = out.toString();
//     } //make first part 3 chars


//     if (out.length % 3 === 1) {
//       out = "00".concat(out);
//     } else if (out.length % 3 === 2) {
//       out = "0".concat(out);
//     } // Explode to array


//     return out.replace(/\d{3}(?=\d)/g, '$&*').split('*');
//   };

//   function tinyNumToWord(num) {

//     /**
//      *
//      * @type {string}
//      */
//     var delimiter = ' و ';
//     /**
//      *
//      * @type {string}
//      */

//     var zero = 'صفر';
//     /**
//      *
//      * @type {string}
//      */

//     var negative = 'منفی ';
//     /**
//      *
//      * @type {*[]}
//      */

//     var letters = [['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'], ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'], ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'], ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'], ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' بیلیارد', ' تریلیون', ' تریلیارد', ' کوآدریلیون', ' کادریلیارد', ' کوینتیلیون', ' کوانتینیارد', ' سکستیلیون', ' سکستیلیارد', ' سپتیلیون', ' سپتیلیارد', ' اکتیلیون', ' اکتیلیارد', ' نانیلیون', ' نانیلیارد', ' دسیلیون', ' دسیلیارد']];
//     /**
//      * Decimal suffixes for decimal part
//      * @type {string[]}
//      */

//     var decimalSuffixes = ['', 'دهم', 'صدم', 'هزارم', 'ده‌هزارم', 'صد‌هزارم', 'میلیونوم', 'ده‌میلیونوم', 'صدمیلیونوم', 'میلیاردم', 'ده‌میلیاردم', 'صد‌‌میلیاردم'];
//     // return zero
//     if (parseInt(num, 0) === 0) {
//       return '';
//     }

//     var parsedInt = parseInt(num, 0);

//     if (parsedInt < 10) {
//       return letters[0][parsedInt];
//     }

//     if (parsedInt <= 20) {
//       return letters[1][parsedInt - 10];
//     }

//     if (parsedInt < 100) {
//       var _one = parsedInt % 10;

//       var _ten = (parsedInt - _one) / 10;

//       if (_one > 0) {
//         return letters[2][_ten] + delimiter + letters[0][_one];
//       }

//       return letters[2][_ten];
//     }

//     var one = parsedInt % 10;
//     var hundreds = (parsedInt - parsedInt % 100) / 100;
//     var ten = (parsedInt - (hundreds * 100 + one)) / 10;
//     var out = [letters[3][hundreds]];
//     var secondPart = ten * 10 + one;

//     if (secondPart === 0) {
//       return out.join(delimiter);
//     }

//     if (secondPart < 10) {
//       out.push(letters[0][secondPart]);
//     } else if (secondPart <= 20) {
//       out.push(letters[1][secondPart - 10]);
//     } else {
//       out.push(letters[2][ten]);

//       if (one > 0) {
//         out.push(letters[0][one]);
//       }
//     }

//     return out.join(delimiter);
//   };

//   function convertDecimalPart(decimalPart) {
//     // Clear right zero
//     decimalPart = decimalPart.replace(/0*$/, "");

//     if (decimalPart === '') {
//       return '';
//     }

//     if (decimalPart.length > 11) {
//       decimalPart = decimalPart.substr(0, 11);
//     }

//     return ' ممیز ' + Num2persian(decimalPart) + ' ' + decimalSuffixes[decimalPart.length];
//   };


//   function Num2persian(input) {
//     // Clear Non digits
//     input = input.toString().replace(/[^0-9.-]/g, '');
//     var isNegative = false;
//     var floatParse = parseFloat(input); // return zero if this isn't a valid number

//     if (isNaN(floatParse)) {
//       return zero;
//     } // check for zero


//     if (floatParse === 0) {
//       return zero;
//     } // set negative flag:true if the number is less than 0


//     if (floatParse < 0) {
//       isNegative = true;
//       input = input.replace(/-/g, '');
//     } // Declare Parts


//     var decimalPart = '';
//     var integerPart = input;
//     var pointIndex = input.indexOf('.'); // Check for float numbers form string and split Int/Dec

//     if (pointIndex > -1) {
//       integerPart = input.substring(0, pointIndex);
//       decimalPart = input.substring(pointIndex + 1, input.length);
//     }

//     if (integerPart.length > 66) {
//       return 'خارج از محدوده';
//     } // Split to sections


//     var slicedNumber = prepareNumber(integerPart); // Fetch Sections and convert

//     var out = [];

//     for (var i = 0; i < slicedNumber.length; i += 1) {
//       var converted = tinyNumToWord(slicedNumber[i]);

//       if (converted !== '') {
//         out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
//       }
//     } // Convert Decimal part


//     if (decimalPart.length > 0) {
//       decimalPart = convertDecimalPart(decimalPart);
//     }

//     return (isNegative ? negative : '') + out.join(delimiter) + decimalPart;
//   }; //@depercated





//   //////////////////// end of number show in persian section

//   return (
//     <ScrollView>
//       {renderOrProgress()}

//       <Modal
//               animationType = {"fade"}
//                 onBackdropPress = { () => closeModal()}
//              style = {styles.modal} isVisible={isModalVisible}>


//               {/* <Button style={{backgroundColor:'white',justifyContent:'flex-start'}} onPress= { () => this.closeModal()}>
//               </Button> */}

//               {renderModalView()}



//           </Modal>

//       <AwesomeAlert
//         show={showAlert}
//         showProgress={false}
//         title="اخطار"
//         message="آیا از ثبت ملک خارج میشوید؟"
//         closeOnTouchOutside={true}
//         closeOnHardwareBackPress={false}
//         showCancelButton={true}
//         showConfirmButton={true}
//         cancelText="نه صبر کن"
//         confirmText="آره ، اطمینان دارم"
//         confirmButtonColor="#DD6B55"
//         onCancelPressed={() => {
//           hideAlerting();
//         }}
//         onConfirmPressed={() => {
//           hideAlerting();
//           navigation.pop();
//         }}
//       />



//       <AwesomeAlert
//         show={showAlertForNoPic}
//         showProgress={false}
//         title="ثبت ملک بدون عکس"
//         message="ملک با عکس های مناسب به مراتب بیشتر دیده و به آن توجه خواهد شد"
//         closeOnTouchOutside={true}
//         closeOnHardwareBackPress={false}
//         showCancelButton={true}
//         showConfirmButton={true}
//         cancelText="نه صبر کن"
//         confirmText="آره ، اطمینان دارم"
//         confirmButtonColor="#DD6B55"
//         onCancelPressed={() => {
//           hideAlertingForNoPic();
          
//         }}
//         onConfirmPressed={() => {
//           ConfirmAlertingForNoPic();
//           newWorker3();
//         }}
//       />

//       <Actionsheet  isOpen={isOpen} onClose={onClose}>
//         <Actionsheet.Content>
//           <Actionsheet.Item>
//           <Box width={80} style={{backgroundColor:'red',margin:10,textAlign:'center',justifyContent:'center'}}>
//               <Button onPress={()=> pickMultipleAgain()} size="sm" variant={"solid"}>انتخاب از گالری</Button>
//           </Box>

//           </Actionsheet.Item>
//           <Actionsheet.Item>
//           <Box  width={80} style={{backgroundColor:'red',margin:10,textAlign:'center',justifyContent:'center'}}>
//               <Button size="sm" variant={"solid"}>عکس از دوربین</Button>
//           </Box>

//           </Actionsheet.Item>
//         </Actionsheet.Content>
//       </Actionsheet>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   progress_wrapper: {
//     flex: 1,
//     height: Dimensions.get('window').height,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   modal: {
//     justifyContent: 'space-between',
//     // alignItems: 'center',
//     backgroundColor: 'white',
//     // height: '20%' ,
//     // width: '80%',
//     borderRadius: 10,
//     borderWidth: 1,

//     marginTop: Dimensions.get('window').height / 10,
//     marginBottom: Dimensions.get('window').height / 10,

//     // marginLeft: 40,
//   },

//   predefined_Wrapper: {
//     // flexDirection: 'row',
//     // justifyContent: 'space-between',
//     // marginLeft: 20,
//     // marginRight: 20,
//     // margin: 10,
//     // paddingtop: 10,
//     // borderTopWidth: 1,

//     backgroundColor: '#b9272e',
//     flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
//     justifyContent: 'space-between', // Align children with space between them
//     backgroundColor: 'white', // Background color
//     padding: 5, // Overall padding
//     margin: 10,
//     borderWidth: 1, // Border width
//     borderColor: '#b9272e', // Border color
//     borderRadius: 5, // Rounded corners
//     paddingTop: 5, // Specific top padding
//   },
//   description: {
//     fontSize: 18,
//     fontFamily: 'iransans',
//     backgroundColor: '#b9272e',
//     flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
//     justifyContent: 'space-between', // Align children with space between them
//     backgroundColor: 'white', // Background color
//     padding: 5, // Overall padding
//     margin: 10,
//     borderWidth: 1, // Border width
//     borderColor: '#b9272e', // Border color
//     borderRadius: 5, // Rounded corners
//     paddingTop: 5, // Specific top padding
//   },

//   checkboxsWrapper: {
//     backgroundColor: '#b9272e',
//     flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
//     justifyContent: 'space-between', // Align children with space between them
//     backgroundColor: '#b9272e', // Background color
//     padding: 5, // Overall padding
//     margin: 10,
//     borderWidth: 1, // Border width
//     borderColor: '#b9272e', // Border color
//     borderRadius: 5, // Rounded corners
//     paddingTop: 5,
//   },

//   checkboxsChecked: {
//     color: 'white',
//   },

//   uncheckboxsWrapper: {
//     backgroundColor: '#b9272e',
//     flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
//     justifyContent: 'space-between', // Align children with space between them
//     backgroundColor: 'white', // Background color
//     padding: 5, // Overall padding
//     margin: 10,
//     borderWidth: 1, // Border width
//     borderColor: '#b9272e', // Border color
//     borderRadius: 5, // Rounded corners
//     paddingTop: 5, // Specific top padding
//   },

//   checkbox: {
//     width: 20,
//     height: 20,
//     marginTop: 10,
//   },
//   spinnerView: {
//     height: Dimensions.get('window').height,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   single_normalFiled: {
//     backgroundColor: 'white',
//     height: 50,
//     padding: 15,
//     margin: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#bc323b',
//     borderRadius: 5,
//     paddingTop: 5,
//     fontFamily: 'iransans',
//   },

//   AddIconWrapper: {
//     display: 'flex',
//     alignItems: 'center',
//     textAlign: 'center',
//     verticalAlign: 'center',
//     height: 100,
//     width: 100,

//     margin: 5,
//   },

//   imagedAddIcon: {
//     padding: 15,
//     margin: 5,
//     borderColor: 'gray',
//     borderStyle: 'dashed',
//     borderWidth: 1,

//     alignItems: 'center',
//     textAlign: 'center',
//     verticalAlign: 'center',
//   },
//   modal: {
//     margin: 0, // Fullscreen modal
//     zIndex: 1,
//     textAlign: 'center',
//     justifyContent: 'center',
//   },
//   fullScreenImage: {
//     width: '100%',
//     height: '80%',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 20,
//     width: '80%',
//   },

//   videoModalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   videoModalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   videoPlayer: {
//     width: '100%',
//     height: 200,
//     backgroundColor: 'black',
//     marginBottom: 16,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 16,
//   },

//   videoModalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginTop: 16,
//     paddingHorizontal: 10,
//   },
//   smallButton: {
//     flex: 1,
//     marginHorizontal: 5,
//   },

//   modalContainer: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     marginHorizontal: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     width: 30,
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     borderRadius: 15,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   modalContent: {
//     alignItems: 'center',
//   },
//   valueButton: {
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   valueText: {
//     fontSize: 18,
//     color: '#555',
//   },
//   descriptionText: {
//     textAlign: 'center',
//     marginVertical: 10,
//     color: '#777',
//     fontSize: 17,
//   },
//   inputField: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 10,
//     marginVertical: 10,
//     width: '100%',
//     fontSize: 18,
//   },
//   confirmButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//     width: '100%',
//   },
//   confirmButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });


// export default EditWorker;


import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Keyboard,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  FormControl,
  Input,
  WarningOutlineIcon,
  Divider,
  HStack,
  TextArea,
  Box,
  Center,
  Button,
  Avatar,
  Image,
  Actionsheet,
  useDisclose,
  useToast,
  Checkbox,
  Select,
} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Spinner from 'react-native-spinkit';
import * as Progress from 'react-native-progress';
import AwesomeAlert from 'react-native-awesome-alerts';
import Modal from 'react-native-modal';

import PersianJs from 'persianjs';

// import RichEditor, { RichToolbar } from "react-native-rich-editor";
import {ProcessingManager} from 'react-native-video-processing';
import RNFS from 'react-native-fs'; // For file system operations
import {FFmpegKit} from 'react-native-ffmpeg';
import VideoTrimmer from '../parts/VideoTrimmer';
import VideoPlayer from 'react-native-video'; // For video playback

const EditWorker = ({route, navigation}) => {
  const {catId, catName, itemId, details, old_images, old_videos} =
    route.params;
  const toast = useToast();

  const inputRef = useRef(null);

  const [token, set_token] = useState(null);

  const [paused, setPaused] = useState(false);

  const [showAlert, set_showAlert] = useState(false);

  const [showAlertForNoPic, set_showAlertForNoPic] = useState(false);
  const [loading, set_loading] = useState(false);
  const [loading1, set_loading1] = useState(true);
  const [cellphone, set_cellphone] = useState('000');
  const [description, set_description] = useState('');
    const [note, set_note] = useState('');
  const [normal_fields, set_normal_fields] = useState([]);
  const [predefine_fields, set_predefine_fields] = useState([]);
  const [tick_fields, set_tick_fields] = useState([]);
  const [selected, set_selected] = useState(undefined);
  const [isModalVisible, set_isModalVisible] = useState(false);
  const [selectedNormalField, set_selectedNormalField] = useState(null);
  const [selectedNormalFieldSlug, set_selectedNormalFieldSlug] = useState(null);
  const [predefine_fields_data, set_predefine_fields_data] = useState('');
  const [images, set_images] = useState([]);
  const [videos, set_videos] = useState([]);
  const [imagesPicked, set_imagesPicked] = useState('no');
  const [properties, set_properties] = useState([]);
  const [normalField, set_normalField] = useState([]);
  const [title, set_title] = useState('');
  const [isImageChangedFlag, set_isImageChangedFlag] = useState(false);
  const [isVideoChangedFlag, set_isVideoChangedFlag] = useState(false);
  const [worker_id, set_worker_id] = useState(null);
  const [worker, set_worker] = useState(null);
  const [beginUpload, set_beginUpload] = useState(false);
  const [percent, set_percent] = useState(0);
  const [returnedId, set_returnedId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [finalVideoUri, setFinalVideoUri] = useState(null);
  const [selectedVideoUri, setSelectedVideoUri] = useState(null);
  const [selectedImage, setSelectedImage] = useState([]);
  const [isImageModalVisible, set_isImageModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclose();

  useEffect(() => {
    set_title(details.name);
    set_description(details.description);
    set_note(details.note);

    set_images([]);

    old_images.map(function (image) {
      console.log('this is image number -----------');
      console.log(image);

      var newimager = [];

      newimager.mime = 'image/jpeg';

      newimager.uri = image.url;

      newimager.height = 1080;

      newimager.width = 1080;

      set_images(images => [...images, newimager]);
    });

    set_videos([]);

    // old_videos.map(function(vd){

    //   setFinalVideoUri(vd);

    //   alert('old video is '+vd.url);

    //   console.log('this is image number -----------');
    //   console.log(vd);

    //   var new_vd = [] ;

    //   new_vd.mime = 'video/mp4';

    //   new_vd.uri = vd.url;

    //   new_vd.height = 1080;

    //   new_vd.width = 1080;

    //   set_videos(videos => [...videos, new_vd]);
    //   setSelectedVideoUri(new_vd.path);
    //   setSelectedVideo(new_vd);

    // })

    if (JSON.parse(details.json_properties)) {
      set_properties(JSON.parse(details.json_properties));
    }

    AsyncStorage.getItem('cellphone').then(cellphone => {
      set_cellphone(cellphone);
    });

    axios({
      method: 'get',
      url: 'https://api.ajur.app/api/category-fields',
      params: {
        cat: catId,
      },
    }).then(function (response) {
      set_normal_fields(response.data.normal_fields);
      set_loading1(false);
      set_tick_fields(response.data.tick_fields);
      set_predefine_fields(response.data.predefine_fields);
    });
    const backAction = () => {
      set_showAlert(true);
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // First, transform all old videos at once when component mounts
  useEffect(() => {
    if (old_videos && old_videos.length > 0) {
      const transformedVideos = old_videos.map(vd => ({
        mime: 'video/mp4',
        uri: vd.url,
        height: 1080,
        width: 1080,
        id: vd.id || `old-${Date.now()}`,
        isOld: true,
      }));

      // Update all related states in one go
      set_videos(transformedVideos);
      if (transformedVideos.length > 0) {
        // setSelectedVideoUri(transformedVideos[0].uri);
        // setSelectedVideo(transformedVideos[0]);
      }
    }
  }, [old_videos]); // Only run when old_videos changes

  const openVideoModal = video => {
    setSelectedVideo(video);
    setVideoModalVisible(true);
  };

  const closeVideoModal = () => {
    setVideoModalVisible(false);

    setSelectedVideo(null);
  };
  const handleDelete = () => {
    deleteSingleVideo(selectedVideo);

    closeVideoModal();
  };

  const newWorker3 = () => {
    set_loading(true);

    if (title === null) {
      toast.show({
        render: () => {
          return (
            <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color: 'white', fontSize: 16}}>
                {' '}
                عنوان را وارد کنید
              </Text>
            </Box>
          );
        },
      });
    } else if (title.length < 3) {
      toast.show({
        render: () => {
          return (
            <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
              <Text style={{color: 'white', fontSize: 16}}>
                عنوان باید حد اقل سه حرف باشد
              </Text>
            </Box>
          );
        },
      });
    } else if (images.length < 1) {
      set_showAlertForNoPic(true);
    } else {
      if (0) {
        navigation.navigate('Rlogin');
      } else {
        if (!isImageChangedFlag) {
          console.log('images not changed for edit -------------------');
          // set_images([]);
        }

        if (!isVideoChangedFlag) {
          console.log('videos not changed for edit -------------------');
          // set_videos([]);
        }

        // begin of uploading post
        AsyncStorage.getItem('id_token').then(token => {
          set_beginUpload(true);

          var photos = images;
          var data = new FormData();

          if (photos) {
            photos.forEach(element => {
              var datess = new Date();
              var n = datess.toString();
              var RandomNumber = Math.floor(Math.random() * 1000000);

              var str = n
                .replace(/\s+/g, '-')
                .toLowerCase()
                .concat(RandomNumber)
                .concat('.jpg');
              const newFile = {
                uri: element.uri,
                name: str,
                type: element.mime,
              };

              data.append('upload[]', newFile);
            });
          }

          // get and process video after image

          if (videos.length > 0) {
            videos.forEach(element => {
              var datess = new Date();
              var n = datess.toString();
              var RandomNumber = Math.floor(Math.random() * 1000000);

              var str = n
                .replace(/\s+/g, '-')
                .toLowerCase()
                .concat(RandomNumber)
                .concat('.jpg');
              const newVideo = {
                uri: element.uri,
                name: str,
                type: element.mime,
              };

              data.append('videos[]', newVideo);
            });
          } else {
            data.append('videos[]', null);
          }

          // end of get and procees video

          set_loading(true);

          axios({
            method: 'post',
            url: 'https://api.ajur.app/api/post-model-with-images',
            timeout: 1000 * 30, // Wait for 35 seconds
            params: {
              token: token,
              address: 'testing',
              category_id: catId,
              phone: cellphone,
              title: title,
              exid: itemId,
              isImageChangedFlag,
              isVideoChangedFlag,
              description: description,
              note: note,
              properties: JSON.stringify(properties),
            },

            data: data,
            onUploadProgress: function (progressEvent) {
              console.log(
                Math.floor((progressEvent.loaded * 100) / progressEvent.total),
              );
              console.log('progress event no config is : -00-0-0-00-0-');
              console.log(progressEvent.loaded);
              let progresss = Math.floor(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              set_percent(progresss);
            },
          })
            .then(function (response) {
              set_loading(false);

              set_beginUpload(false);

              navigation.navigate('NewWorker3', {
                workerId: response.data.worker.id,
                exLat: details.lat,
                exLng: details.long,
              });
            })
            .catch(e => {
              console.log('the error is ');
              console.log(e);

              set_loading(false);
              toast.show({
                render: () => {
                  return (
                    <Box bg="orange.700" px="15" py="3" rounded="md" mb={5}>
                      <Text style={{color: 'white', fontSize: 16}}>
                        axios error !!!
                      </Text>
                    </Box>
                  );
                },
              });

              set_beginUpload(false);
            });
        });
        //end of uploading post
      }
    }
  };

  const handleTrimmedAndCompressed = compressedVideoUri => {
    console.log('Compressed video URI:', compressedVideoUri);

    var new_video = [];
    new_video.mime = selectedVideo.mime;

    new_video.uri = compressedVideoUri;

    new_video.height = 1080;

    new_video.width = 1080;

    set_videos([...videos, new_video]);

    setFinalVideoUri(compressedVideoUri);
    // Process the compressed video
  };

  pickMultipleAgain = () => {
    onClose();
    ImagePicker.openPicker({
      //  cropping: true,
      multiple: true, // Enable multiple image selection
      mediaType: 'photo', // Restrict selection to images only
      // width: 1080,
      // height: 1080,
      waitAnimationEnd: false,

      compressImageMaxWidth: 1080,
      compressImageMaxHeight: 1080,
      includeExif: true,
      compressImageQuality: 1,

      forceJpg: true,
    })

      .then(selectedImages => {
        // Store the selected images

        set_images(prevImages => [
          ...prevImages, // Keep existing images
          ...selectedImages.map(img => ({
            uri: img.path,
            width: img.width,
            height: img.height,
            mime: img.mime,
          })),
        ]);

        // set_images(
        //   selectedImages.map((img) => ({
        //     uri: img.path,
        //     width: img.width,
        //     height: img.height,
        //     mime: img.mime,
        //   }))
        // );
      })
      .catch(error => {
        console.log('Error picking images:', error);
      });

    // .then(selectedImages => {

    //   selectedImages.map((image) => {
    //     var imager = [];
    //     imager.mime = image.mime;

    //     imager.uri = image.path;

    //     imager.height = 1080;

    //     imager.width = 1080;

    //     set_images([...images, imager]);
    //   })

    // })
    // .catch(e => alert(e));
  };

  const pickVideos = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    })
      .then(image => {
        set_isVideoChangedFlag(true);

        var imager = [];
        imager.mime = image.mime;

        imager.uri = image.path;

        imager.height = 1080;

        imager.width = 1080;

        // set_videos([...videos, imager]);

        setSelectedVideoUri(image.path);
        setSelectedVideo(imager);
      })
      .catch(e => alert(e));
  };

  const showAlerting = () => {
    set_showAlert(true);
  };

  const hideAlerting = () => {
    set_showAlert(false);
  };

  const showAlertingForNoPic = () => {
    set_showAlertForNoPic(true);
  };

  const hideAlertingForNoPic = () => {
    set_showAlertForNoPic(false);
  };

  const ConfirmAlertingForNoPic = () => {
    set_showAlertForNoPic(false);
    newWorker3();
  };

  const openModal = ({fl}) => {
    set_properties(properties.filter(item => item.name !== fl.value));
    set_normalField(fl);
    set_selectedNormalField(fl.value);
    set_selectedNormalFieldSlug(fl.slug);
    set_isModalVisible(true);
  };

  const closeModal = () => {
    set_isModalVisible(false);
  };

  const confirmModal = ({fl, value}) => {
    let prop = {
      name: fl.value,
      value: value,
      kind: 1,
      special: fl.special,
      order: fl.sort,
    };
    set_properties([...properties, prop]);
    set_isModalVisible(false);
    // set_predefine_fields_data(null);

    console.log('the fl right now is : =-=0-==-0=00=-');
    console.log(fl);
  };

  const onDeletingingSingleCheckbox = ({fl}) => {
    console.log('must deleted');
    set_properties(properties.filter(item => item.name !== fl.value));
    console.log(fl);
  };

  const onPressingSingleCheckbox = ({fl}) => {
    let prop = {
      name: fl.value,
      value: 1,
      kind: 2,
      special: fl.special,
      order: fl.sort,
    };

    set_properties([...properties, prop]);
    console.log('the properties right now is : =-=0-==-0=00=-');
    console.log(properties);
  };

  const onValueChange = (value: string, fl) => {
    let prop = {
      name: fl.value,
      value: value,
      kind: 3,
      special: fl.special,
      order: fl.sort,
    };
    set_properties([...properties, prop]);
    console.log('the properties right now is : =-=0-==-0=00=-');
    console.log(properties);
  };

  const render_normal_fields_selected = ({fl}) => {
    const x = properties.find(function (item) {
      return item.name == fl.value;
    });

    if (x == null) {
      return <Icon active name="remove" />;
    } else if (x == ' ') {
      return <Icon active name="remove" />;
    } else {
      return <Text>{x.value}</Text>;
    }
  };

  const render_normal_fields = () => {
    if (loading1 == true) {
      // if(1){
    } else {
      return normal_fields.map(fl => (
        // <TouchableOpacity key={fl.value} onPress= { () => openModal({ fl })}  style={{ margin:15,flexDirection:'row',justifyContent:'space-between'}} >
        //     <Text style={{ fontWeight: '600',fontFamily:'IRAN Sans',fontSize:16}}>{render_normal_fields_selected({fl})}</Text>
        //   <Text style={{ fontWeight: '600',fontFamily:'IRAN Sans',fontSize:16}}>{fl.value} </Text>
        // </TouchableOpacity>

        <TouchableOpacity
          key={fl.value}
          onPress={() => openModal({fl})}
          style={styles.single_normalFiled}>
          <Text
            style={{fontWeight: '600', fontFamily: 'iransans', fontSize: 16}}>
            {render_normal_fields_selected({fl})}
          </Text>
          <Text
            style={{fontWeight: '600', fontFamily: 'iransans', fontSize: 16}}>
            {fl.special == 1 && <Text style={{color: 'red'}}> * </Text>}
            {fl.value}
          </Text>
        </TouchableOpacity>
      ));
    }
  };

  const deleteSingleImage = img => {
    set_isImageModalVisible(false);
    let url = img.uri;

    set_images(
      images.filter(function (item) {
        return item !== img;
      }),
    );
  };

  const deleteSingleVideo = vd => {
    set_isVideoChangedFlag(true);
    let url = vd.uri;

    set_videos(
      videos.filter(function (item) {
        return item !== vd;
      }),
    );
  };

  const openFullScreenImage = img => {
    setSelectedImage(img);
    set_isImageModalVisible(true);
  };

  const closeFullScreenImage = () => {
    set_isImageModalVisible(false);
    setSelectedImage([]);
  };

  const renderimagesin = () => {
    return images.map((img, index) => (
      <View key={img.uri}>
        <Box cardBody>
          <TouchableOpacity onPress={() => openFullScreenImage(img)}>
            <ImageBackground
              source={{uri: img.uri}}
              resizeMode="contain"
              style={{height: 100, width: 100, margin: 5}}>
              {index == 0 && (
                <Button
                  width={100}
                  height={35}
                  variant="outline"
                  onPress={() => deleteSingleImage(img)}>
                  {/* <Icon name="ios-close-circle-outline" size={16} color="red" /> */}
                  <Text
                    style={{
                      backgroundColor: 'gray',
                      opacity: 0.7,
                      height: 40,
                      width: 100,
                      textAlign: 'center',
                      color: 'white',
                      paddingTop: 7,
                    }}>
                    عکس اصلی
                  </Text>
                </Button>
              )}
              {/* <Button
                width={42}
                variant="outline"
                style={{backgroundColor: 'black', opacity: 0.7}}
                onPress={() => deleteSingleImage(img)}>
                <Icon name="ios-close-circle-outline" size={16} color="red" />
              </Button>  */}
            </ImageBackground>
          </TouchableOpacity>
        </Box>
      </View>
    ));
  };

  // const onClickChangeFirstImage = selectedImage => {
  //   const imager = selectedImage;

  //   const allImagesExceptThisOne = images.filter(item => item !== imager);

  //   console.log(allImagesExceptThisOne);

  //   set_images([]);

  //   // set_images(allImagesExceptThisOne);
  //   const new_images_ordered = images =>
  //     images.concat(imager, allImagesExceptThisOne);

  //   set_images(images => images.concat(imager, allImagesExceptThisOne));

  //   // props.onChaneImagesOrders(imager,images);
  //   // props.onChaneImagesOrders(imager,allImagesExceptThisOne);

  //   // toDataUrl(imager, function (myBase64) {
  //   //   props.onDeleteImage(myBase64);
  //   // });

  //   // set_images(allImagesExceptThisOne);

  //   set_isImageModalVisible(false);
  //   // set_images(images.filter((item) => item !== imager));
  // };

  const onClickChangeFirstImage = selectedImage => {
    // Create a stable comparison key for each image
    const getImageKey = img => {
      if (typeof img === 'string') return img;
      return img.uri || img.url || img.id;
    };

    const selectedKey = getImageKey(selectedImage);

    // Preserve all images including the selected one
    const newImageOrder = [
      selectedImage,
      ...images.filter(item => getImageKey(item) !== selectedKey),
    ];

    set_images(newImageOrder);
    set_isImageModalVisible(false);

    // Send to parent/API if needed
    // if (props.onChaneImagesOrders) {
    //   props.onChaneImagesOrders(newImageOrder);
    // }
  };

  // const onClickChangeFirstImage = selectedImage => {
  //   const imager = selectedImage;

  //   const allImagesExceptThisOne = images.filter(item => item !== imager);

  //   console.log(allImagesExceptThisOne);

  //   set_images([]);

  //   // set_images(allImagesExceptThisOne);
  //   const new_images_ordered = images =>
  //     images.concat(imager, allImagesExceptThisOne);

  //   set_images(images => images.concat(imager, allImagesExceptThisOne));

  //   // props.onChaneImagesOrders(imager,images);
  //   // props.onChaneImagesOrders(imager,allImagesExceptThisOne);

  //   // toDataUrl(imager, function (myBase64) {
  //   //   props.onDeleteImage(myBase64);
  //   // });

  //   // set_images(allImagesExceptThisOne);

  //   set_isImageModalVisible(false);
  //   // set_images(images.filter((item) => item !== imager));
  // };

  const generateThumbnail = async videoUri => {
    try {
      const thumbnail = await VideoThumbnails.getThumbnail(videoUri, {
        time: 1000,
        quality: 0.8,
      });
      return thumbnail.uri;
    } catch (e) {
      console.warn("Couldn't generate thumbnail:", e);
      return null;
    }
  };

  const rendervideosin = () => {
    return videos.map(vd => (
      <View key={vd.uri}>
        <TouchableOpacity onPress={() => openVideoModal(vd)}>
          {vd.thumbnail ? (
            <ImageBackground
              source={{uri: vd.thumbnail}}
              style={styles.videoThumbnail}
            />
          ) : (
            <>
              <View style={styles.thumbnailContainer}>
                <VideoPlayer
                  source={{uri: vd.uri}}
                  style={styles.videoThumbnail}
                  paused={true}
                  muted={true}
                  resizeMode="cover"
                />
                <View style={styles.playIcon}>
                  <Icon name="play-circle" size={24} color="white" />
                </View>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    ));
  };

  // const rendervideosin = () => {
  //   return videos.map(vd => (
  //     <View key={vd.id || vd.uri} style={styles.videoContainer}>
  //       <TouchableOpacity
  //         onPress={() => openVideoModal(vd)}
  //         style={styles.videoWrapper}
  //       >
  //         {/* Use Video component for better preview */}
  //         <VideoPlayer
  //           source={{ uri: vd.uri }}
  //           style={styles.videoThumbnail}
  //           paused={true}
  //           muted={true}
  //           resizeMode="cover"
  //         />

  //         {/* Show "Existing" badge for old videos */}
  //         {vd.isOld && (
  //           <View style={styles.existingBadge}>
  //             <Text style={styles.existingBadgeText}>Existing</Text>
  //           </View>
  //         )}

  //         {/* Delete button - shown conditionally if needed */}
  //         {!vd.isOld && (
  //           <TouchableOpacity
  //             style={styles.deleteButton}
  //             onPress={(e) => {
  //               e.stopPropagation(); // Prevent triggering the parent onPress
  //               handleDeleteVideo(vd.uri);
  //             }}
  //           >
  //             <Icon name="close" size={16} color="white" />
  //           </TouchableOpacity>
  //         )}
  //       </TouchableOpacity>
  //     </View>
  //   ));
  // };

  const renderplusornot = () => {
    if (images.length < 11) {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View>
            <Box cardBody>
              <TouchableOpacity onPress={onOpen} style={styles.AddIconWrapper}>
                <Icon
                  style={styles.imagedAddIcon}
                  name="image-outline"
                  size={50}
                  color="gray"
                />

                {/* <Image
                      alt="add-image"
                      square
                      source={require('../assets/img/camera.png')}
                      style={{height: 100, width: 100, padding:10,border}}
                      style={styles.imagedAddIcon}
                    /> */}
              </TouchableOpacity>
            </Box>
          </View>

          {renderimagesin()}

          {/* Full-Screen Modal */}
          <Modal
            isVisible={isImageModalVisible}
            onBackdropPress={closeFullScreenImage}
            style={styles.modal}>
            <Box
              flex={1}
              bg="black"
              justifyContent="center"
              alignItems="center">
              {/* Close Button */}
              <Button
                position="absolute"
                top={2}
                left={5}
                size="sm"
                variant="unstyled"
                onPress={closeFullScreenImage}
                style={{zIndex: 10000}}
                _text={{color: 'white'}}>
                <Icon
                  style={{
                    color: 'white',
                    fontSize: 40,
                    backgroundColor: 'black',
                    borderRadius: 5,
                  }}
                  name="ios-close"
                />
              </Button>

              {/* Full-Screen Image */}
              <ImageBackground
                source={{uri: selectedImage.uri}}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />

              {/* Action Buttons */}
              <Box
                flexDirection="row"
                justifyContent="space-around"
                mt={5}
                width="80%">
                <Button
                  colorScheme="red"
                  onPress={() => deleteSingleImage(selectedImage)}>
                  حذف این عکس
                </Button>
                <Button
                  colorScheme="blue"
                  onPress={() => onClickChangeFirstImage(selectedImage)}>
                  انتخاب برای عکس اصلی
                </Button>
              </Box>
            </Box>
          </Modal>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {renderimagesin()}
        </ScrollView>
      );
    }
  };

  // const renderplusornot = () => {
  //     if (images.length < 11) {
  //       return (
  //         <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
  //           <View>
  //             <Box cardBody>
  //               <TouchableOpacity onPress={onOpen} style={styles.AddIconWrapper}>
  //                 <Icon
  //                   style={styles.imagedAddIcon}
  //                   name="image-outline"
  //                   size={50}
  //                   color="gray"
  //                 />

  //                 {/* <Image
  //                   alt="add-image"
  //                   square
  //                   source={require('../assets/img/camera.png')}
  //                   style={{height: 100, width: 100, padding:10,border}}
  //                   style={styles.imagedAddIcon}
  //                 /> */}
  //               </TouchableOpacity>
  //             </Box>
  //           </View>

  //           {renderimagesin()}

  //           {/* Full-Screen Modal */}
  //           <Modal
  //             isVisible={isImageModalVisible}
  //             onBackdropPress={closeFullScreenImage}
  //             style={styles.modal}>
  //             <Box
  //               flex={1}
  //               bg="black"
  //               justifyContent="center"
  //               alignItems="center">
  //               {/* Close Button */}
  //               <Button
  //                 position="absolute"
  //                 top={2}
  //                 left={5}
  //                 size="sm"
  //                 variant="unstyled"
  //                 onPress={closeFullScreenImage}
  //                 style={{zIndex: 10000}}
  //                 _text={{color: 'white'}}>
  //                 <Icon
  //                   style={{
  //                     color: 'white',
  //                     fontSize: 40,
  //                     backgroundColor: 'black',
  //                     borderRadius: 5,
  //                   }}
  //                   name="ios-close"
  //                 />
  //               </Button>

  //               {/* Full-Screen Image */}
  //               <ImageBackground
  //                 source={{uri: selectedImage.uri}}
  //                 style={styles.fullScreenImage}
  //                 resizeMode="contain"
  //               />

  //               {/* Action Buttons */}
  //               <Box
  //                 flexDirection="row"
  //                 justifyContent="space-around"
  //                 mt={5}
  //                 width="80%">
  //                 <Button
  //                   colorScheme="red"
  //                   onPress={() => deleteSingleImage(selectedImage)}>
  //                   حذف این عکس
  //                 </Button>
  //                 <Button
  //                   colorScheme="blue"
  //                   onPress={() => onClickChangeFirstImage(selectedImage)}>
  //                   انتخاب برای عکس اصلی
  //                 </Button>
  //               </Box>
  //             </Box>
  //           </Modal>
  //         </ScrollView>
  //       );
  //     } else {
  //       return (
  //         <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
  //           {renderimagesin()}
  //         </ScrollView>
  //       );
  //     }
  //   };

  const rendervideoplusornot = () => {
    if (!finalVideoUri || old_videos) {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View>
            <Box cardBody>
              <TouchableOpacity
                onPress={() => pickVideos()}
                style={styles.AddIconWrapper}>
                <Icon
                  style={styles.imagedAddIcon}
                  name="videocam"
                  size={50}
                  color="gray"
                />
                {/* <Image
                  alt="add-image"
                  square
                  source={require('../assets/img/camera.png')}
                  style={{height: 100, width: 100}}
                /> */}
              </TouchableOpacity>
            </Box>
          </View>

          <VideoTrimmer
            videoUri={selectedVideoUri}
            onTrimmedAndCompressed={handleTrimmedAndCompressed}
          />

          {rendervideosin()}

          {/* VideoModal for video actions */}
          <Modal
            visible={videoModalVisible}
            transparent
            animationType="slide"
            onRequestClose={closeVideoModal}>
            <View style={styles.videoModalContainer}>
              <View style={styles.videoModalContent}>
                {selectedVideo && (
                  <VideoPlayer
                    source={{uri: selectedVideo.uri}}
                    style={styles.videoPlayer}
                    controls
                    resizeMode="contain"
                    paused={paused}
                    muted={paused}
                  />
                )}
                <View style={styles.videoModalFooter}>
                  <Button
                    title="Delete Video"
                    onPress={handleDelete}
                    color="red"
                    style={styles.smallButton}>
                    حذف ویدیو
                  </Button>
                  <Button
                    title="Close"
                    onPress={closeVideoModal}
                    style={styles.smallButton}>
                    بازگشت
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View>
            <Box cardBody>
              <TouchableOpacity
                onPress={() => pickVideos()}
                style={styles.AddIconWrapper}>
                <Icon
                  style={styles.imagedAddIcon}
                  name="videocam"
                  size={50}
                  color="gray"
                />
                {/* <Image
                  alt="add-image"
                  square
                  source={require('../assets/img/camera.png')}
                  style={{height: 100, width: 100}}
                /> */}
              </TouchableOpacity>
            </Box>
          </View>
          <VideoTrimmer
            videoUri={selectedVideoUri}
            onTrimmedAndCompressed={handleTrimmedAndCompressed}
          />

          {/* {rendervideosin()} */}
        </ScrollView>
      );
    }

    //  if (videos.length < 3) {
    //    return (
    //      <ScrollView
    //         horizontal={true}
    //         showsHorizontalScrollIndicator={false}
    //       >

    //            <View>
    //              <Box cardBody>
    //                    <TouchableOpacity onPress={() => pickVideos()} >

    //                  <Image
    //                   alt='add-image'
    //                    square
    //                    source={require('../../assets/img/camera.png')}
    //                    style={{height: 100, width:100}}
    //                  />
    //                  </TouchableOpacity>
    //              </Box>
    //            </View>

    //            {  rendervideosin() }

    //        </ScrollView>
    //    )
    //  }else {
    //    return (
    //      <ScrollView
    //         horizontal={true}
    //         showsHorizontalScrollIndicator={false}
    //       >
    //            {  rendervideosin() }
    //      </ScrollView>
    //    )
    //  }
  };

  const renderVarchars = fl => {
    return fl.varchars.map(vr => (
      <Select.Item key={vr.id} label={vr.value} value={vr.value} />
    ));
  };

  const renderPlaceHolder = fl => {
    return fl.value;
  };

  const onOpenSelect = fl => {
    console.log('the on open select is trigered right now');
    set_properties(properties.filter(item => item.name !== fl.value));
  };

  const render_predefine_fields = () => {
    if (loading1 == true) {
      // if(1){
      return (
        <View style={styles.spinnerView}>
          <Spinner
            style={styles.spinner}
            isVisible={true}
            size={30}
            type="Circle"
            color="#b92a31"
          />
        </View>
      );
    } else {
      return predefine_fields.map(fl => (
        <TouchableOpacity
          style={styles.predefined_Wrapper}
          animation="fadeInUpBig"
          key={fl.id}>
          <View>
            {/* <Icon active name="remove" /> */}
            <Select
              minWidth="150"
              placeholder={renderPlaceHolder(fl)}
              placeholderStyle={{color: '#2874F0'}}
              note={true}
              onValueChange={value => onValueChange(value, fl)}
              onOpen={() => onOpenSelect(fl)}>
              <Select.Item disabled value="" label="-" />
              {renderVarchars(fl)}
              {/* Select.Item label="Wallet" value="key0" />
                Select.Item label="ATM Card" value="key1" />
                Select.Item label="Debit Card" value="key2" />
                Select.Item label="Credit Card" value="key3" />
                Select.Item label="Net Banking" value="key4" /> */}
            </Select>
          </View>

          <Text style={{paddingRight: 10, fontWeight: '600'}}>{fl.value}</Text>
        </TouchableOpacity>
      ));
    }
  };

  const renderOnOff = fl => {
    const x = properties.find(function (item) {
      return item.name == fl.value;
    });
    if (x) {
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.checkboxsWrapper}
          animation="fadeInUpBig"
          key={fl.id}
          onPress={() => onDeletingingSingleCheckbox({fl})}>
          <View style={styles.checkboxsChecked}>
            <Icon style={{color: '#111', fontSize: 24}} name="ios-checkbox" />
          </View>
          <Text style={{fontWeight: '600', padding: 10}}>{fl.value} </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.uncheckboxsWrapper}
          animation="fadeInUpBig"
          key={fl.id}
          onPress={() => onPressingSingleCheckbox({fl})}>
          <View style={styles.checkboxsChecked}>
            <Icon style={{color: '#555', fontSize: 24}} name="stop-outline" />
          </View>
          <Text style={{fontWeight: '600', padding: 10}}>{fl.value} </Text>
        </TouchableOpacity>
      );
    }
  };

  const render_tick_fields = () => {
    if (loading1 == true) {
      // if(1){
    } else {
      return tick_fields.map(fl => <>{renderOnOff(fl)}</>);
    }
  };

  const renderOrProgress = () => {
    if (!beginUpload) {
      return (
        <>
          <View>
            <HStack
              bg="orange.600"
              px="5"
              py="3"
              justifyContent="space-between"
              alignItems="center"
              w="100%"
              maxW="100%">
              <HStack alignItems="center">
                <Text color="white" fontSize="15" fontWeight="bold">
                  <Icon
                    onPress={() => showAlerting()}
                    style={{color: '#111', fontSize: 24}}
                    name="ios-close"
                  />
                </Text>
              </HStack>

              <HStack>
                <Text color="white" fontSize="17" fontWeight="bold">
                  در دسته بندی {catName} کد {itemId}
                </Text>
              </HStack>
            </HStack>

            <FormControl>
              <Text style={{color: 'gray', margin: 20}}>
                عنوان ملک (کوتاه و چشم گیر)
              </Text>

              <Input
                style={{
                  margin: 10,
                  backgroundColor: 'white',
                  textAlign: 'right',
                  color: 'gray',
                  fontSize: 18,
                }}
                value={title}
                onChangeText={title => set_title(title)}
                placeholder="عنوان ملک را اینجا وارد کنید"
                maxLength={30}
              />

              {render_normal_fields()}
              {render_tick_fields()}
              {render_predefine_fields()}

              <TextArea
                h={150}
                placeholder="توضیحات اختیاری"
                w="100%"
                maxW="100%"
                value={description}
                onChangeText={description => set_description(description)}
                style={{
                  backgroundColor: 'white',
                  textAlign: 'right',
                  fontSize: 18,
                }}
              />

              <TextArea
                h={150}
                placeholder="یادداشت خصوصی : فقط توسط شما قابل مشاهده خواهد بود ، مانند نام مالک ، مقدار کمسیون توافقی و غیره"
                w="100%"
                maxW="100%"
                value={note}
                onChangeText={note => set_note(note)}
                // style={{backgroundColor: 'white', textAlign: 'right'}}
                style={styles.description}
                _focus={{
                  borderColor: 'transparent', // Custom border color when focused
                  backgroundColor: 'white', // Prevent blue background
                }}
              />
            </FormControl>
          </View>
          <Divider />
          <View style={{backgroundColor: 'white'}}>
            <Text
              style={{
                color: 'gray',
                margin: 20,
                fontFamily: 'iransans',
                fontSize: 18,
              }}>
              عکس های ملک
            </Text>
            {renderplusornot()}
          </View>

          <Divider />
          <View>
            <Text style={{color: 'gray', margin: 20}}>ویدیوهای ملک</Text>
            {rendervideoplusornot()}
          </View>

          {loading ? (
            <Button
              style={{marginTop: 20, heigh: 50}}
              full
              outline
              onPress={() => newWorker3()}>
              <Text style={{fontSize: 22, color: '#f1f1f1'}}>مرحله بعد</Text>
            </Button>
          ) : (
            <Button
              style={{marginTop: 20, heigh: 50}}
              full
              outline
              onPress={() => newWorker3()}>
              <Text style={{fontSize: 22, color: '#f1f1f1'}}>مرحله بعد</Text>
            </Button>
          )}
        </>
      );
    } else {
      return (
        <View style={styles.progress_wrapper}>
          <Progress.Bar
            width={350}
            progress={percent / 100}
            size={100}
            color="blue"
            showsText={true}
          />
        </View>
      );
    }
  };

  const renderModalView = () => {
    const handleSubmit = () => {
      calculateAutomatic(normalField.value, predefine_fields_data);

      confirmModal({fl: normalField, value: predefine_fields_data});
    };

    useEffect(() => {
      // Focus the input field after the modal has appeared
      setTimeout(() => {
        if (inputRef.current) {
          Keyboard.dismiss(); // Dismiss the keyboard if it's already open
          inputRef.current.focus();
        } else {
          console.warn('Input ref is not available yet');
        }
      }, 100); // Delay to ensure modal is fully loaded
    }, [isModalVisible]);

    return (
      <View style={styles.modalContent}>
        <Button full light style={styles.valueButton}>
          <Text style={styles.valueText}>
            {normalField.value} - {normalField.unit}
          </Text>
        </Button>

        <Text style={styles.descriptionText}>{numToPersian()}</Text>

        <Input
          ref={inputRef} // Assign the ref here
          autoFocus
          keyboardType="numeric"
          style={styles.inputField}
          placeholder="مقدار را وارد کنید"
          returnKeyLabel={'search'}
          onChangeText={title => set_predefine_fields_data(title)}
          maxLength={14}
          onSubmitEditing={handleSubmit}
        />

        {/* <Button
          full
          light
          style={styles.confirmButton}
  
          onPress={{handleSubmit}}
          // onPress={() =>
            
          //   confirmModal({fl: normalField, value: predefine_fields_data})
          // }
          
          
          
          >
          <Text style={styles.confirmButtonText}>تایید</Text>
        </Button> */}
      </View>
    );
  };

  //////////////////// number show in persian section

  function calculateAutomatic(title, value) {
    console.log('the title is ');
    console.log(title);

    console.log('the value is ');
    console.log(value);

    if (title == 'قیمت') {
      const pilot = properties.filter(item => item.name == 'متراژ کل');
      if (pilot[0]) {
        const calculatedPricePerM2 = value / pilot[0].value;

        const promise = new Promise((resolve, reject) => {
          set_properties(
            properties.filter(item => item.name !== 'قیمت هر متر'),
          );

          const filtered = 'fine';
          resolve(filtered);
        });

        promise.then(filtered => {
          console.log('-----sdfs--sdf-s-sd-fds-f------the result is --------');
          console.log(filtered);

          if (filtered) {
            let prop = {
              name: 'قیمت هر متر',
              value: calculatedPricePerM2.toFixed(0),
              kind: 1,
              special: '1',
              order: '3',
            };
            //  await set_properties([...properties, prop]);
            set_properties(pr => pr.concat(prop));
          }
        });
      }
    }
    if (title == 'متراژ کل') {
      console.log('metraj is focused');

      const price = properties.filter(item => item.name == 'قیمت');
      if (price[0]) {
        const calculatedPricePerM2 = price[0].value / value;

        const promise = new Promise((resolve, reject) => {
          set_properties(
            properties.filter(item => item.name !== 'قیمت هر متر'),
          );

          const filtered = 'fine';
          resolve(filtered);
        });

        promise.then(filtered => {
          console.log('-----sdfs--sdf-s-sd-fds-f------the result is --------');
          console.log(filtered);

          if (filtered) {
            let prop = {
              name: 'قیمت هر متر',
              value: calculatedPricePerM2.toFixed(0),
              kind: 1,
              special: '1',
              order: '3',
            };
            //  await set_properties([...properties, prop]);
            set_properties(pr => pr.concat(prop));
          }
        });
      }
    }

    if (title == 'قیمت هر متر') {
      const pilot = properties.filter(item => item.name == 'متراژ کل');
      if (pilot[0]) {
        const price = pilot[0].value * value;

        const promise = new Promise((resolve, reject) => {
          set_properties(properties.filter(item => item.name !== 'قیمت'));

          const filtered = 'fine';
          resolve(filtered);
        });

        promise.then(filtered => {
          console.log('-----sdfs--sdf-s-sd-fds-f------the result is --------');
          console.log(filtered);

          if (filtered) {
            let prop = {
              name: 'قیمت',
              value: price.toFixed(0),
              kind: 1,
              special: '1',
              order: '3',
            };
            //  await set_properties([...properties, prop]);
            set_properties(pr => pr.concat(prop));
          }
        });
      }
    }
  }

  const numToPersian = () => {
    input = Number(predefine_fields_data);
    if (!input) {
      input = 1;
    }
    // let final = String(PersianJs(input).digitsToWords());
    let final = persianJs(input).digitsToWords().toString();
    return final;

    /**
     *
     * @type {string}
     */
    var delimiter = ' و ';
    /**
     *
     * @type {string}
     */

    var zero = 'صفر';
    /**
     *
     * @type {string}
     */

    var negative = 'منفی ';
    /**
     *
     * @type {*[]}
     */

    var letters = [
      ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
      [
        'ده',
        'یازده',
        'دوازده',
        'سیزده',
        'چهارده',
        'پانزده',
        'شانزده',
        'هفده',
        'هجده',
        'نوزده',
        'بیست',
      ],
      ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
      [
        '',
        'یکصد',
        'دویست',
        'سیصد',
        'چهارصد',
        'پانصد',
        'ششصد',
        'هفتصد',
        'هشتصد',
        'نهصد',
      ],
      [
        '',
        ' هزار',
        ' میلیون',
        ' میلیارد',
        ' بیلیون',
        ' بیلیارد',
        ' تریلیون',
        ' تریلیارد',
        ' کوآدریلیون',
        ' کادریلیارد',
        ' کوینتیلیون',
        ' کوانتینیارد',
        ' سکستیلیون',
        ' سکستیلیارد',
        ' سپتیلیون',
        ' سپتیلیارد',
        ' اکتیلیون',
        ' اکتیلیارد',
        ' نانیلیون',
        ' نانیلیارد',
        ' دسیلیون',
        ' دسیلیارد',
      ],
    ];
    /**
     * Decimal suffixes for decimal part
     * @type {string[]}
     */

    var decimalSuffixes = [
      '',
      'دهم',
      'صدم',
      'هزارم',
      'ده‌هزارم',
      'صد‌هزارم',
      'میلیونوم',
      'ده‌میلیونوم',
      'صدمیلیونوم',
      'میلیاردم',
      'ده‌میلیاردم',
      'صد‌‌میلیاردم',
    ];
    /**
     * Clear number and split to 3 sections
     * @param {*} num
     */

    input = input.toString().replace(/[^0-9.-]/g, '');
    var isNegative = false;
    var floatParse = parseFloat(input); // return zero if this isn't a valid number

    if (isNaN(floatParse)) {
      return zero;
    } // check for zero

    if (floatParse === 0) {
      return zero;
    } // set negative flag:true if the number is less than 0

    if (floatParse < 0) {
      isNegative = true;
      input = input.replace(/-/g, '');
    } // Declare Parts

    var decimalPart = '';
    var integerPart = input;
    var pointIndex = input.indexOf('.'); // Check for float numbers form string and split Int/Dec

    if (pointIndex > -1) {
      integerPart = input.substring(0, pointIndex);
      decimalPart = input.substring(pointIndex + 1, input.length);
    }

    if (integerPart.length > 66) {
      return 'خارج از محدوده';
    } // Split to sections

    var slicedNumber = () => prepareNumber(integerPart); // Fetch Sections and convert

    var out = [];

    for (var i = 0; i < slicedNumber.length; i += 1) {
      var converted = tinyNumToWord(slicedNumber[i]);

      if (converted !== '') {
        out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
      }
    } // Convert Decimal part

    if (decimalPart.length > 0) {
      decimalPart = convertDecimalPart(decimalPart);
    }

    return (isNegative ? negative : '') + out.join(delimiter) + decimalPart;

    var prepareNumber = prepareNumber(num); //tinyNumToWord convert 3tiny parts to word

    var tinyNumToWord = tinyNumToWord(num);
    /**
     * Convert Decimal part
     * @param decimalPart
     * @returns {string}
     * @constructor
     */

    var convertDecimalPart = convertDecimalPart(decimalPart);
    /**
     * Main function
     * @param input
     * @returns {string}
     * @constructor
     */

    var Num2persian = Num2persian(input);

    String.prototype.toPersianLetter = function () {
      return Num2persian(this);
    }; //@depercated

    Number.prototype.toPersianLetter = function () {
      return Num2persian(parseFloat(this).toString());
    };

    String.prototype.num2persian = function () {
      return Num2persian(this);
    };

    Number.prototype.num2persian = function () {
      return Num2persian(parseFloat(this).toString());
    };
  };

  const prepareNumber = num => {
    var out = num;

    if (typeof out === 'number') {
      out = out.toString();
    } //make first part 3 chars

    if (out.length % 3 === 1) {
      out = '00'.concat(out);
    } else if (out.length % 3 === 2) {
      out = '0'.concat(out);
    } // Explode to array

    return out.replace(/\d{3}(?=\d)/g, '$&*').split('*');
  };

  function tinyNumToWord(num) {
    /**
     *
     * @type {string}
     */
    var delimiter = ' و ';
    /**
     *
     * @type {string}
     */

    var zero = 'صفر';
    /**
     *
     * @type {string}
     */

    var negative = 'منفی ';
    /**
     *
     * @type {*[]}
     */

    var letters = [
      ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
      [
        'ده',
        'یازده',
        'دوازده',
        'سیزده',
        'چهارده',
        'پانزده',
        'شانزده',
        'هفده',
        'هجده',
        'نوزده',
        'بیست',
      ],
      ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
      [
        '',
        'یکصد',
        'دویست',
        'سیصد',
        'چهارصد',
        'پانصد',
        'ششصد',
        'هفتصد',
        'هشتصد',
        'نهصد',
      ],
      [
        '',
        ' هزار',
        ' میلیون',
        ' میلیارد',
        ' بیلیون',
        ' بیلیارد',
        ' تریلیون',
        ' تریلیارد',
        ' کوآدریلیون',
        ' کادریلیارد',
        ' کوینتیلیون',
        ' کوانتینیارد',
        ' سکستیلیون',
        ' سکستیلیارد',
        ' سپتیلیون',
        ' سپتیلیارد',
        ' اکتیلیون',
        ' اکتیلیارد',
        ' نانیلیون',
        ' نانیلیارد',
        ' دسیلیون',
        ' دسیلیارد',
      ],
    ];
    /**
     * Decimal suffixes for decimal part
     * @type {string[]}
     */

    var decimalSuffixes = [
      '',
      'دهم',
      'صدم',
      'هزارم',
      'ده‌هزارم',
      'صد‌هزارم',
      'میلیونوم',
      'ده‌میلیونوم',
      'صدمیلیونوم',
      'میلیاردم',
      'ده‌میلیاردم',
      'صد‌‌میلیاردم',
    ];
    // return zero
    if (parseInt(num, 0) === 0) {
      return '';
    }

    var parsedInt = parseInt(num, 0);

    if (parsedInt < 10) {
      return letters[0][parsedInt];
    }

    if (parsedInt <= 20) {
      return letters[1][parsedInt - 10];
    }

    if (parsedInt < 100) {
      var _one = parsedInt % 10;

      var _ten = (parsedInt - _one) / 10;

      if (_one > 0) {
        return letters[2][_ten] + delimiter + letters[0][_one];
      }

      return letters[2][_ten];
    }

    var one = parsedInt % 10;
    var hundreds = (parsedInt - (parsedInt % 100)) / 100;
    var ten = (parsedInt - (hundreds * 100 + one)) / 10;
    var out = [letters[3][hundreds]];
    var secondPart = ten * 10 + one;

    if (secondPart === 0) {
      return out.join(delimiter);
    }

    if (secondPart < 10) {
      out.push(letters[0][secondPart]);
    } else if (secondPart <= 20) {
      out.push(letters[1][secondPart - 10]);
    } else {
      out.push(letters[2][ten]);

      if (one > 0) {
        out.push(letters[0][one]);
      }
    }

    return out.join(delimiter);
  }

  function convertDecimalPart(decimalPart) {
    // Clear right zero
    decimalPart = decimalPart.replace(/0*$/, '');

    if (decimalPart === '') {
      return '';
    }

    if (decimalPart.length > 11) {
      decimalPart = decimalPart.substr(0, 11);
    }

    return (
      ' ممیز ' +
      Num2persian(decimalPart) +
      ' ' +
      decimalSuffixes[decimalPart.length]
    );
  }

  function Num2persian(input) {
    // Clear Non digits
    input = input.toString().replace(/[^0-9.-]/g, '');
    var isNegative = false;
    var floatParse = parseFloat(input); // return zero if this isn't a valid number

    if (isNaN(floatParse)) {
      return zero;
    } // check for zero

    if (floatParse === 0) {
      return zero;
    } // set negative flag:true if the number is less than 0

    if (floatParse < 0) {
      isNegative = true;
      input = input.replace(/-/g, '');
    } // Declare Parts

    var decimalPart = '';
    var integerPart = input;
    var pointIndex = input.indexOf('.'); // Check for float numbers form string and split Int/Dec

    if (pointIndex > -1) {
      integerPart = input.substring(0, pointIndex);
      decimalPart = input.substring(pointIndex + 1, input.length);
    }

    if (integerPart.length > 66) {
      return 'خارج از محدوده';
    } // Split to sections

    var slicedNumber = prepareNumber(integerPart); // Fetch Sections and convert

    var out = [];

    for (var i = 0; i < slicedNumber.length; i += 1) {
      var converted = tinyNumToWord(slicedNumber[i]);

      if (converted !== '') {
        out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
      }
    } // Convert Decimal part

    if (decimalPart.length > 0) {
      decimalPart = convertDecimalPart(decimalPart);
    }

    return (isNegative ? negative : '') + out.join(delimiter) + decimalPart;
  } //@depercated

  //////////////////// end of number show in persian section

  return (
    <ScrollView>
      {renderOrProgress()}

      <Modal
        animationType={'fade'}
        onBackdropPress={() => closeModal()}
        style={styles.modal}
        isVisible={isModalVisible}>
        {/* <Button style={{backgroundColor:'white',justifyContent:'flex-start'}} onPress= { () => this.closeModal()}>
              </Button> */}

        {renderModalView()}
      </Modal>

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="اخطار"
        message="آیا از ثبت ملک خارج میشوید؟"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="نه صبر کن"
        confirmText="آره ، اطمینان دارم"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlerting();
        }}
        onConfirmPressed={() => {
          hideAlerting();
          navigation.pop();
        }}
      />

      <AwesomeAlert
        show={showAlertForNoPic}
        showProgress={false}
        title="ثبت ملک بدون عکس"
        message="ملک با عکس های مناسب به مراتب بیشتر دیده و به آن توجه خواهد شد"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="نه صبر کن"
        confirmText="آره ، اطمینان دارم"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          hideAlertingForNoPic();
        }}
        onConfirmPressed={() => {
          ConfirmAlertingForNoPic();
          newWorker3();
        }}
      />

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item>
            <Box
              width={80}
              style={{
                backgroundColor: 'red',
                margin: 10,
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              <Button
                onPress={() => pickMultipleAgain()}
                size="sm"
                variant={'solid'}>
                انتخاب از گالری
              </Button>
            </Box>
          </Actionsheet.Item>
          <Actionsheet.Item>
            <Box
              width={80}
              style={{
                backgroundColor: 'red',
                margin: 10,
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              <Button size="sm" variant={'solid'}>
                عکس از دوربین
              </Button>
            </Box>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  progress_wrapper: {
    flex: 1,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: 'white',
    // height: '20%' ,
    // width: '80%',
    borderRadius: 10,
    borderWidth: 1,

    marginTop: Dimensions.get('window').height / 10,
    marginBottom: Dimensions.get('window').height / 10,

    // marginLeft: 40,
  },

  predefined_Wrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginLeft: 20,
    // marginRight: 20,
    // margin: 10,
    // paddingtop: 10,
    // borderTopWidth: 1,

    backgroundColor: '#b9272e',
    flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
    justifyContent: 'space-between', // Align children with space between them
    backgroundColor: 'white', // Background color
    padding: 5, // Overall padding
    margin: 10,
    borderWidth: 1, // Border width
    borderColor: '#b9272e', // Border color
    borderRadius: 5, // Rounded corners
    paddingTop: 5, // Specific top padding
  },
  description: {
    fontSize: 18,
    fontFamily: 'iransans',
    backgroundColor: '#b9272e',
    flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
    justifyContent: 'space-between', // Align children with space between them
    backgroundColor: 'white', // Background color
    padding: 5, // Overall padding
    margin: 10,
    borderWidth: 1, // Border width
    borderColor: '#b9272e', // Border color
    borderRadius: 5, // Rounded corners
    paddingTop: 5, // Specific top padding
  },

  checkboxsWrapper: {
    backgroundColor: '#b9272e',
    flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
    justifyContent: 'space-between', // Align children with space between them
    backgroundColor: '#b9272e', // Background color
    padding: 5, // Overall padding
    margin: 10,
    borderWidth: 1, // Border width
    borderColor: '#b9272e', // Border color
    borderRadius: 5, // Rounded corners
    paddingTop: 5,
  },

  checkboxsChecked: {
    color: 'white',
  },

  uncheckboxsWrapper: {
    backgroundColor: '#b9272e',
    flexDirection: 'row', // Equivalent to display: flex and flex-direction: row
    justifyContent: 'space-between', // Align children with space between them
    backgroundColor: 'white', // Background color
    padding: 5, // Overall padding
    margin: 10,
    borderWidth: 1, // Border width
    borderColor: '#b9272e', // Border color
    borderRadius: 5, // Rounded corners
    paddingTop: 5, // Specific top padding
  },

  checkbox: {
    width: 20,
    height: 20,
    marginTop: 10,
  },
  spinnerView: {
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  single_normalFiled: {
    backgroundColor: 'white',
    height: 50,
    padding: 15,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bc323b',
    borderRadius: 5,
    paddingTop: 5,
    fontFamily: 'iransans',
  },

  AddIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    verticalAlign: 'center',
    height: 100,
    width: 100,

    margin: 5,
  },

  imagedAddIcon: {
    padding: 15,
    margin: 5,
    borderColor: 'gray',
    borderStyle: 'dashed',
    borderWidth: 1,

    alignItems: 'center',
    textAlign: 'center',
    verticalAlign: 'center',
  },
  modal: {
    margin: 0, // Fullscreen modal
    zIndex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    width: '80%',
  },

  videoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  videoModalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },

  videoModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
  },

  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    alignItems: 'center',
  },
  valueButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  valueText: {
    fontSize: 18,
    color: '#555',
  },
  descriptionText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#777',
    fontSize: 17,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  videoContainer: {
    margin: 5,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    height: 100,
    width: 100,
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  playIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default EditWorker;
