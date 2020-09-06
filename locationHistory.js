import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View, SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import {Table, Row, Rows} from 'react-native-table-component';


class History extends Component {
  state = {
    history: [],
    tableHead: ['Date', 'Coordinates', 'Address'],
    tableData: []
  };
  remakeTableData = () => {
    let data = JSON.parse(this.state.history).reverse();
    let newData = data.map(el => Object.values(el)
    );
    this.setState({tableData: newData})
  };
  componentDidMount = () => {
    const readData = async () => {
      try {
        const data = await AsyncStorage.getItem('data');

        if (data !== null) {
          this.setState({history: data}, () => {
            this.remakeTableData()
          })
        }
      }
      catch (e) {
        console.log('Failed to fetch the data from storage')
      }
    };
    readData()
  };
  clearHistory = () => {
    this.setState({tableData: []});
    this.setState({tableHead: ['History successfully cleared!']});
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear()
      } catch (e) {
        alert('Failed to clear the async storage.')
      }
    };
    clearStorage()
  };

  render () {
    const state = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: "flex-start"}}>
              <Text style={styles.textHeader}>Search History</Text>
              <TouchableOpacity onPress={this.clearHistory} style={styles.button}>
                <Text>Clear History</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
                <Rows data={state.tableData} textStyle={styles.text}/>
              </Table>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6},
  textHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212224',
    padding: 20,
  }, button: {
    height: 50,
    marginTop: 10,
    width: 100,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  }
});

export default History
