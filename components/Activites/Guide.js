import React ,{Component} from 'react';
import { Text } from 'react-native';
import { WebView } from 'react-native-webview';


export default class Guide extends React.Component{
    render(){
        return(
            <WebView source={{ uri: `http://192.168.1.9:80/LeGuideMap/index.html?activite_id=${this.props.route.params.activite_id}` }} style={{ marginTop: 20 }} />
        )
    }
}





// import React ,{Component} from 'react';
// import { Button, Text, View, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';
// import * as WebBrowser from 'expo-web-browser';


// export default class Guide extends React.Component{

//     state = {
//      resultat : null
//     }

//     _handlePressButtonAsync = async () =>{
//         let res = await WebBrowser.openBrowserAsync(`http://192.168.1.9:80/LeGuideMap/index.html?activite_id=${this.props.activite_id}`);
//         this.setState({resultat : res});
//     }
//     render(){
//         return(
//                 <View >
//                     <Button title="Open WebBrowser" onPress={this._handlePressButtonAsync} />
//                 </View>
//         )
//     }
// }