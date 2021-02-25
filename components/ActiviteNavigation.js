import React ,{Component} from 'react';
import {ActivityIndicator,Dimensions,StatusBar ,View ,StyleSheet ,Text} from 'react-native'
import Axios from 'axios';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Guide from './Activites/Guide.js'
import Journal from './Activites/Journal.js'
import Membres from './Activites/Membres.js'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();


export default class ActiviteNavigation extends React.Component{
    
    state = {
        loading : false,
        Posts : [],
        act_id : '',
        activite_info : [],
        
        Journal : true,
        guide : false,
        membres : false
    }

    _isMounted = false;

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount = async () => {
        this._isMounted = true;
        if(this._isMounted){
            this.setState({act_id : this.props.route.params.activite_id , activite_info : this.props.route.params.activite})
            this.setState({loading : true})
            await Axios.get(`http://192.168.1.9:8080/posts/activite/${this.props.route.params.activite_id}`).then( res =>{
                this.setState({Posts : res.data})
            }).catch(err =>{
                console.error(err)
            })
            this.setState({loading : false})
        }

    }
    ShowJournal = () =>{
        this.setState({Journal : true , guide : false , membres : false})
    }
    ShowMembers = () =>{
        this.setState({Journal : false , guide : false , membres : true})

    }
    ShowGuide = () =>{
        this.setState({Journal : true , guide : true , membres : false})
    }

    render(){
        const mywidht = Dimensions.get('window').width

        if(this.state.loading){
            return (
                <View style={styles.container}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
                </View>
            )
        }else{
            return(
                <View>

                    <View style={{ flexDirection:"row" ,width : mywidht ,borderBottomColor: "#cfcfcf" , borderBottomWidth: 2 ,backgroundColor : "#fff",height : 50}}>
                        <TouchableWithoutFeedback style={{width : mywidht/3 , alignContent: "center" , justifyContent:"center"}} onPress={()=> this.ShowJournal()}>
                            <Text>Journal</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback  style={{width : mywidht/3}} onPress={ ()=> this.ShowMembers()}>
                        <Text>Membres</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback  style={{width : mywidht/3}} onPress={()=> this.ShowGuide()}>
                        <Text> Guide</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    { this.state.Journal ? (<Journal  activite_id={this.state.act_id} Posts={this.state.Posts}  Activite_info={this.state.activite_info} abonnement={this.props.route.params.abonnement}/>) : ( null )}
                    { this.state.membres ? (<Membres Activite_info={this.props.route.params.activite}/>) : ( null )}
                    { this.state.guide ? (<Guide activite_id={this.state.act_id} />) : ( null )}

                </View>


            )
        }

    }
}

                    /* <Tab.Navigator>
                    <Tab.Screen name="Journal">
                        {props => <Journal {...props} activite_id={this.state.act_id} Posts={this.state.Posts}  Activite_info={this.state.activite_info} abonnement={this.props.route.params.abonnement}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Membres">
                        {props => <Membres {...props} Activite_info={this.props.route.params.activite}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Guide">
                        {props => <Guide {...props} activite_id={this.state.act_id} />}
                    </Tab.Screen>
                </Tab.Navigator>  */
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    });
        