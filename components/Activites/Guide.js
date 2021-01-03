import React ,{Component} from 'react';
import { Text } from 'react-native';
import { WebView } from 'react-native-webview';


export default class Guide extends React.Component{
    render(){
        return(
            <WebView source={{ uri: `http://192.168.1.9:80/LeGuideMap/index.html?activite_id=${this.props.activite_id}` }} style={{ marginTop: 20 }} />
            // <Text>dddd</Text>
        )
    }
}