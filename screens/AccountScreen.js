import React,{useEffect,useState} from 'react'
import { View, Text,ActivityIndicator ,StyleSheet,Image} from 'react-native'
import firebase from '../database/firebase'
import Feather from 'react-native-vector-icons/Feather'
import {Button} from 'react-native-paper'
import { Input } from 'react-native-elements/dist/input/Input'
export default function AccountScreen({user}) {
     const [profile,setProfile] = useState('')

     useEffect(()=>{
        firebase.db.collection('users').doc(user.uid).get().then(docSnap=>{
           setProfile(docSnap.data())
        })
        },[])
     
    return (
        <View style={styles.container}>
            <Image style={styles.img} source={{uri:profile.pic}} />
            <Text style={styles.text}>Name: {profile.name}</Text>
            <View style={{flexDirection:"row"}}>
                <Feather name="mail" size={30} color="white" />
                <Text style={[styles.text,{marginLeft:10}]}>{profile.email}</Text>
            </View>
            <Button
                style={styles.btn}
                mode="contained"
                onPress={()=>{
                    firebase.db.collection('users')
                    .doc(user.uid)
                    .update({                    
                    }).then(()=>{
                         firebase.auth.signOut()
                    })
                }}
            >Logout</Button>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"green",
        alignItems:"center",
        justifyContent:"space-evenly"
    },
    img:{
        width:200,
        height:200,
        borderRadius:100,
        borderWidth:3,
        borderColor:"white"
    },
    text:{
        fontSize:23,
        color:"white"
    },
    btn:{
        borderColor:"white",
        borderWidth:3
    }
})