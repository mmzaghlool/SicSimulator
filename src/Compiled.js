//////////// Developed By: Mostafa Mahmoud saad zaghloul
//////////// AIET Computer departement 3rd year
//////////// NO. 34

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

const codes = {
    ADD: 18,
    ADDF: 58,
    ADDR: 90,
    AND: 40,
    CLEAR: 4,
    COMP: 28,
    COMPF: 88,
    COMPR: 0XA0,
    DIV: 24,
    DIVF: 64,
    DIVR: 0x9C,
    FIX: 0xC4,
    FLOAT: 0xC0,
    HIO: 0xF4,
    J: 0x3C,
    JEQ: 30,
    JGT: 34,
    JLT: 38,
    JSUB: 48,
    LDA: 0x00,
    LDB: 68,
    LDCH: 50,
    LDF: 70,
    LDL: 0x08,
    LDS: 0x6C,
    LDT: 74,
    LDX: 0x04,
    LPS: 0xD0,
    MUL: 20,
    MULF: 60,
    MULR: 98,
    NORM: 0xC8,
    OR: 44,
    RD: 0xD8,
    RMO: 0xAC,
    RSUB: 0x4C,
    SHIFTL: 0xA4,
    SHIFTR: 0xA8,
    SIO: 0xF0,
    SSK: 0xEC,
    STA: 0x0C,
    STB: 0x78,
    STCH: 54,
    STF: 0x80,
    STI: 0xD4,
    STL: 0x14,
    STS: 0x7C,
    STSW: 0xE8,
    STT: 0x84,
    STX: 0x10,
    SUB: 0x1C,
    SUBF: 0x5C,
    SUBR: 94,
    SVC: 0xB0,
    TD: 0xE0,
    TIO: 0xF8,
    TIX: 0x2C,
    TIXR: 0xB8,
    WD: 0xDC,
}

