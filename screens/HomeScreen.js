import React,{useState,useEffect} from 'react'
import { View, Text ,Image,FlatList,StyleSheet,TouchableOpacity,ActivityIndicator} from 'react-native'
import firebase from '../database/firebase';
import {FAB, Searchbar} from 'react-native-paper'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
export default function HomeScreen({user,navigation}) {
   // console.log(user)
    const [users,setUsers] = useState(null)
    const [userss, setUserss] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const getUsers = async ()=>{
             const querySanp = await firebase.db.collection('users').where('uid','!=',user.uid).get()
             const allusers = querySanp.docs.map(docSnap=>docSnap.data())
            //  console.log(allusers)
             setUserss(allusers)
    }

    const searchUser= userss.filter((item)=>{
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1

    })

    useEffect(()=>{
        getUsers()
    },[])
    if(!userss){
        return  <ActivityIndicator size="large" color="#00ff00" />
    }
    return (
        <>
        <Searchbar
                    placeholder="Search..."
                    onChangeText={(value)=>setSearchTerm(value)}/>
                    <KeyboardAwareScrollView>
    {searchUser.map(item => {
          return (
              <TouchableOpacity onPress={()=>navigation.navigate('chat',{name:item.name,uid:item.uid,
                status :typeof(item.status) =="string"? item.status : item.status.toDate().toString(),
                pic:item.pic
            })}>
              <View style={styles.mycard}>
                <Image source={{uri:item.pic}} style={styles.img}/>
                  <View>
                      <Text style={styles.text}>
                          {item.name}
                      </Text>
                      <Text style={styles.text}>
                          {item.email}
                      </Text>
                  </View>
              </View>
              </TouchableOpacity>
          )
    })}
    </KeyboardAwareScrollView>                  
             <FAB
                style={styles.fab}
                icon="face-profile"
                color="black"
                onPress={() => navigation.navigate("account")}
            />        
        </>
    )
}


const styles = StyleSheet.create({
   img:{width:60,height:60,borderRadius:30,backgroundColor:"green"},
   text:{
       fontSize:18,
       marginLeft:15,
   },
   mycard:{
       flexDirection:"row",
       margin:3,
       padding:4,
       backgroundColor:"white",
       borderBottomWidth:1,
       borderBottomColor:'grey'
   },
   fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:"white"
  },
 });