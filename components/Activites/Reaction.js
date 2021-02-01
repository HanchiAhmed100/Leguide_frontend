import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import Axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { Fontisto } from '@expo/vector-icons'; 

import moment from 'moment';
import 'moment/locale/fr';


export default class Reaction extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loading : false,
            Reactions : [],
            reation : ''
        }
    }
    _isMounted = false;

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true
        this.loadReaction()
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
    loadReaction = async () =>{
        if(this._isMounted){
            this.setState({loading : true})
            await Axios.get(`http://192.168.1.9:8080/reaction/${this.props.route.params.post_id}`).then(res =>{
                this.setState({Reactions : res.data ,loading : false})
                var reaction_array = res.data

                for(let i = 0 ; i< reaction_array.length ; i++){
                    if(reaction_array[i].user.user_id == this.state.user_id){
                        console.log(reaction_array[i])
                        this.setState({reation : reaction_array[i].reaction_type})
                    }else{
                        console.log("non")
                    }
                }
            }).catch(err =>{
                console.error(err)
            })
        }
    }
    addReaction = async (type) =>{
        this.setState({loading : true})

        console.log(this.props.route.params.post_id)
        console.log(type)
        console.log(this.state.user_id)
        await Axios.post("http://192.168.1.9:8080/reaction",{user_id : this.state.user_id  , post_id : this.props.route.params.post_id , reaction_type : type}).then(res =>{
            console.log(res.data)
            this.setState({loading : false})
            this.props.navigation.navigate('Journal')
        }).catch(err =>{
            console.error(err)
        })
    }

    RemoveReaction = async ( type ) =>{
        this.setState({loading : true})
        console.log(type)
        await Axios.post("http://192.168.1.9:8080/reaction/delete",{user_id : this.state.user_id  , post_id : this.props.route.params.post_id , reaction_type : type}).then(res =>{
            this.setState({loading : false})
            this.props.navigation.navigate('Journal')
        }).catch(err =>{
            console.error(err)
        })
    }


    render(){
        const mywidht = (Dimensions.get('window').width) - 40
        const txtFiledWidht = mywidht - 105
        const iconWidth = mywidht/5

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
                                { this.props.route.params.abonnement ? (
                                    <View style={{ flexDirection:"row", marginTop : 5, height : 30 , width : mywidht+20}}> 
                                    {
                                        this.state.reation == 'heart-eyes' ?(
                                            <TouchableOpacity onPress={() => this.RemoveReaction('heart-eyes')} style={{width : iconWidth}}>
                                                <Fontisto name="heart-eyes" size={30} color="#00bbbb" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() =>  this.addReaction('heart-eyes')} style={{width : iconWidth}}>
                                                <Fontisto name="heart-eyes" size={24} color="black" />
                                            </TouchableOpacity>
                                        )
                                    }
                                    {
                                        this.state.reation == 'laughing' ?(
                                            <TouchableOpacity onPress={() =>  this.RemoveReaction('laughing')} style={{width : iconWidth}}>
                                                <Fontisto name="laughing" size={30} color="#00bbbb" />
                                            </TouchableOpacity>
                                        ) : (
                        
                                            <TouchableOpacity onPress={() =>  this.addReaction('laughing')} style={{width : iconWidth}}>
                                                <Fontisto name="laughing" size={24} color="black" />
                                            </TouchableOpacity>
                                        )
                                    }
                                    {
                                        this.state.reation== 'neutral' ?(
                                            <TouchableOpacity onPress={() =>  this.RemoveReaction('neutral')} style={{width : iconWidth}}>
                                                <Fontisto name="neutral" size={30} color="#00bbbb" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() =>  this.addReaction('neutral')} style={{width : iconWidth}}>
                                                <Fontisto name="neutral" size={24} color="black" />
                                            </TouchableOpacity>
                                        )
                                    }
                                    {
                                        this.state.reation == 'rage' ?(
                                            <TouchableOpacity onPress={() =>  this.RemoveReaction('rage')} style={{width : iconWidth}}>
                                                <Fontisto name="rage" size={28} color="#00bbbb" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() =>  this.addReaction('rage')} style={{width : iconWidth}}>
                                                <Fontisto name="rage" size={24} color="black" />
                                            </TouchableOpacity>
                                        )
                                    }
                                    {
                                        this.state.reation == 'expressionless' ?(
                                            <TouchableOpacity onPress={() =>  this.RemoveReaction('expressionless')} style={{width : iconWidth}}>
                                                <Fontisto name="expressionless" size={24} color="#00bbbb" />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() =>  this.addReaction('expressionless')}  style={{width : iconWidth}}>
                                                <Fontisto name="expressionless" size={24} color="black" />
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                                ) :(
                                    <Text></Text>
                                )
                                }
                            </View>
                        </View>

                    </>}
                    data={this.state.Reactions}
                    keyExtractor={item => item.reaction_id.toString()}

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
                                    <View style={{ flexDirection:"row", height : 40   }}> 
                                        <View style={{width : mywidht - 50}}>
                                            <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.user.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                            <Text style={{ fontWeight: 'bold', fontSize: 20 , marginVertical : -38 , marginLeft : 50 ,textTransform :'capitalize' }}>   {item.user.nom}  {item.user.prenom}</Text>
                                        </View>
                                        <View>
                                            <Fontisto name={item.reaction_type} style={{marginVertical :  10}} size={24} color="black" />                                        
                                        </View>
                                    </View>
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