import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: ''
        }
    }

    render() {
        const { code } = this.state;
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }} >
                <View style={{
                    height: 60,
                    width: '100%',
                    backgroundColor: '#008577',
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: 'white',
                    borderBottomWidth: 2
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }} >
                        Sic Simulator
                    </Text>

                    <TouchableOpacity onPress={() => Actions.compiled({ code })}>
                        <Image source={require('./images/play.png')} style={{ width: 20, height: 20, tintColor: 'white' }} />
                    </TouchableOpacity>

                </View>

                <TextInput
                    placeholder='Enter your sic code here'
                    style={{
                        width: '80%',
                        height: '80%',
                        textAlignVertical: 'top',
                        alignSelf: 'center'
                    }}
                    underlineColorAndroid='#008577'
                    multiline
                    value={code}
                    onChangeText={code => this.setState({ code })}
                />

            </View>
        );
    }
}