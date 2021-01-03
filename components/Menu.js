import React ,{Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,SafeAreaView, ScrollView ,Alert,TouchableOpacity,BackHandler} from 'react-native';
import { AntDesign , Feather,MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';


export default class Menu extends React.Component {
    
    state = {
        user_id : null,
        user_name : ""
    }

    componentDidMount(){
        this.getLogin()
    }
    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        console.log(user)
        if(user){
            const user_json = JSON.parse(user)
            this.setState({
                user_id : user_json.user_id,
                user_name : user_json.nom+" "+user_json.prenom
            })
        }else{
            this.props.navigation.navigate("Welcome")
        }
    }
    
    logout = async () =>{
        await SecureStore.deleteItemAsync('User');
        this.setState({
            user_id : null,
            user_name : null
        })
        this.props.setLogout()
    }

    render(){
        const createTwoButtonAlert = () =>
        Alert.alert(
          "Déconnexion",
          "Vous allez vous deconnecter",
          [
            {
              text: "Annuler",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "Continuer", onPress: () => this.logout() }
          ],
          { cancelable: false }
        );

        return(

            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <View style={{margin : 10 , padding : 15 ,borderBottomWidth : 1 , borderBottomColor : '#ccc',backgroundColor : '#fcfcfc' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile",{user_id : this.state.user_id})}>

                            <Text style={{fontSize : 18}} > <AntDesign name="user" size={24} color="black" />       Profile </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 10, padding : 15 ,borderBottomWidth : 1 , borderBottomColor : '#ccc',backgroundColor : '#fcfcfc' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("CreateActivite")}>
                            <Text style={{fontSize : 18}} > <Feather name="activity" size={24} color="black" />       Activites </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ margin: 10, padding : 15 ,borderBottomWidth : 1 , borderBottomColor : '#ccc',backgroundColor : '#fcfcfc' }}>
                        <Text style={{fontSize : 18}} > <MaterialIcons name="event-available" size={24} color="black" />       Evenements </Text>
                    </View>
                    <View style={{margin : 10 , padding : 15 ,borderBottomWidth : 1 , borderBottomColor : '#ccc'}}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Amis")}>
                            <Text style={{fontSize : 18}} > <AntDesign name="addusergroup" size={24} color='#3f3d56' />       Amis </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{margin : 10 , padding : 15 ,borderBottomWidth : 1 , borderBottomColor : '#ccc',}}>
                        <Text style={{fontSize : 18}} > <AntDesign name="wechat" size={24} color={'#3f3d56' } />       Chat </Text>
                    </View>
                    <View style={{margin : 10 , padding : 15 ,borderBottomWidth : 1 , borderBottomColor : '#ccc', }}>
                        <TouchableOpacity onPress={createTwoButtonAlert}>
                            <Text style={{fontSize : 18}} ><AntDesign name="logout" size={24} color='#3f3d56' />        Deconnexion </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop:0,
      backgroundColor : '#fff'
    },
    scrollView: {
      backgroundColor: 'pink',
      marginHorizontal: 20,
    },
    text: {
      fontSize: 42,
    },
  });