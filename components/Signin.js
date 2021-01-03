import React ,{Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import {StyleSheet, View ,Text, TextInput , Button ,TouchableOpacity,ToastAndroid, Keyboard ,ActivityIndicator} from 'react-native';
import Axios from 'axios';


export default class Signin extends React.Component {
    state = {
        nom : "",
        prenom : "",
        mail : "",
        password:"",
        loading : false
    }

    CreateCompte =  async() =>{
        Keyboard.dismiss
        this.setState({loading : true})
        await Axios.post('http://192.168.1.9:8080/users',{nom : this.state.nom , prenom : this.state.prenom , mail : this.state.mail , motdepasse : this.state.password ,profile : 'default.jpg',validepic : -1}).then(res =>{
            ToastAndroid.show('Votre compte à été crée', ToastAndroid.SHORT);  
            this.props.navigation.navigate("Login")    
        }).catch(err =>{
            console.error(err)
            this.setState({loading : false})
        })
    }

    static navigationOptions = {
        header: null,
    }
    render(){
        if(this.state.loading == true){
            return (
                <View style={styles.container}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
                </View>
            );

        }else{
            return(
                <View style={styles.container}>
                    <StatusBar style="auto" />
    
                    <Text style={{marginBottom : 50 , fontSize :18 }}>Crée  votre compte maintenant !</Text>
                    <TextInput
                        placeholder={"Nom"}
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : 300 , paddingHorizontal :10  , borderColor : '#3f3d56' , marginBottom : 15 }}
                        onChangeText={(nom) => this.setState({nom : nom})}
                
                    />
                    <TextInput
                        placeholder={"Prenom"}
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : 300 , paddingHorizontal :10  , borderColor : '#3f3d56' , marginBottom : 15 }}
                        onChangeText={(prenom) => this.setState({prenom : prenom})}
                
                    />
                    <TextInput
                        placeholder={"Mail"}
                        keyboardType={"email-address"}
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : 300 , paddingHorizontal :10  , borderColor : '#3f3d56' , marginBottom : 15 }}
                        onChangeText={(val) => this.setState({mail : val})}
                
                    />
                    <TextInput
                    placeholder={"Mot de passe"}
                    secureTextEntry={true}
                    style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : 300 , paddingHorizontal :10  , borderColor : '#3f3d56' ,  marginBottom : 50 }}
                    onChangeText={(password) => this.setState({password : password})}
                    />
                    
                    <TouchableOpacity onPress={() => this.CreateCompte()} style={{ width : 300 , height : 50 , alignItems :"center",  borderRadius: 3 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 50}} >
                        <Text style={{color: '#fff' , fontSize : 16, marginVertical : 9}}>Cree Compte</Text>
                    </TouchableOpacity>
                
                </View>
            );
        }
        
    }
}

    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
    