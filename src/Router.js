import React, { Component } from 'react';
import { Text,View,StyleSheet,  BackHandler,BackAndroid,ToastAndroid,PixelRatio } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Root, Icon,Button, Badge } from 'native-base';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import Spinner from 'react-native-spinkit';
import axios from 'axios';
import { useFocusEffect,useNavigation } from '@react-navigation/native';
import Base from './components/Base';
import Landing from './components/Landing';

import Categories from './components/Categories';

import Mainmap from './components/Mainmap';

import Entro from './components/Entro';


import Settings from './components/sellertabs/Settings';


import ControlPanel from './components/ControlPanel';

import categoryIndex from './components/category/categoryIndex';


import workerSingle from './components/worker/workerSingle';

import EditWorker from './components/worker/edit/EditWorker';

import newWorker from './components/worker/newWorker';
import newWorker2 from './components/worker/newWorker2';
import newWorker3 from './components/worker/newWorker3';
import newWorkerFinal from './components/worker/newWorkerFinal';
import EntroWorker from './components/worker/EntroWorker';

import report from './components/worker/report';

import reportRealstate from './components/realstate/report';


import Single from './components/worker/edit/Single';
import Review from './components/worker/edit/Review';
import Edit from './components/worker/edit/EditWorker';




import Login from './components/login/Login';
import Validation from './components/login/Validation';

import Rlogin from './components/realstate/auth/login';
import Rregister from './components/realstate/auth/register';
import Rvalidation from './components/realstate/auth/validation';

import EditRealstate from './components/realstate/edit';
import Rlocation from './components/realstate/location';

import Rdashboard from './components/realstate/dashboard';
import Rsetting from './components/realstate/setting';
import Rpolicy from './components/realstate/policy';

import Rshow from './components/realstate/front/single';




import History from   './components/sidebar/History';
import Liked from   './components/sidebar/Liked';
import MyAdds from   './components/sidebar/MyAdds';


import About from   './components/sidebar/About';
import Contact from './components/sidebar/Contact';
import Rolls from   './components/sidebar/Rolls';
import Privacy from   './components/sidebar/Privacy';

var backButtonPressedOnceToExit = false;

class TabIcon extends React.Component {

  constructor() {
    super();


  }



  render() {
    /** some styling **/

    if(this.props.iconName == 'ios-add-circle'){

      return(
        <View >
          <Icon   name={this.props.iconName} style={{color: '#888'}} />
        </View>
      )

    }else{

      return(
        <View >
          <Icon   name={this.props.iconName} style={{color: '#888'}} />
        </View>
      )

    }


  }
}

export default class RouterComponent extends Component {

  constructor() {
    super();
    this.state = {   doubleBackToExitPressedOnce: false,usercity: 'تهران' ,
                    hasToken: false,visitedbefore: null, isLoaded: true,
                    hasplace: '',hasregion: '',unreadmessage: 0,initialPosition: 'unknown'};
    this.rightMenuButton = this.rightMenuButton.bind(this);
    this.leftMenuButton = this.leftMenuButton.bind(this);
  }





  componentDidMount() {



    // get the user location here







    AsyncStorage.getItem('id_visitbefore').then((visit) => {
      if(visit !== 'true'){
        this.setState({ visitedbefore: true })
      }else{
        this.setState({ visitedbefore: null })
      }
      // this.setState({ visitedbefore: visit !== null })
      console.log('user visited before flag :');
      console.log(visit);
    });

    AsyncStorage.getItem('user_city_name').then((cityname) => {
      this.setState({ hasplace: cityname })
    });
    AsyncStorage.getItem('user_region_name').then((regionname) => {

        this.setState({ hasregion: regionname })


    });



  }





componentWillUnmount(){
  BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this));
  }




  onBackPress() {


    if (backButtonPressedOnceToExit) {
        BackAndroid.exitApp();
    } else {
        if (Actions.currentScene === 'Base'){

            backButtonPressedOnceToExit = true;
            ToastAndroid.show("برای خروج دکمه بازگشت را مجددا بفشارید",ToastAndroid.SHORT);
            //setting timeout is optional
            setTimeout( () => { backButtonPressedOnceToExit = false }, 2000);
            return true;
        }
    }
    }







  Sidebar(){
    console.log('you click right button to enter sidebar');
    Actions.refresh;
    Actions.SidebarSection();


  }

  newWorker(){

    AsyncStorage.getItem('id_token').then((token) => {
      var self = this;
      if(token == null){
        Actions.Login();
      }else{
        Actions.WorkerSection();
      }

    });
  }





  rightMenuButton(){

    var self = this;
    return(
      <View style={{alignItems:'center'}}>

      <Button  style={{backgroundColor:'transparent',elevation: 0,alignItems:'center',justifyContent:'center',padding:10}} vertical onPress= { () => this.Sidebar()} >

        <Icon   name='menu' style={{color: '#222'}} />

      </Button>
    </View>
    )

  }


    leftMenuButton(){

      var self = this;
      return(
        <View style={{alignItems:'center'}}>

        <Button  style={{backgroundColor:'transparent',elevation: 0,alignItems:'center',justifyContent:'center',padding:10}} vertical onPress= { () => this.newWorker()} >

            <Icon   name='ios-add-circle' style={{color: '#555'}} />

        </Button>
      </View>
      )

    }



