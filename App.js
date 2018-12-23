import { Scene, Router, Stack } from 'react-native-router-flux';
import React, { Component } from 'react';

import Home from './src/Home';
import Compiled from './src/Compiled';

export default class App extends React.Component {
  render() {
    return <Router>
      <Stack key="root">
        <Scene hideNavBar key="home" component={Home} />
        <Scene hideNavBar key="compiled" component={Compiled} />
      </Stack>
    </Router>
  }
}