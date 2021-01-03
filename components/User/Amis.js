import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons'; 

import moment from 'moment';
import 'moment/locale/fr';

import Constants from 'expo-constants';
import Axios from 'axios';


export default class Amis extends React.Component{
    state = {
        user_id : '',
        friends : [],
        waiting : [],
        amis : true

    }

    async componentDidMount(){
        await this.getLogin()
        await this.getInvitations()
    }

    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        const user_json = JSON.parse(user)
        this.setState({
            user_id : user_json.user_id,
            user_name : user_json.nom+" "+user_json.prenom
        })
    }

    getInvitations = async() =>{
        this.setState({loading : true})
        console.log("dajda :"+this.state.user_id)
        await Axios.get(`http://192.168.1.9:8080/amis/my/${this.state.user_id}`).then(res=>{
            console.log(res.data)
            this.setState({waiting : res.data.waiting,friends : res.data.Friend})
        }).catch(err =>{
            console.error(err)
        })
        this.setState({loading : false})
    }




    render(){
        const mywidht = (Dimensions.get('window').width) - 40
        const txtFiledWidht = mywidht - 105
        const iconWidth = mywidht/5
        const half = (Dimensions.get('window').width)/2 

        if(this.state.loading){
            return (
                <View style={{flex: 1,backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center'}}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
              </View>
            )
        }else{
            return(
                <SafeAreaView style={{backgroundColor:'#fff', margin : 0 ,padding :0}}>
                        <View style={{marginTop : 5,marginLeft: 20,marginRight : 20,marginBottom : 22, paddingTop :0 ,paddingLeft : 0 ,paddingRight: 0,paddingBottom :10,borderBottomWidth: 1,borderBottomColor: '#fff',backgroundColor : '#fcfcfc',borderRadius : 7,padding: 10,width : mywidht}}>
                            <View>
                                <View style={{padding: 10}}>
                                    <View style={{ flexDirection:"row", height : 40   }}> 
                                        <TouchableOpacity onPress={() => this.setState({amis : true})}style={{ width : 130 ,marginRight:15, height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                            <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Amis</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.setState({amis : false})} style={{ width : 130 ,marginLeft : 15, height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                            <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Invitations</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>   
                { this.state.amis ?(
                
                <FlatList
                    ListHeaderComponent={<>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 , marginVertical : -38 , marginLeft : 50 ,textTransform :'capitalize'}}> Amis  </Text>
                    </>}
                    style={{marginTop: Constants.statusBarHeight}}
                    data={this.state.friends}
                    keyExtractor={item => item.relation_id.toString()}
                    renderItem={({ item }) => (                       
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Profile',{user_id : item.sender.user_id})}>
                            <View style={{marginTop : 5,marginLeft: 20,marginRight : 20,marginBottom : 22, paddingTop :0 ,paddingLeft : 0 ,paddingRight: 0,paddingBottom :10,borderBottomWidth: 1,borderBottomColor: '#fff',backgroundColor : '#fcfcfc',borderRadius : 7,padding: 10,width : mywidht}}>
                                <View>
                                    <View style={{padding: 10}}>
                                        <View style={{ flexDirection:"row"}}> 
                                            <View style={{width : mywidht - 80}}>
                                                <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.sender.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                                <Text style={{ fontWeight: 'bold', fontSize: 20 , marginVertical : -38 , marginLeft : 50 ,textTransform :'capitalize' }}>   {item.sender.nom}  {item.sender.prenom}</Text>
                                            </View>
                                            <AntDesign name="arrowright" style={{marginVertical : 15}}size={24} color="black" />

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                ) : (
                <FlatList
                    ListHeaderComponent={<>
                        <Text style={{ fontWeight: 'bold', fontSize: 20 , marginVertical : -38 , marginLeft : 50 ,textTransform :'capitalize'}}> Invitations  </Text>
                    </>}
                    style={{marginTop: Constants.statusBarHeight}}
                    data={this.state.waiting}
                    keyExtractor={item => item.relation_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Profile',{user_id : item.sender.user_id})}>
                            <View style={{marginTop : 5,marginLeft: 20,marginRight : 20,marginBottom : 22, paddingTop :0 ,paddingLeft : 0 ,paddingRight: 0,paddingBottom :10,borderBottomWidth: 1,borderBottomColor: '#fff',backgroundColor : '#fcfcfc',borderRadius : 7,padding: 10,width : mywidht}}>
                                <View>
                                    <View style={{padding: 10}}>
                                        <View style={{ flexDirection:"row", height : 40   }}> 
                                            <View style={{width : mywidht - 80}}>
                                                <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.sender.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                                <Text style={{ fontWeight: 'bold', fontSize: 20 , marginVertical : -38 , marginLeft : 50 ,textTransform :'capitalize' }}>   {item.sender.nom}  {item.sender.prenom}</Text>
                                            </View>
                                            <AntDesign name="arrowright" style={{marginVertical : 15}} size={24} color="black" />

                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                    )}
                />
                )
                }
                </SafeAreaView>
            )
        }
    }
}







