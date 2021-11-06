
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Navigator, LogBox,StatusBar,Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import firebase from './database/firebase'
import { Avatar } from 'react-native-elements';

import ChatScreen from './screens/ChatScreen';
import AccountScreen from './screens/AccountScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'

if(Platform.OS === "android"){
  LogBox.ignoreAllLogs()
}

const Stack = createStackNavigator();

const Navigation = ()=>{
  const [user,setuser] = useState('')
  useEffect(()=>{
   const unregister =  firebase.auth.onAuthStateChanged(userExist=>{
      if(userExist){
       
        firebase.db.collection('users')
        .doc(userExist.uid)
        .update({
          status:"online"
        })
        setuser(userExist)


      } 
 
      else setuser("")
    })

    return ()=>{
      unregister()
    }

  },[])
  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{
         headerTintColor:"green"
       }}
      
      >
        {user?
        <>
        <Stack.Screen name="home"  options={{
          title:"MssApp"}}> 
         {props => <HomeScreen {...props}  user={user} />}
        </Stack.Screen>
        <Stack.Screen name="chat" options={({ route }) => ({ title:<View style={styles.title}><Text>{route.params.name}</Text><Text>{route.params.status}</Text></View>,
       headerRight:() => (
        <View style={styles.avatar} >
          <Avatar
            rounded
            source={{uri:route.params.pic}}/>
        </View>

      )})}>
          {props => <ChatScreen {...props} user={user} /> }
        </Stack.Screen>
        <Stack.Screen name="account">
          {props => <AccountScreen {...props} user={user}/> }
        </Stack.Screen>
        </>
        :
        <>
        <Stack.Screen name="login" component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="signup" component={SignupScreen} options={{headerShown:false}}/>
        </>
        }
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const App = () => {


  return (
    <>
     
      <StatusBar barStyle="light-content" backgroundColor="green" />
       <View style={styles.container}>
         <Navigation />
       </View>
      

    </>
  );
};

const styles = StyleSheet.create({
   container:{
     flex:1,
     backgroundColor:"white"
   },
   avatar:{
     marginRight: 20

   },
   title:{
    //marginLeft: 30,
    alignItems: 'center',
    justifyContent: 'center',

   }
});

export default App;
