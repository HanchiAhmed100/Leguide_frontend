import React ,{Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,TextInput , Button ,TouchableOpacity,ToastAndroid ,ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


export default class Login extends React.Component {

    state = { 
        mail : "",
        password : "",
        data : [],
        err:"",
        loading : false
      }
      
    login = async () => {
        this.setState({loading : true})
        await axios.post("http://192.168.1.9:8080/userauth",{mail : this.state.mail, password : this.state.password})
        .then(res => {
            if(res.data.AUTH == "FAILED"){
                ToastAndroid.show(''+res.data.DESC, ToastAndroid.SHORT);      
            }else{
              this.setState({data : res.data.USER})
              this.setStorage()
              this.props.SetUserTrue()
            }
        }).catch(err =>{
          console.error(err)
          this.state.err = err
        })
        this.setState({loading : false})

    }

    setStorage = async () =>{
      await SecureStore.setItemAsync("User", JSON.stringify(this.state.data))
    }
          
    static navigationOptions = {
        header: null,
    }
    render(){

        const {navigate} = this.props.navigation;
        if(this.state.loading == true){
          return (
            <View style={styles.container}>
              <StatusBar style="auto" />
              <ActivityIndicator size="large" color="#3f3d56" />
            </View>
          )
        }else{
          return (
            <View style={styles.container}>
              <StatusBar style="auto" />
              
              <Text style={{marginBottom : 50 , fontSize :18 }}>Acceder a votre compte maintenant !</Text>
              <TextInput
                placeholder={"Mail"}
                keyboardType={"email-address"}
                style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : 300 , paddingHorizontal :10  , borderColor : '#3f3d56'}}
                onChangeText={(val) => this.setState({mail : val})}
      
              />
        
              <TextInput
                placeholder={"Mot de passe"}
                secureTextEntry={true}
                style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : 300 , paddingHorizontal :10  , borderColor : '#3f3d56' , marginTop : 15}}
                onChangeText={(password) => this.setState({password : password})}
              />
              
              <TouchableOpacity onPress={() => this.login()} style={{ width : 300 , height : 50 , alignItems :"center",  borderRadius: 3 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 100}}  >
                <Text style={{color: '#fff' , fontSize : 16, marginVertical : 9}}>Connexion</Text>
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
    