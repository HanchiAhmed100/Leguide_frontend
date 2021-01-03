import React ,{Component} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SetActiviteCover from './Activites/SetActiviteCover.js';
import CreateActivite from './Activites/CreateActivite.js';

import TabNavigation from './TabNavigation.js';
import ActiviteNavigation from './ActiviteNavigation.js';

import AddProfilePicture from './User/AddProfilePicture.js';


import Commentaire from './Activites/Commentaire.js'
import Reaction from './Activites/Reaction.js'


import Login from './Login.js'
import Signin from './Signin.js'
import Welcome from './Welcome.js'

import Amis from './User/Amis.js'
import Profile from './User/Profile.js'

import Chat from './chat/Chat.js'

import * as SecureStore from 'expo-secure-store';


const Stack = createStackNavigator();

export default class MenuNavigation extends React.Component{
    state = { 
        user : false
    }
    componentDidMount(){
        this.getLogin()
    }


    getLogin = async () =>{
        const user = await SecureStore.getItemAsync("User")
        if(user){
            const user_json = JSON.parse(user)
            this.setState({
                user : true
            })
        }
    }

    SetUserTrue = () =>{
        this.setState({user : true})
    }
    SetUserFalse = () =>{
        this.setState({user : false})
    }


    render(){
        return(
            <NavigationContainer independent={true} >

                { this.state.user ? (
                    <Stack.Navigator initialRouteName="TabNavigation">

                        <Stack.Screen name="TabNavigation" options={{headerTitle : 'Le Guide' ,headerLeft : null}}>
                            {props => <TabNavigation {...props} SetUserFalse={this.SetUserFalse} />}
                        </Stack.Screen>
                       
                        <Stack.Screen name="ActiviteNavigation" component={ActiviteNavigation} options={{headerTitle : 'Le Guide' ,headerLeft : null}} />
                        <Stack.Screen name="CreateActivite" component={CreateActivite} options={{headerShown : false}} />
                        <Stack.Screen name="SetActiviteCover" component={SetActiviteCover} options={{headerShown : false}} />
                        <Stack.Screen name="AddProfilePicture" component={AddProfilePicture} />
                        <Stack.Screen name="Commentaire" component={Commentaire} />
                        <Stack.Screen name="Reaction" component={Reaction} />
                        <Stack.Screen name="Amis" component={Amis} />
                        <Stack.Screen name="Chat" component={Chat} />

                        <Stack.Screen name="Profile" options={{headerShown : false}} >
                            {props => <Profile {...props} user={"hhhh"} />}
                        </Stack.Screen>

                    </Stack.Navigator>
                    ) : (
                        <Stack.Navigator initialRouteName="Welcome">
                            <Stack.Screen name="Welcome" component={Welcome} options={{headerShown : false}} />
                            
                            <Stack.Screen name="Login">
                                {props => <Login {...props} SetUserTrue={this.SetUserTrue} />}
                            </Stack.Screen>
                            <Stack.Screen name="Signin" component={Signin} />
                        </Stack.Navigator>
                    )
                }

            </NavigationContainer>
        )
    }
}