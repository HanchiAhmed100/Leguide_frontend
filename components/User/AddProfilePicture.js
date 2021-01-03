import React ,{Component} from 'react'
import { View,Text ,StatusBar ,Dimensions,ToastAndroid,Image,TouchableOpacity, TouchableHighlight,ActivityIndicator} from 'react-native'

import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';

import Axios from 'axios';


export default class AddProfilePicture extends React.Component{

    state = {
        loading : false,
        user_id : '',
        user_name : '',
        image_uri : '',
        image : false,
        OldPic : '',
        user : []
    }

    componentDidMount(){
        console.log("imagge "+this.state.image_uri)
        this.getLogin();
    }

    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        if(user){
            const user_json = JSON.parse(user)
            console.log("uddd"+user_json.user_id)
            this.setState({
                user : user,
                user_id : user_json.user_id,
                user_name : user_json.nom+" "+user_json.prenom,
                image_uri : 'http://192.168.1.9:8080/uploads/images/profile/'+user_json.profile
            })
        }else{
            this.props.navigation.navigate("Welcome")
        }
    }


    PickImage = async () =>{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });
        
        console.log(result);

        if (result.cancelled) {
            ToastAndroid.show(`Demande Annuller`, ToastAndroid.SHORT);  
        }
        this.setState({OldPic : this.state.image_uri})
        this.setState({  image_uri : result.uri , image: true })
    }

    sendPick = async () =>{
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = this.state.image_uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        // Upload the image using the fetch and FormData APIs
        let formData = new FormData();

        formData.append('file', { uri: localUri, name: this.state.user_id+'.jpg', type });

        await Axios.post(`http://192.168.1.9:8080/uploads/profile/${this.state.user_id}`,formData,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(res =>{
            console.log(res.data)
            ToastAndroid.show(`Changement avec success `, ToastAndroid.SHORT);  
            this.props.navigation.navigate("Home")
        }).catch(err=>{     
            console.error(err)
        })
    }
    setDefaultPictureOk = async () =>{
        await Axios.get(`http://192.168.1.9:8080/user/validate/${this.state.user_id}`).then(res =>{
            if(res.data.STATUS == "OK"){
                this.props.navigation.navigate("Home")
            }
            console.log("ddd"+res.data.STATUS)
            this.resetStorageDelete()
            ToastAndroid.show(`Erreur`, ToastAndroid.SHORT);  

        }).catch(err =>{
            console.error(err)
        })
    }
    resetStorageDelete = async () =>{
        await SecureStore.deleteItemAsync("User")
        this.resetStorageUpdate()
    }
    resetStorageUpdate = async () =>{
        const u = this.state.user
        u.validepic = 1 ;
        console.log("this is u : "+JSON.stringify(u))
        this.setState({ user : JSON.stringif(u)})
        console.log("after u ; " +this.state.user)
        await SecureStore.setItemAsync("User", JSON.stringify(this.state.user))

    }

    resetPick = () =>{
        this.setState({image : false , image_uri :this.state.OldPic })
    }


    render(){
        const mywidht = (Dimensions.get('window').width) - 40

        if(this.state.loading){
            return (
                <View style={{flex: 1,backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center'}}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
                </View>
            )
        }else{
            return(
                <View style={{flex: 1,backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center',paddingBottom : 50}}>
                    <Text style={{padding : 10 , fontSize : 22}}> Bonjour { this.state.user_name} </Text>
                    <Text style={{padding : 10,fontSize : 18 }}> Voici votre photo actuelle vous voulez la changer</Text>
                    <Image  source={{uri : this.state.image_uri}} style={{width: mywidht-70 ,resizeMode : 'cover', height:mywidht-70 , borderRadius:5  }} />


                    { !this.state.image ?
                        <View style={{ flexDirection:"row" , padding : 10}}>
                            <TouchableOpacity onPress={() =>  this.PickImage()} style={{ width : 110 , height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 20, marginRight : 6}} >
                                <Text  style={{color: '#fff' , fontSize : 16, marginVertical : 5}} > Choisir</Text>
                            </TouchableOpacity>

                            <TouchableHighlight style={{ width : 110 , height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#fff', borderWidth : 2 , borderColor : '#3f3d56' , padding : 3 , marginTop : 20,marginLeft : 6}}
                                onPress={() => this.setDefaultPictureOk()}>
                                <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 5}} >Annuler</Text>
                            </TouchableHighlight>
                        </View>
                        : 
                        <View style={{ flex:1 , padding : 10}}>
                            <TouchableOpacity onPress={() =>  this.sendPick()} style={{ width : mywidht-60, height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 20 }} >
                                <Text  style={{color: '#fff' , fontSize : 16, marginVertical : 5}} > Envoyer</Text>
                            </TouchableOpacity>

                            <TouchableHighlight style={{ width : mywidht-60 , height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#fff', borderWidth : 2 , borderColor : '#3f3d56' , padding : 3 , marginTop : 20}}
                                onPress={() => this.resetPick()}>
                                <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 5}} >Annuler</Text>
                            </TouchableHighlight>
                        </View>
                                
                    }   
                </View>
            )
        }
    }

}