import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons'; 

import moment from 'moment';
import 'moment/locale/fr';

import Constants from 'expo-constants';
import Axios from 'axios';


export default class Profile extends React.Component{
    state = {
        user_id : '',
        loading : false,
        user : [],
        profile : false,

    }

    async componentDidMount(){
        await this.getLogin()
        await this.getProfile()
        await this.getFriendshipStatus()
        await this.getInfo()
    }
    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        const user_json = JSON.parse(user)
        this.setState({
            user_id : user_json.user_id,
            user_name : user_json.nom+" "+user_json.prenom
        })
    }
    getProfile = async () =>{
        this.loading = true 
        await Axios.get(`http://192.168.1.9:8080/user/${this.props.route.params.user_id}`).then(res =>{
            this.setState({user : res.data})
        }).catch(err=>{
            console.error(err)
        })
        this.setState({loading : false})

    }

    getFriendshipStatus = async () =>{
        this.setState({loading : true})
        await Axios.post('http://192.168.1.9:8080/checkstatus', {user_id_1 : this.state.user_id ,user_id_2 : this.state.user.user_id }).then(res =>{
            if(res.data != null){
                this.setState({friendship : res.data})
                if(res.data.reciver && res.data.status == 0){
                    if(res.data.reciver.user_id == this.state.user_id){
                        this.setState({showAccept : true})
                    }
                }
                console.log("checkstatus")
                console.log(res.data)
            }

        }).catch(err =>{
            console.error(err)
        })
    }
    getInfo = async () =>{
        this.setState({loading : true})
        await Axios.get(`http://192.168.1.9:8080/post/user/${this.props.route.params.user_id}`).then(res =>{
            console.log(res.data)
            if(res.data[0]){
                this.setState({info : res.data, showPosts : true })

                if(res.data[0].createur.user_id == this.state.user_id){
                    this.setState({profile : true})
                }
            }

        }).catch(err=>{
            console.error(err)
        })
        this.setState({loading : false})
    }
    goToComents = id =>{
        this.props.navigation.navigate('Commentaire',{post_id : id , abonnement : this.state.abonnement})
    }
    goToReactions = id =>{
        this.props.navigation.navigate('Reaction',{post_id : id, abonnement : this.state.abonnement})
    }


    sendInvitation = async(id) =>{
        this.setState({loading : true})
        await Axios.post("http://192.168.1.9:8080/amis",{sender_id : this.state.user_id , reciver_id : id}).then(res=>{
            if(res.data.STATUS == "OK"){
                this.props.navigation.navigate("Home")
            }
        }).catch(err =>{
            console.error(err)
        })
    }

    DeleteInvitation = async(id) =>{
        this.setState({loading : true})
        await Axios.post("http://192.168.1.9:8080/amis/status",{sender_id : this.state.user_id , reciver_id : id,Status : -1}).then(res=>{
            if(res.data.STATUS == "OK"){
                this.props.navigation.navigate("Home")
            }
        }).catch(err =>{
            console.error(err)
        })
    }
    acceptInvitation = async(id) =>{
        this.setState({loading : true})
        await Axios.post("http://192.168.1.9:8080/amis/status",{sender_id : id , reciver_id : this.state.user_id,Status : 1}).then(res=>{
            if(res.data.STATUS == "OK"){
                this.props.navigation.navigate("Home")
            }
        }).catch(err =>{
            console.error(err)
        })
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
                <FlatList
                    ListHeaderComponent={<>
                        <View style={{ backgroundColor : '#fff'}}>  
                            <View style={{ flexDirection:"row" , padding :20}}>
                                <View style={{width :half-65 , marginLeft : 10}}>
                                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                        <AntDesign name="arrowleft" size={28} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <View style={{width :half}}>
                                    <Text style={{fontSize : 24}}>Profile</Text>
                                </View>                            
                            </View>
                            <View style={{ backgroundColor : '#fff',alignItems: 'center'}}>
                                <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+this.state.user.profile}} style={{width: 250  ,resizeMode : 'cover', height:250 , borderRadius:200  , marginVertical : 20 }} />
                                <Text style={{ fontWeight: 'bold', fontSize: 24,textTransform:'capitalize' }}>{this.state.user.nom} {this.state.user.prenom}</Text>
                                
                                {
                                    !this.state.profile ? (

                                        this.state.friendship ?(

                                             this.state.showAccept ? (
                                                <View>
                                                    <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Demande d'amis </Text>
                                                    <TouchableOpacity onPress={() => this.acceptInvitation(this.state.user.user_id)} style={{ width : 125 , height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#3f3d56', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                                        <Text style={{color: '#fff' , fontSize : 16, marginVertical : 8}}>Accepter </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => this.DeleteInvitation(this.state.user.user_id)} style={{ width : 125 , height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                                        <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Annuler</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) :(
                                                this.state.friendship.status == 0 ?(
                                                    <View>
                                                        <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Invitation Envoyer </Text>
                                                        <TouchableOpacity onPress={() => this.DeleteInvitation(this.state.user.user_id)} style={{ width : 125 , height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                                            <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Annuler</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <View style={{alignContent : 'center'}}>
                                                        <Text style={{ alignSelf : 'center', color: '#3f3d56' , fontSize : 16, marginTop : 15}}> Vous etez des amis deja  </Text>
                                                        <View >
                                                            <TouchableOpacity onPress={() => this.props.navigation.navigate("Chat", {user_id : this.state.user.user_id })} style={{ flexDirection : 'row',width : 250 , height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#3f3d56',paddingHorizontal: 20, padding : 3 ,marginVertical : 15}} >
                                                                <Text style={{color: '#fff',alignSelf:'center' ,width:half, fontSize : 16, marginVertical : 8}}>Message</Text>
                                                                <AntDesign name="message1" size={24} color="white" />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity onPress={() => this.DeleteInvitation(this.state.user.user_id)} style={{ width : 250 , height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                                            <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Retier de la liste d'amis</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            )
                                        ):(
                                            <TouchableOpacity onPress={() => this.sendInvitation(this.state.user.user_id)} style={{ width : 125 , height : 50 , alignItems :"center",  borderRadius: 100 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3 ,marginVertical : 15}} >
                                            <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Ajouter</Text>
                                            </TouchableOpacity>
                                        )

 
                                    ) : (
                                        <Text style={{fontSize : 16}}> Bonjour {this.state.user.nom} sur la page de ton profile </Text>
                                    )
                                }

                                
                                
                                <Text style={{fontSize : 18 , alignSelf :"baseline" ,padding :25 }}> Les Posts de {this.state.user.nom} :  </Text>         
                            </View>
                        </View>  
                    </>}
                    style={{marginTop: Constants.statusBarHeight}}
                    data={this.state.info}
                    keyExtractor={item => item.post_id.toString()}
                    renderItem={({ item }) => (

                    this.state.showPosts ?(
                    <TouchableWithoutFeedback>
                        <View style={{marginTop : 5,marginLeft: 20,marginRight : 20,marginBottom : 22, paddingTop :0 ,paddingLeft : 0 ,paddingRight: 0,paddingBottom :10,borderBottomWidth: 1,borderBottomColor: '#fff',backgroundColor : '#fcfcfc',borderRadius : 7,padding: 10,width : mywidht}}>
                            <View>
                                <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    padding: 10
                                    }}
                                >
                                    <View style={{ flexDirection:"row", marginTop : 5, height : 65 , borderBottomWidth : 1, borderColor : '#ccc' , }}> 
                                        <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.createur.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                        <Text style={{ fontWeight: 'bold', fontSize: 15 ,marginTop :20, marginVertical : 20 ,textTransform :'capitalize' }}>   {item.createur.nom} {item.createur.prenom} </Text> 
                                        <AntDesign name="caretright" size={13} color="black"  style={{ marginTop :24, marginVertical : 25}}/> 
                                        <Text style={{ fontWeight: 'bold', fontSize: 15 ,marginTop :20, marginVertical : 20 ,textTransform :'capitalize' }}>   {item.activite.nom} </Text> 
                                    </View>
                                    <Text style={{color :'#111' , fontSize :18 ,lineHeight : 30 , marginTop : 15,marginBottom :15 }}>{item.body}</Text>
                                    <Text style={{fontSize : 12}}> Date : { moment(item.creationDateTime).fromNow() }</Text>
                                </View>
                                <View style={{ flexDirection:"row", }}> 
                                    <View style={{ width : (mywidht/2)-30 }}>
                                    <TouchableOpacity onPress={() => this.goToReactions(item.post_id )} >
                                        <Text style={{padding: 10, fontSize: 14  , color : '#aaa' , textAlign : 'center'}}>{ Object.keys(item.reactions).length } Reaction</Text>   
                                    </TouchableOpacity>

                                    </View>
                                    <Text style={{padding: 10, fontSize: 14  , color : '#aaa' , textAlign : 'center'}}>|</Text>
                                    <View style={{ width : mywidht/2}}>
                                        <TouchableOpacity onPress={() => this.goToComents(item.post_id)} >
                                            <Text style={{padding: 10, fontSize: 14  , color : '#aaa',textAlign : 'center'}}>  { Object.keys(item.commentaires).length } Commentaires </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                    ): (
                        <Text> Pas de post pour le moment</Text>
                    )
                    )}
                />
                </SafeAreaView>
            )
        }
    }
}







