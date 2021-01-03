import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import Axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { FontAwesome5 ,AntDesign} from '@expo/vector-icons'; 

import moment from 'moment';
import 'moment/locale/fr';


export default class Commentaire extends React.Component{
    state = {
        loading : false,
        post_id : '',
        Comments : [],
        Post_body : '',
        createur : [],
        date : '',
        user_id : '',
        comment_body : ''
    }

    componentDidMount(){
        this.loadPostAndComments()
        this.getLogin()
    }
    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        const user_json = JSON.parse(user)
        this.setState({
            user_id : user_json.user_id,
            user_name : user_json.nom+" "+user_json.prenom
        })
    }
    loadPostAndComments = async () =>{
        this.setState({loading : true})
        await Axios.get(`http://192.168.1.9:8080/posts/${this.props.route.params.post_id}`).then(res =>{
            this.setState({Comments : res.data.commentaires ,Post_body : res.data.body,date : res.data.creationDateTime , createur : res.data.createur, loading : false})
        }).catch(err =>{
            console.error(err)
        })
    }
    addComents = async () =>{
        this.setState({loading : true})
        await Axios.post('http://192.168.1.9:8080/commentaire',{post_id : this.props.route.params.post_id , user_id : this.state.user_id , body :this.state.comment_body })
        .then(res =>{
            this.setState({loading : false})
            this.props.navigation.navigate('Journal')
        }).catch(err =>{
            console.error(err)
        })
    }

    render(){
        const mywidht = (Dimensions.get('window').width) - 40
        const txtFiledWidht = mywidht - 105
        if(this.state.loading){
            return (
                <View style={{flex: 1,backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center'}}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
              </View>
            )
        }else{
            return(
                <SafeAreaView style={{ flex: 1}}>
                <FlatList
                    keyExtractor={item => item.reaction_id.toString()}
                    ListHeaderComponent={<>
                        <View>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor : '#ccc',
                                    backgroundColor : '#fff',
                                    borderRadius : 7,
                                    marginBottom : 25,
                                    padding : 20,
                                    margin : 10,
                                    

                                    }}
                                    >
                                <View style={{ flexDirection:"row", marginTop : 5, height : 65 , borderBottomWidth : 1, borderColor : '#ccc'  }}> 
                                    <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+this.state.createur.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 ,marginTop :20, marginVertical : 20 ,textTransform :'capitalize' }}>   {this.state.createur.nom} {this.state.createur.prenom}</Text>
                                </View>
                                <Text style={{color :'#111' , fontSize :18 ,lineHeight : 30 , marginTop : 15,marginBottom :15 }}>{this.state.Post_body}</Text>
                                <Text style={{fontSize : 12}}> Date : { moment(this.state.date).fromNow() }</Text>
                            </View>
                            { this.props.route.params.abonnement ? (
                                <View style={{ flexDirection:"row" , marginBottom:20 , height : 75}}>
                                    <TextInput
                                        style={{ borderBottomLeftRadius: 7 , borderTopLeftRadius: 7, backgroundColor:'#fff',marginLeft:12 ,height: 75,width : txtFiledWidht , padding: 5 , paddingLeft :10}}
                                        placeholder="Ajouter Commentaire ..."
                                        onChangeText={(val) => this.setState({comment_body : val})}
                                    />
                                    <TouchableOpacity onPress={() => this.addComents()} style={{paddingRight:17, alignItems :"center" , backgroundColor : '#3f3d56',width: 120 , borderTopRightRadius :7 , borderBottomRightRadius :7 }}>
                                        <Text style={{color: '#fff' , fontSize : 16, marginVertical : 26}}>Commenter</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text></Text>
                            )
                                
                            }
                        
                        </View>

                    </>}
                    style={{marginTop: Constants.statusBarHeight}}
                    data={this.state.Comments}
                    keyExtractor={item => item.commentaire_id.toString()}
                    renderItem={({ item }) => (
                    <TouchableWithoutFeedback>

                        <View
                            
                            style={{
                            marginTop : 5,
                            marginLeft: 20,
                            marginRight : 20,
                            marginBottom : 22,
                            
                            paddingTop :0 ,
                            paddingLeft : 0 ,
                            paddingRight: 0,
                            paddingBottom :10,

                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                            backgroundColor : '#fff',
                            borderRadius : 7,
                            padding: 10,
                            width : mywidht
                            }}>

                            <View>
                                <View
                                style={{

                                    padding: 10
                                    }}
                                >
                                    <View style={{ flexDirection:"row", marginTop : 5, height : 65 , borderBottomWidth : 1, borderColor : '#ccc'  }}> 
                                        <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.createur.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                        <Text style={{ fontWeight: 'bold', fontSize: 20 ,marginTop :20, marginVertical : 20 ,textTransform :'capitalize' }}>   {item.createur.nom} {item.createur.prenom}</Text>
                                    </View>
                                    <Text style={{color :'#111' , fontSize :18 ,lineHeight : 30 , marginTop : 15,marginBottom :15 }}>{item.body}</Text>
                                    <Text style={{fontSize : 12}}> Date : { moment(item.creationDateTime).fromNow() }</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    )}
                />
                </SafeAreaView>
                
            
            )
        }
    }
}