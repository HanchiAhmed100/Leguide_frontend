import React ,{Component} from 'react';
import { Alert, Text,Image ,View,TouchableHighlight,TextInput ,Dimensions ,Modal ,StatusBar,TouchableOpacity ,ActivityIndicator ,StyleSheet, ToastAndroid} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import {Picker} from '@react-native-picker/picker';

import AddMap from './AddMap.js'


export default class CreateActivite extends React.Component{

    state = {
        user_name : '',
        user_id : '',
        activite_name : '',
        description : '',
        Type : 'Exterieur',
        loading : false,
        showModal : false,
        image_uri : null,
        image : false,
        activite_id : '',
        mapModal : false,
    }
    componentDidMount(){
        this.getLogin()
        this.askPermission()
    }
    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        const user_json = JSON.parse(user)
        this.setState({
            user_id : user_json.user_id,
            user_name : user_json.nom+" "+user_json.prenom
        })
    }
    askPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                ToastAndroid.show('Sorry, we need camera roll permissions to make this work!', ToastAndroid.SHORT);
            }
        }
    }



    CreateActivite = async () =>{
        this.setState({loading : true})
        await Axios.post('http://192.168.1.9:8080/activite',{
            type : this.state.Type,
            nom : this.state.activite_name,
            description : this.state.description,
            activite_admin : this.state.user_id,
            cover : 'default.jpg'
        }).then(res =>{
            this.setState({loading : false})
            ToastAndroid.show(`Creation d'activite ${this.state.activite_name}`, ToastAndroid.SHORT);  
            this.setState({activite_id : res.data.activite_id})
            this.setState({showModal : true})
        }).catch(err =>{
            console.error(err)
        })

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
        this.setState({image_uri : result.uri , image: true})
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

        formData.append('file', { uri: localUri, name: this.state.activite_id+'.jpg', type });

        await Axios.post(`http://192.168.1.9:8080/uploads/cover/${this.state.activite_id}`,formData,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(res =>{
            console.log(res.data)
            this.setState({showModal : false , mapModal : true})

        }).catch(err=>{     
            console.error(err)
        })
    }



    resetPick = () =>{
        this.setState({image : false , image_uri : null})
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
                <View style={{flex : 1,alignItems: 'center',justifyContent: 'center',}}>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.showModal}
                        onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={{fontSize : 22 , padding : 5}}>Votre activite à été Crée</Text>
                                <Text style={{fontSize : 18 ,textAlign : "center" , marginBottom :10}}> Cliquez sur "Choisir" pour ajouter une image à votre activite </Text>
                                
                                <Image  source={{uri : this.state.image_uri}} style={{width: mywidht-70 ,resizeMode : 'cover', height:mywidht-70 , borderRadius:5  }} />
                                { !this.state.image ?
                                <View style={{ flexDirection:"row" , padding : 10}}>
                                    <TouchableOpacity onPress={() =>  this.PickImage()} style={{ width : 110 , height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 20, marginRight : 6}} >
                                        <Text  style={{color: '#fff' , fontSize : 16, marginVertical : 5}} > Choisir</Text>
                                    </TouchableOpacity>

                                    <TouchableHighlight style={{ width : 110 , height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#fff', borderWidth : 2 , borderColor : '#3f3d56' , padding : 3 , marginTop : 20,marginLeft : 6}}
                                        onPress={() => this.setState({showModal : !this.state.showModal})}>
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
                        </View>
                    </Modal>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.mapModal}
                        onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        }}>
                        <View style={styles.allview}>
                            <AddMap activite_id={this.state.activite_id}/>
                        </View>
                    </Modal>


                    <StatusBar style="auto" />
                    <Text style={{marginBottom : 30 , textAlign : "left" , fontSize : 22 ,fontWeight :"bold"}}>Creer une activite</Text>
                    <Text style={{fontSize :18 , marginBottom :10}}>Administrateur : {this.state.user_name} </Text>
                    <TextInput
                            placeholder={"Nom de l'activite "}
                            style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : mywidht , paddingHorizontal :10  , borderColor : '#3f3d56' , marginBottom : 15 }}
                            onChangeText={(name) => this.setState({activite_name : name})}
                        />
                    <TextInput
                        placeholder={"Description"}
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : mywidht , paddingHorizontal :10  , borderColor : '#3f3d56' , marginBottom : 15 }}
                        onChangeText={(description) => this.setState({description : description})}
                    />


                    <View style={{borderWidth : 1.5 ,borderColor :'gray' , borderRadius : 3 , padding:0,}}>
                    <Picker
                        selectedValue={this.state.Type}
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1.5 ,borderRadius : 3 , width : mywidht , paddingHorizontal :10  , borderColor : '#3f3d56' }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({Type: itemValue})
                        }>
                        <Picker.Item label="Exterieur" value="Exterieur" />
                        <Picker.Item label="Interieur" value="Interieur" />
                    </Picker>
                    </View>

                    <TouchableOpacity onPress={() => this.CreateActivite()} style={{ width : mywidht , height : 50 , alignItems :"center",  borderRadius: 3 , backgroundColor : '#3f3d56' , padding : 3 , marginTop : 50}} >
                        <Text style={{color: '#fff' , fontSize : 16, marginVertical : 9}}>Cree Activite</Text>
                    </TouchableOpacity>   
 

                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    allview:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 1,
        
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      backgroundColor: '#F194FF',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });