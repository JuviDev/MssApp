import React, { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firebase from '../database/firebase';
export default function ChatScreen({ user, route }) {
  const [messages, setMessages] = useState([]);
  const { uid } = route.params;
  const getAllMessages = async () => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
    const querySanp = await firebase.db.collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', "desc")
      .get()
    const allmsg = querySanp.docs.map(docSanp => {
      return {
        ...docSanp.data(),
        createdAt: docSanp.data().createdAt.toDate()
      }
    })
    setMessages(allmsg)
  }
  useEffect(() => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
    const messageRef = firebase.db.collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', "desc")
    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data()
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate()
          }
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date()
          }
        }
      })
      setMessages(allmsg)
    })
    return () => {
      unSubscribe()
    }
  }, [])

  const onSend = (messageArray) => {
    const msg = messageArray[0]
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: new Date()
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid

    firebase.db.collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({ ...mymsg })
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          return <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "green",
              }
            }}
          />
        }}

        renderInputToolbar={(props) => {
          return <InputToolbar {...props}
            containerStyle={{ borderTopWidth: 1.5, borderTopColor: 'green' }}
            textInputStyle={{ color: "black" }}
          />
        }}

      />
    </View>
  )
}