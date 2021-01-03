import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Feather } from '@expo/vector-icons'; 
import moment from 'moment';
import 'moment/locale/fr';

import Constants from 'expo-constants';
import Axios from 'axios';


export default class Chat extends React.Component{
    state = {
        user_id : '',
        msg : []
    }

    async componentDidMount(){
        await this.getLogin();
        
        this.setState({loading : true})
        await this.getMsg();
        this.setState({loading : false})


    }

    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        const user_json = JSON.parse(user)
        this.setState({
            user_id : user_json.user_id,
            user_name : user_json.nom+" "+user_json.prenom
        })
    }

    getMsg = async() =>{
        await Axios.post(`http://192.168.1.9:8080/chat`,{id_1 : this.state.user_id , id_2 : this.props.route.params.user_id}).then(res=>{
            console.log(res.data)
            this.setState({conv : res.data})
        }).catch(err =>{
            console.error(err)
        })
    }
    addMsg = async () =>{
        this.setState({loading : true})
        await Axios.post(`http://192.168.1.9:8080/chat/add`,{id_1 : this.state.user_id , id_2 : this.props.route.params.user_id , msg : this.state.msg}).then(res=>{
            console.log(res.data)
            this.setState({conv : res.data})
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
                <SafeAreaView style={{backgroundColor:'#fff', margin : 0 ,padding :0 , flex : 1}}>
                <View style={{flex: 0.9}}>

                    { this.state.conv ?(

                        <FlatList
                            ListHeaderComponent={<>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 , marginVertical : -38 , marginLeft : 50 ,textTransform :'capitalize'}}> Messages  </Text>
                            </>}
                            style={{marginTop: Constants.statusBarHeight}}
                            data={this.state.conv}
                            ref = "flatList"
                            onContentSizeChange={()=> this.refs.flatList.scrollToEnd()}
                            keyExtractor={item => item.chats_id.toString()}
                            renderItem={({ item }) => (                       
                                <View>
                                    <View style={{padding: 10}}>
                                            <View style={{width : mywidht+15}}>
                                            { item.send_msg.user_id == this.state.user_id ? ( 

                                                    <View style={{flexDirection : "row" ,justifyContent: 'flex-end'}}>
                                                        <View>
                                                            <View style={{marginTop : 5,marginLeft: 5,marginRight : 5,marginBottom : 10, paddingTop :12 ,paddingLeft : 10 ,paddingRight: 10,paddingBottom :12,backgroundColor : '#f4f4f4',borderRadius : 20,padding: 10}}>
                                                                <Text style={{fontSize: 16 }}>{item.msg}</Text>
                                                            </View>
                                                        </View>
                                                        <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.send_msg.profile }} style={{ marginTop : 5,width: 45  ,resizeMode : 'cover', height:45 , borderRadius:40  }} />

                                                    </View>
                                                    ) : (

                                                        <View style={{flexDirection : "row"}}> 
                                                            <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.send_msg.profile }} style={{ marginTop : 5,width: 45  ,resizeMode : 'cover', height:45 , borderRadius:40  }} />
                                                            <View>
                                                                <View style={{marginTop : 5,marginLeft: 5,marginRight : 5,marginBottom : 10, paddingTop :12 ,paddingLeft : 10 ,paddingRight: 10,paddingBottom :12,backgroundColor : '#e1ecf4',borderRadius : 20,padding: 10}}>

                                                                    <Text style={{fontSize: 16 }}>{item.msg}</Text>
                                                                </View>
                                                                <Text style={{fontSize : 10 , color:'#ccc' , marginTop :-10 ,marginLeft :-40 }}>{moment(item.creationDateTime).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                                                            </View>
                                                        </View>                                            
                                                        
                                                        
                                                    )
                                            } 
                                            
                                            
                                            </View>
                                    </View>
                                </View>
                            )}
                        />
                    ) : (
                        <Text style={{justifyContent:'center', fontSize : 16}}>Pas de message pour le moment !</Text>                    
                    )}
                </View>

                <View style={{flex: 0.15}}>
                    <View style={{ flexDirection:"row" }}>
                        <TextInput
                            style={{ borderBottomLeftRadius: 7 , borderTopLeftRadius: 7, backgroundColor:'#f5f5f4',marginLeft:12 ,height: 75,width : txtFiledWidht+50 , padding: 5 , paddingLeft :10}}
                            placeholder="Ecrire votre message ..."
                            onChangeText={(msg) => this.setState({msg : msg})}
                        />
                        <TouchableOpacity onPress={() => this.addMsg()} style={{alignItems :"center" , backgroundColor : '#3f3d56',width: 70 , borderTopRightRadius :7 , borderBottomRightRadius :7  }}>
                            <Feather style={{ marginVertical : 25}} name="send" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
                </SafeAreaView>
            )
        }
    }
}







