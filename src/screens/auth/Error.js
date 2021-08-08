import React from 'react';
import {Text, View} from 'react-native'

const Error = ({touch, error}) => {
    if(!touch){
        return <Text>{null}</Text>
    }
    if(error) {
        return <Text style={{color: 'red', fontSize: 10, padding: 0, margin: 0}}>{error}</Text>
    }
    return <Text>{null}</Text> 
}
 
export default Error