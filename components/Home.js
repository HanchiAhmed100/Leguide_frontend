import React ,{Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import { RefreshControl ,StyleSheet,Dimensions , Text, View ,FlatList ,Image,SafeAreaView ,TextInput , Button ,TouchableOpacity,TouchableWithoutFeedback ,ActivityIndicator  ,Toast, ToastAndroid} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Axios from 'axios';
import Constants from 'expo-constants';


export default class Login extends React.Component {
    constructor(props){ 
        super(props)
        this.state = {
            user_id : null,
            user_name : "",
            activites : [],
            loading : false,
            refreshing : false,
        }
    }
    _isMounted = false;

    componentDidMount(){
        this._isMounted = true;
        this.getLogin()
        this.getActivites()
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    
    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        const user_json = JSON.parse(user)
        this.setState({
            user_id : user_json.user_id,
            user_name : user_json.nom+" "+user_json.prenom
        })
        if(user_json.validepic == -1){
            this.props.navigation.navigate('AddProfilePicture')
        }

    }

    getActivites = async () =>{
        if(this._isMounted){
            this.setState({loading : true})
            await Axios.get("http://192.168.1.9:8080/activites").then(res =>{
                if (this._isMounted) {    
                    this.setState({activites : res.data})
                }
            })
            .catch(err =>{
                console.error(err)
            })
            this.setState({loading : false })
        }
    }
    GetActivite = (activite_id,activite) =>{
        console.log(activite.users)
        var x = false
        for (let i = 0; i < activite.users.length; i++) {
            if(activite.users[i].user_id == this.state.user_id){
                x = true
            }           
        }
        console.log(x)
        this.props.navigation.navigate('ActiviteNavigation',{activite_id : activite_id ,activite : activite , abonnement : x})

    }
    _handleRefresh =  () =>{
        this.setState({refreshing : true })
        this.getActivites()
        this.setState({refreshing : false})
    }

    render(){
        const mywidht = (Dimensions.get('window').width) - 40
        return(
            <SafeAreaView style={{ flex: 1,marginTop: Constants.statusBarHeight}}>
                <FlatList
                    data={this.state.activites}
                    keyExtractor={item => item.activite_id.toString()}
                    refreshControl={
                        <RefreshControl
                         refreshing={this.state.refreshing}
                         onRefresh={this._handleRefresh}
                        />
                      }
                    renderItem={({ item }) => (
                    <TouchableWithoutFeedback onPress={() => this.GetActivite(item.activite_id , item)}>

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


                            <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/covers/"+item.cover}} style={{width: '100%' ,resizeMode : 'cover', height:225 , borderRadius:5  , borderBottomLeftRadius : 0 , borderBottomRightRadius : 0}} />

                            <View>
                                <View
                                style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#ccc',
                                    padding: 10
                                    }}
                                >
                                    <Text style={{ fontWeight: 'bold', fontSize: 20,textTransform:'capitalize' }}>{item.nom}</Text>
                                    <Text style={{color :'#111'}}>{item.description}</Text>
                                </View>
                                <Text style={{padding: 10, fontSize: 12  , color : '#aaa'}}>{ Object.keys(item.users).length } utilisateur abonnées </Text>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>

                    )}
                />
            </SafeAreaView>
        )
    }
}
