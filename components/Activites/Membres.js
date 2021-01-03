import React ,{Component} from 'react';
import { TextInput,Text,SafeAreaView,ScrollView,FlatList ,StatusBar,ActivityIndicator,StyleSheet,RefreshControl,Image,TouchableOpacity , Dimensions ,TouchableWithoutFeedback,View, ToastAndroid} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons'; 
import 'moment/locale/fr';


export default class Reaction extends React.Component{
    state = {
        loading : false,
        Reactions : [],
        reation : ''
    }

    componentDidMount(){

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
                                <View style={{borderBottomWidth : 1 , borderBottomColor : '#ccc'}}>
                                    <Text style={{ fontSize: 16 ,padding : 10 ,textTransform : 'capitalize'}}> {this.props.Activite_info.nom}     </Text>

                                </View>

                                <View style={{ flexDirection:"row", height : 60 ,paddingTop : 8   }}> 
                                    <View style={{width : mywidht - 50}}>
                                        <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+this.props.Activite_info.admin.profile }} style={{width: 60  ,resizeMode : 'cover', height:60 , borderRadius:50  }} />
                                        <Text style={{ fontSize: 18 , marginVertical : -55 , marginLeft : 60 ,textTransform :'capitalize' }}>   {this.props.Activite_info.admin.nom}  {this.props.Activite_info.admin.prenom}</Text>
                                        <Text style={{ fontSize: 12 , marginVertical : 58 , marginLeft : 65 }}>   Administrateur de l'activite</Text>
                                    </View>
                                    <View>
                                        <TouchableOpacity onPress={()=> this.props.navigation.navigate('Profile',{user_id : this.props.Activite_info.admin.user_id})}>
                                            <AntDesign name="arrowright" style={{marginVertical : 20}} size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            </View>
                        </View>

                    </>}
                    data={this.props.Activite_info.users}
                    keyExtractor={item => item.user_id.toString()}

                    renderItem={({ item }) => (
                    <TouchableWithoutFeedback>

                        <View
                            
                            style={{
                            marginTop : 5,
                            marginLeft: 20,
                            marginRight : 20,
                            marginBottom : 11,
                            
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
                                            <Image  source={{uri : "http://192.168.1.9:8080/uploads/images/profile/"+item.profile }} style={{width: 50  ,resizeMode : 'cover', height:50 , borderRadius:50  }} />
                                            <Text style={{ fontSize: 16 , marginVertical : -35 , marginLeft : 50 ,textTransform :'capitalize' }}>   {item.nom}  {item.prenom}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={()=> this.props.navigation.navigate('Profile',{user_id : item.user_id})}>
                                                <AntDesign name="arrowright" style={{marginVertical : 15}} size={24} color="black" />
                                            </TouchableOpacity>
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