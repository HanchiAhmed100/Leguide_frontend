import React ,{Component} from 'react';

import * as SecureStore from 'expo-secure-store';

import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';



import Menu from './Menu.js';
import Home from './Home.js';



const Tab = createBottomTabNavigator();



export default class TabNavigation extends React.Component {
    
    state = {
        user_id : null,
        user_name : ""
    }

    componentDidMount(){
        this.getLogin()
    }
    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        console.log(user)
        if(user){
            const user_json = JSON.parse(user)
            this.setState({
                user_id : user_json.user_id,
                user_name : user_json.nom+" "+user_json.prenom
            })
        }else{
            //this.props.navigation.navigate("Welcom")
        }
    }

    setLogout = () =>{
        this.props.SetUserFalse()
    }

    render(){
        return(

                <Tab.Navigator
                      screenOptions={({ route }) => ({
                        tabBarIcon: ({  color, size }) => {
                        let iconName;
            
                        if (route.name === 'Home') {
                            iconName = 'md-home'
                        } else if (route.name === 'Menu') {
                            iconName = 'md-menu'
                        }
                        // You can return any component that you like here!
                        return <Ionicons name={iconName} size={size} color={color} />;
                        },
                    })}
                    tabBarOptions={{
                        activeTintColor: '#3f3d56',
                        inactiveTintColor: 'gray',
                    }}  
                >   
                    <Tab.Screen name="Home" component={Home} />


                    <Tab.Screen  name="Menu" >
                        {props => <Menu {...props} setLogout={this.setLogout}/>}
                    </Tab.Screen>

                </Tab.Navigator>


        )
    }
}



