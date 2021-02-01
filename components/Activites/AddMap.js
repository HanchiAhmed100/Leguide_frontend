import React ,{Component} from 'react';
import { Text ,View ,Dimensions} from 'react-native';
import { WebView } from 'react-native-webview';


export default class AddMap extends React.Component{
    state = {
        act_id : 18
    }
    componentDidMount(){
        // this.setState({act_id : this.props.route.params.act_id})
        // console.log(this.state.act_id)
    }
    render(){
        const mywidht = Dimensions.get('window').width

        return(
            <View style={{backgroundColor : '#fff',justifyContent: 'center'}}>
                <View style="{{}}"></View>
                <Text style={{alignItems: 'center',color :'#111' , fontSize :18 ,lineHeight : 30 , marginTop : 15,marginBottom :15,justifyContent: 'center' }}>Taper deux fois pour marquer  les localisation de votre activite</Text>
                <WebView source={{ uri: `http://192.168.1.9:80/LeGuideMap/addPlace.html?activite_id=${this.props.activite_id}` }} style={{ marginTop: 20 }} />
            </View>
        )
    }
}

