import React ,{Component} from 'react';
import {ActivityIndicator,StatusBar ,View ,StyleSheet} from 'react-native'
import Axios from 'axios';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Guide from './Activites/Guide.js'
import Journal from './Activites/Journal.js'
import Membres from './Activites/Membres.js'

const Tab = createMaterialTopTabNavigator();


export default class ActiviteNavigation extends React.Component{
    
    state = {
        loading : false,
        Posts : [],
        act_id : '',
        activite_info : []
    }

    componentDidMount = async () => {
        this.setState({act_id : this.props.route.params.activite_id , activite_info : this.props.route.params.activite})
        this.setState({loading : true})
        await Axios.get(`http://192.168.1.9:8080/posts/activite/${this.props.route.params.activite_id}`).then( res =>{
            this.setState({Posts : res.data})
        }).catch(err =>{
            console.error(err)
        })
        this.setState({loading : false})
    }

    render(){
        if(this.state.loading){
            return (
                <View style={styles.container}>
                    <StatusBar style="auto" />
                    <ActivityIndicator size="large" color="#3f3d56" />
              </View>
            )
        }else{
            return(
            
                <Tab.Navigator>
                    <Tab.Screen name="Journal">
                        {props => <Journal {...props} activite_id={this.state.act_id} Posts={this.state.Posts}  Activite_info={this.state.activite_info} abonnement={this.props.route.params.abonnement}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Membres">
                        {props => <Membres {...props} Activite_info={this.props.route.params.activite}/>}
                    </Tab.Screen>
                    <Tab.Screen name="Guide">
                        {props => <Guide {...props} activite_id={this.state.act_id} />}
                    </Tab.Screen>
                </Tab.Navigator>
            )
        }

    }
}
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    });
        