render() {

return(
  <Root>
    <Router backAndroidHandler={this.onBackPress}>
      <Scene key="Start"  hideNavBar>

            <Scene hideNavBar key="Base" component= { Base } title= "base" />
            <Scene  hideNavBar key="categoryIndex" component= { categoryIndex } title= "category selection" />

         <Scene hideNavBar   key="Main" title= "آ جر" titleStyle={{ color: '#24248f', alignSelf: 'center' }} renderLeftButton={this.leftMenuButton} renderRightButton={this.rightMenuButton}   >

            <Scene hideNavBar key="Landing" component= { Landing } title= "Landing" />
            <Scene hideNavBar key="Categories" component= { Categories } title= "Categories" />
            
            <Scene  key="Mainmap" hideNavBar component= { Mainmap }   />


        </Scene>

        <Scene hideNavBar key="workerRoot" title= "ajour" titleStyle={{ color: '#24248f', alignSelf: 'center' }}   >
            <Scene hideNavBar key="workerSingle" component= { workerSingle } title= "single worker" />
            <Scene hideNavBar key="report" component= { report } title= "report" />
        </Scene>
        <Scene key="firstboot" hideNavBar   initial= {this.state.visitedbefore } >
            <Scene hideNavBar key="intro" component= { Entro } title= "entro" />
        </Scene>

        <Scene hideNavBar   key="MyAdds"  component= { MyAdds }  title="myAdds"/>
        <Scene hideNavBar  key="SidebarSection"   title="settings" >

              <Scene  hideNavBar  key="ControlPanel"  component= { ControlPanel } />

              <Scene  hideNavBar  key="Rolls"  component= { Rolls } />
              <Scene  hideNavBar  key="Privacy"  component= { Privacy } />
              <Scene  hideNavBar  key="About"  component= { About } />
              <Scene  hideNavBar  key="Contact"  component= { Contact } />
              <Scene hideNavBar key="Login" component= { Login } title= "Login" />
              <Scene hideNavBar key="validation" component= { Validation } title= "sms"  />

              <Scene hideNavBar key="EntroWorker" component= { EntroWorker } title= "معرفی کسب و کار" />

              <Scene  hideNavBar  key="newWorkerFinal"  component= { newWorkerFinal } />
              <Scene hideNavBar   key="History"  component= { History } />
              <Scene hideNavBar   key="Liked"  component= { Liked } />

              <Scene hideNavBar key="Review" component= { Review } title= "Review Edit" />
        </Scene>

        <Scene hideNavBar key="Single" component= { Single } title= "Single Edit" />

      <Scene   key="newWorker"  component= { newWorker } />
      <Scene  hideNavBar  key="newWorker2"  component= { newWorker2 } />
      <Scene  hideNavBar  key="newWorker3"  component= { newWorker3 } />

      
      <Scene   key="EditWorker"  component= { EditWorker } />

      



  {/* have footer for real state section */}


  <Scene hideNavBar   key="Rregister"  component= { Rregister } />
  <Scene hideNavBar   key="Rlogin"  component= { Rlogin } />
  <Scene hideNavBar   key="Rvalidation"  component= { Rvalidation } />
  <Scene hideNavBar   key="Rpolicy"  component= { Rpolicy} />
  <Scene hideNavBar   key="RInitialLocation"  component= { Rlocation} />


<Scene hideNavBar key="reportRealstate" component= { reportRealstate } title= "reportRealstate" />

  <Scene key="realstate"    hideNavBar tabs={true}
    tabBarPosition="bottom"
  	activeBackgroundColor="#282828"
  	inactiveBackgroundColor="#282828"
  	inactiveTintColor="#6E6E6E"
  	activeTintColor={'white'}
  	tabBarStyle={{
  		backgroundColor: '#282828'
  	}}
  	tabStyle={{

  	}}
  	swipeEnabled={false}
  	animationEnabled={false}
  	panHandlers={null}
  	initial={false}




     >
      <Scene key="dashboardwithfooer"  hideNavBar title="خانه" iconName="file-tray-full-outline" icon={TabIcon}>
        <Scene hideNavBar   key="Rdashboard"  component= { Rdashboard}  />
        <Scene hideNavBar   key="EditRealstate"  component= { EditRealstate}  />
        <Scene hideNavBar   key="Rlocation"  component= { Rlocation}  />
      </Scene>

      <Scene key="newwithfooer"  hideNavBar title="جدید" iconName="ios-add-circle-outline" icon={TabIcon}>
        <Scene hideNavBar   key="realstatenewWorker"  component= { newWorker} />
      </Scene>

      <Scene key="settingwithfooer"  hideNavBar title="من" iconName="ios-person-outline" icon={TabIcon}>

        <Scene hideNavBar   key="Rsetting"  component= { Rsetting} />

      </Scene>



  </Scene>

  {/* end of have footer for realstate section */}


  <Scene  hideNavBar  key="Rshow"  component= { Rshow } />










  </Scene>
</Router>
</Root>

)


}
};



const styles = StyleSheet.create({

  spinnerView:{
    flex: 1,
    height:430,
    justifyContent: 'center',
    alignItems: 'center'
  },

  spinner:{


  },
    tabBar: {
    borderTopColor: 'darkgrey',
    borderTopWidth: 1 / PixelRatio.get(),
    backgroundColor: 'ghostwhite',
    opacity: 0.98
  },
  navigationBarStyle: {
    backgroundColor: 'red',
  },
  navigationBarTitleStyle: {
    color:'white',
  },
});
