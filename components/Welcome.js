import React ,{Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button ,TouchableOpacity,Image } from 'react-native';
import logo from '../img/img1.png'
import * as SecureStore from 'expo-secure-store';


export default class Welcome extends React.Component{
    static navigationOptions = {
        header: null,
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <View style={styles.container}>
                <StatusBar style="auto" />

                <Text style={{ color : '#9bff63' , fontSize : 26  ,marginBottom : 100  , textAlign :"left" ,}}> Le Guide <Text style={{color : "#3f3d56" ,fontSize : 18}}>pour tous vos activites </Text> </Text>
                <Image source={logo} style={{marginTop : 10,  width: 350, height: 250 }} />
                <TouchableOpacity onPress={() => navigate('Login')} style={{ width : 300 , height : 50 , alignItems :"center",  borderRadius: 3 , backgroundColor : '#fff', borderWidth : 2 , borderColor : '#3f3d56' , padding : 3 , marginTop : 50}} >
                    <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Acceder a votre compte</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigate('Signin')} style={{ width : 300 , height : 50 , alignItems :"center",  borderRadius: 3 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 25}} >
                    <Text style={{color: '#fff' , fontSize : 16, marginVertical : 9}}>Cree un compte </Text>
                </TouchableOpacity>
            </View>
        )
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
    


