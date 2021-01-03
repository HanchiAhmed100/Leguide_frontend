import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import Axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';


import moment from 'moment';
import 'moment/locale/fr';


export default class Journal extends React.Component{
    state = {
        user_id : '',
        user_name : '',
        msg : '',
        loading : false,
        Posts : [],
        refreshing : false,
        abonnement : true,
        info : []
    }
    _isMounted = false;

    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount(){
        this.getLogin()
        this._isMounted = true;
        this.setState({Posts : this.props.Posts,info:this.props.Activite_info})
        this.AfficheAbonnement()
    }

    AfficheAbonnement = () =>{
        this.setState({abonnement : this.props.abonnement})
    }
    addPost = async () => {
        this.setState({loading : true})

        await Axios.post('http://192.168.1.9:8080/post',{ createur_id : this.state.user_id , activite_id : this.props.activite_id , body : this.state.msg})
        .then(res =>{
            if(res.data.POST == 'OK'){
                ToastAndroid.show('Votre Poste a ete ajouter ', ToastAndroid.SHORT);  
            }
        }).catch(err =>{
            console.error(err)
        })
        this.setState({loading : false})

    }


    loadPosts = async () => {
        this.setState({loading : true})
        await Axios.get(`http://192.168.1.9:8080/posts/activite/${this.props.activite_id}`).then( res =>{
            if (this._isMounted) {    
                this.setState({Posts : res.data})
            }
        }).catch(err =>{
            console.error(err)
        })
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


    _handleRefresh = async ()=>{
        this.setState({refreshing : true })
        this.loadPosts()
        this.setState({refreshing : false})
    }

    goToComents = id =>{
        this.props.navigation.navigate('Commentaire',{post_id : id , abonnement : this.state.abonnement})
    }
    goToReactions = id =>{
        this.props.navigation.navigate('Reaction',{post_id : id, abonnement : this.state.abonnement})
    }


    setDesAbonnement = async () =>{
        this.setState({loading : true})
        await Axios.post("http://192.168.1.9:8080/activite/desabonnement",{user_id : this.state.user_id , activite_id : this.props.activite_id}).then(res=>{
            if(res.data.DELETE == "OK"){
                if (this._isMounted) {    
                    this.setState({abonnement : false ,loading : false})
                }
            }
        }).catch(err =>{
            console.log(err)
        })
    }
    setAbonnement = async () =>{
        this.setState({loading : true})
        await Axios.post("http://192.168.1.9:8080/activite/abonnement",{user_id : this.state.user_id , activite_id : this.props.activite_id}).then(res=>{
            if(res.data.STATUS == "OK"){
                if (this._isMounted) {    
                    this.setState({abonnement : true , loading : false})
                }
            }
        }).catch(err =>{
            console.log(err)
        })
    }

    render(){
        const mywidht = (Dimensions.get('window').width) - 40
        const txtFiledWidht = mywidht - 85
        if(this.state.loading){
            return (
                <View style={{flex: 1,backgroundColor: '#fff',alignItems: 'center',justifyContent: 'center'}}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
              </View>
            )
        }else{
            return(

                <SafeAreaView style={{ margin : 0 ,padding :0}}>
                <FlatList
                    keyExtractor={item => item.post_id.toString()}

                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._handleRefresh}
                        />
                        }
                    ListHeaderComponent={<>
                        <View
                            
                            style={{
                            marginTop : 0,
                            marginLeft: 0,
                            marginRight : 0,
                            marginBottom : 0,
                            
                            paddingTop :0 ,
                            paddingLeft : 0 ,
                            paddingRight: 0,
                            paddingBottom :10,


                            borderBottomWidth: 1,
                            borderBottomColor: '#fff',
                            backgroundColor : '#fff',
                            padding: 10,
                            width : mywidht+40
                            }}>


                            <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/covers/"+this.props.Activite_info.cover}} style={{width: '100%' ,resizeMode : 'cover', height:225 , borderRadius:5  , borderBottomLeftRadius : 0 , borderBottomRightRadius : 0}} />

                            <View style={{padding: 10,paddingLeft : 25}}>
                                <View style={{ flexDirection:"row"}}>
                                    <Text style={{ fontWeight: 'bold', paddingTop : 10, fontSize: 20, textTransform:'capitalize', width :175 }}>{this.props.Activite_info.nom}</Text>
                                    {
                                        !this.state.abonnement ? (
                                            <TouchableOpacity onPress={() => this.setAbonnement() } style={{ width : 150 , height : 50 , alignItems :"center",  borderRadius: 7 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3}} >
                                                <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>S'abonner</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity onPress={() => this.setDesAbonnement() } style={{width : 150 , height : 50 , alignItems :"center",  borderRadius: 7 , backgroundColor : '#fff', borderWidth : 2 ,paddingHorizontal: 20, borderColor : '#3f3d56' , padding : 3}} >
                                                <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 8}}>Désabonner</Text>
                                            </TouchableOpacity>
                                        )
                                    }
            
                                </View>
                            </View>

                        </View>
                        {  this.state.abonnement ?  (
                            <View style={{ flexDirection:"row", marginTop :20 , marginBottom:20 , height : 75}}>
                                <TextInput
                                    style={{ borderBottomLeftRadius: 40 , borderTopLeftRadius: 40, backgroundColor:'#fff',marginLeft:12 ,height: 75,width : txtFiledWidht , padding: 5 , paddingLeft :10}}
                                    placeholder="Ecrire votre poste maintenant ..."
                                    onChangeText={(val) => this.setState({msg : val})}
                                    />
                                <TouchableOpacity onPress={() => this.addPost()} style={{paddingRight:17, alignItems :"center" , backgroundColor : '#3f3d56',width: 100 , borderTopRightRadius :40 , borderBottomRightRadius :40 }}>
                                    <Text style={{color: '#fff' , fontSize : 16, marginVertical : 26}}>Envoyer</Text>
                                </TouchableOpacity>
                                
                            </View>
                            ) : (
                                <Text></Text>
                            )
                        }

                    </>}
                    style={{marginTop: Constants.statusBarHeight}}
                    data={this.state.Posts}
                    keyExtractor={item => item.post_id.toString()}
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
                                <View style={{borderBottomWidth: 1,borderBottomColor: '#ccc',padding: 10}}>
                                    <TouchableOpacity style={{ flexDirection:"row", marginTop : 5, height : 65 , borderBottomWidth : 1, borderColor : '#ccc' , }} onPress={() => this.props.navigation.navigate('Profile' , {user_id : item.createur.user_id})}>
                                        <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.createur.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                        <Text style={{ fontWeight: 'bold', fontSize: 20 ,marginTop :20, marginVertical : 20 ,textTransform :'capitalize' }}>   {item.createur.nom} {item.createur.prenom}</Text>
                                    </TouchableOpacity>
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

                    )}
                />
                </SafeAreaView>
                
            )
        }
    }
}