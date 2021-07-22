import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ActivityIndicator,Platform } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'
import firebase from '../database/firebase';
import * as Firebase from "firebase"
export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const [state, setState] = useState({
        url:""
    })
    const [uploading, setUploading] = useState(false)
    const [showNext, setShowNext] = useState(false)
   const [loading, setLoading] = useState(false)
   /* */   
    const userSignup = async () => {
       setLoading(true)
        if (!email || !password /*|| !image */|| !name) {
            alert("please add all the field")
            return
        }
        try {
            const result = await firebase.auth.createUserWithEmailAndPassword(email, password)
            firebase.db.collection('users').doc(result.user.uid).set({
                name: name,
                email: result.user.email,
                uid: result.user.uid,
                pic: state.url,
                status: "online"
            })
            setLoading(false)
        } catch (err) {
            alert("something went wrong")
        }
        if (loading) {
            return <ActivityIndicator size="large" color="#00ff00" />
        }

    }
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    const pickImage = async () => {
        console.log('funciano')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
            
        });
        console.log(result);
        if (!result.cancelled) {
            setImage(result.uri);
            
        }
    };


    const uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError('Network request failed'));

            };

            xhr.responseType = 'blob';
            xhr.open('GET', image, true);
            xhr.send(null);
        });

        const ref = firebase.stores.ref().child(new Date().toISOString())
        const snapshot = ref.put(blob)

        snapshot.on(firebase.storis.TaskEvent.STATE_CHANGED, () => {
            setUploading(true)
        }, (error) => {
            setUploading(false)
            console.log(error);
            blob.close()
            return
        },
            () => {
                snapshot.snapshot.ref.getDownloadURL().then((url) => {
                    setUploading(false)
                    console.log("download url: ", url)
                    //blob.close();
                    state.url=(url) 
                    userSignup()                                      
                    return url;
                })

            }
        )
        }
        return (
            <KeyboardAvoidingView behavior="position">
                <View style={styles.box1}>
                    <Text style={styles.text}>Welcome to Whatsapp 5.0</Text>
                    <Image style={styles.img} source={require('../assets/icon.png')} />
                </View>
                <View style={styles.box2}>
                    {!showNext &&
                        <>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                mode="outlined"
                            />
                            <TextInput
                                label="password"
                                mode="outlined"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry
                            />
                        </>
                    }

                    {showNext ?
                        <>
                            <TextInput
                                label="Name"
                                value={name}
                                onChangeText={(text) => setName(text)}
                                mode="outlined"
                            />
                            <Button
                                mode="contained"
                                onPress={() => pickImage()}
                            >select profile pic</Button>
                            <Button
                                mode="contained"
                                // disabled={image?false:true}
                                onPress={() => uploadImage()}
                            >Signup</Button>
                        </>
                        :
                        <Button
                            mode="contained"
                            onPress={() => setShowNext(true)}
                        >Next</Button>
                    }

                    <TouchableOpacity onPress={() => navigation.goBack()}><Text style={{ textAlign: "center" }}>Already have an account ?</Text></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }


    const styles = StyleSheet.create({
        text: {
            fontSize: 22,
            color: "green",
            margin: 10
        },
        img: {
            width: 200,
            height: 200
        },
        box1: {
            alignItems: "center"
        },
        box2: {
            paddingHorizontal: 40,
            justifyContent: "space-evenly",
            height: "50%"
        }
    });