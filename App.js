import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from './location'
import About from './locationHistory'

const Tab = createBottomTabNavigator();

export default class App extends Component {

  render () {
    return (
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{
            labelStyle: {
              fontSize: 14,
            },
          }}>
          <Tab.Screen name="Location and Weather" component={Home}/>
          <Tab.Screen name="History" component={About}/>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}


const styles = StyleSheet.create({
  nav: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 10
  }, navText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
  }
})


