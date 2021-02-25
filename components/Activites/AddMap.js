import React ,{Component} from 'react';
import { Text ,View ,Dimensions,TouchableHighlight} from 'react-native';
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
            <View style={{backgroundColor : '#fff' , flex :1}}>
                <Text style={{alignItems: 'center',color :'#111' , fontSize :18 ,lineHeight : 30 , marginTop : 15,marginBottom :15,justifyContent: 'center' }}>Taper deux fois pour marquer  les localisation de votre activite</Text>
                                        <TouchableHighlight style={{ width : 110 , height : 40 , alignItems :"center",  borderRadius: 6 , backgroundColor : '#fff', borderWidth : 2 , borderColor : '#3f3d56' , padding : 3 , marginTop : 20,marginLeft : 6}}>
                                        <Text style={{color: '#3f3d56' , fontSize : 16, marginVertical : 5 }} >Terminer</Text>
                                    </TouchableHighlight>
                <WebView source={{ uri: `http://192.168.1.9:80/LeGuideMap/addPlace.html?activite_id=${this.props.activite_id}` }} style={{ marginTop: 20 }} />
            </View>
        )
    }
}