export default class Compiled extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code: '',
            result: '',
            locctr: 0,
            symTable: {},
            opCodes: [],
            progName: '',
            startAdd: ''
        }
        this.result2 = '';
        this.locctr = 0x00;
    }

    componentWillMount() {
        this.setState({ ...this.props }, () => this.compile());
    }

    // Print Text on the screen
    textAppend(append) {
        this.result2 += ' ' + append;
        this.setState({ result: this.result2 });
    }

    // Print new line
    addLine() {
        this.result2 += '\n'
    }


    getOpCode(arr) {
        const { symTable } = this.state;
        if (arr.length === 3) {

            // if indexed addressing mode
            if (arr[2].charAt(arr[2].length - 1).toLowerCase() == 'x') {
                let temp = Number.parseInt(symTable[arr[2].substring(0, arr[2].length - 2)], 16);
                // add x = 1
                temp += Number.parseInt(8000, 16);

                return `${codes[arr[1].toUpperCase()]}${temp.toString(16)}`
            } else {
                return `${codes[arr[1].toUpperCase()]}${symTable[arr[2]]}`
            }
        } else {
            // if indexed addressing mode
            if (arr[1].charAt(arr[1].length - 1).toLowerCase() == 'x') {
                let temp = Number.parseInt(symTable[arr[1].substring(0, arr[1].length - 2)], 16);
                temp += Number.parseInt(8000, 16);

                return `${codes[arr[0].toUpperCase()]}${temp.toString(16)}`
            } else {
                return `${codes[arr[0].toUpperCase()]}${symTable[arr[1]]}`
            }
        }
    }

    compile() {
        let { code, symTable } = this.state;

        // split the code into array of lines
        const sic = code.split('\n');
        let opCodes = [];
        let startAdd = '', progName = '';

        // first pass
        // generate the symbol table
        this.textAppend('Pass One:');
        this.addLine();
        this.addLine();

        sic.forEach(line => {
            // if this line is comment ignore it
            if (line.charAt(0) == '.') {

            } else {
                // split the line into array of strings
                line = line.split(' ');

                // Flag to indicate the incdication state
                let inc = true;

                // switch based on the NO. of strings in this line
                switch (line.length) {

                    // if the line has 3 strings it has a label
                    case 3:
                        // if this is the start statement
                        if (line[1].toLowerCase() == 'start') {
                            // the first string is the name of the program
                            progName = line[0];
                            // the third string is the starting address of the program
                            startAdd = line[2];
                            // Don't increament the locctr
                            inc = false;
                            // init. the locctr with the starting address
                            this.locctr = Number.parseInt(line[2], 16);
                            this.setState({ locctr: Number.parseInt(line[2]) });
                        }
                        // any other statment has a label
                        else {
                            // add the first string to the symbol table with its address and desplay it on the screen
                            symTable[line[0].toLowerCase()] = `${this.locctr.toString(16)}`;
                            this.setState({ symTable })
                            this.textAppend(`${[line[0].toLowerCase()]}: ${this.locctr.toString(16)}`)
                            this.addLine();
                        }

                        // increment the locctr based on the statment
                        if (line[1].toLowerCase() == 'resw') {
                            inc = false;
                            this.locctr += 3 * Number.parseInt(line[2]);
                        }
                        else if (line[1].toLowerCase() == 'resb') {
                            inc = false;
                            this.locctr += Number.parseInt(line[2]);
                        }
                        else if (line[1].toLowerCase() == 'byte') {
                            inc = false;
                            console.log('185: ', line[2].length - 3);
                            if (line[2].charAt(0).toLowerCase() == 'x') {
                                this.locctr += (line[2].length - 3) / 2;
                            } else {
                                this.locctr += (line[2].length - 3);
                            }
                        }
                    case 2:
                    case 1:
                        if (inc)
                            this.locctr += 3;
                        break;

                    default:
                        alert('Syntax error')
                        break;
                }
            }
        });

        // pass two
        // generate the object program
        this.addLine();
        this.textAppend('Pass two')
        this.addLine();
        this.addLine();

        sic.forEach(line => {
            // if this line is comment ignore it
            if (line.charAt(0) == '.') {

            } else {
                // split the line into array of strings
                line = line.split(' ');

                // switch based on the NO. of strings in this line
                switch (line.length) {
                    case 3:
                        switch (line[1].toLowerCase()) {

                            case 'start':
                            case 'resw':
                            case 'resb':
                                // the start is a keywords that indicates an
                                // action in the program and doesnot generate opcode
                                break;

                            case 'word':
                                opCodes.push(Number.parseInt(line[2]).toString(16));
                                break;

                            case 'byte':
                                if (line[2].charAt(0).toLowerCase() == 'x') {
                                    opCodes.push(line[2].substring(2, line[2].length - 1));
                                } else {
                                    ////////////////////////////////////////
                                    // TODO: fix this condition when the byte is char get the corrospnding code
                                }
                                break;
                            default:
                                opCodes.push(this.getOpCode(line));
                                break;
                        }
                        break;
                    case 2:
                        opCodes.push(this.getOpCode(line));
                        break;

                    default:
                        alert('Syntax error')
                        break;
                }
            }
        });
        // calculate the program length
        let progLength = (this.locctr - Number.parseInt(startAdd, 16)).toString(16);

        // print the opject code to the screen
        this.textAppend(`H ${progName} ${startAdd} ${progLength}`)
        this.addLine();

        this.textAppend(`T ${startAdd} ${progLength}`)
        opCodes.forEach(element => {
            this.textAppend(` ${element}`)
        })
        this.addLine();

        this.textAppend(`E ${startAdd}`)
        this.addLine();

    }

    // A simple UI component to view the result of the program
    render() {
        const { result } = this.state;

        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
            }} >
                {/* Header */}
                <View style={{
                    height: 60,
                    width: '100%',
                    backgroundColor: '#008577',
                    padding: 10,
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomColor: 'white',
                    borderBottomWidth: 2
                }}>
                    <TouchableOpacity onPress={() => Actions.pop()}>
                        <Image source={require('./images/back.png')} style={{ width: 20, height: 20, tintColor: 'white', marginRight: 10 }} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }} >
                        Sic Simulator
                    </Text>
                </View>

                <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'black', width: '95%', alignSelf: 'center', margin: 10 }} >
                    {result}
                </Text>
            </View>
        );
    }
}