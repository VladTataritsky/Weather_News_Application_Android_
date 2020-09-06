import React, {Component} from 'react';
import {Alert, Linking, StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'


const API_KEY = 'ebf08977ba46e3634bb682bfc5f6d43a';

class Location extends Component {
  state = {
    location: null,
    temp: null,
    wind: null,
    pressure: null,
    description: null,
    timeZone: null,
    reverseCode: null,
    news: []
  };
  geoCoding = () => {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${this.state.location.split(',')[0]}&longitude=${this.state.location.split(',')[1]}&localityLanguage=en`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data)
        this.setState({reverseCode: `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`}, () => {
          this.getNewsData()
        })
      });
  }

  getNewsData = () => {
    fetch(`http://newsapi.org/v2/everything?q=${this.state.reverseCode.split(',')[1]}&from=2020-09-01&sortBy=popularity&apiKey=c12cef7576204b84b350b25b0669378d`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let arr = data.articles.map(el => {
          return {
            content: el.content,
            url: el.url
          }
        });
        this.setState({news: arr})
      });
  };
  reloadStorageData = () => {

    const saveData = async (data) => {
      let date = new Date().toString().slice(0, 24);
      let location = this.state.location;
      let address = this.state.reverseCode;
      let historyData = {date, location, address};
      data.push(historyData)
      try {
        await AsyncStorage.setItem('data', JSON.stringify(data));
      } catch (e) {
        console.log('Failed to save the data to the storage')
      }
    }

    const readData = async () => {
      try {
        let data = await AsyncStorage.getItem('data')
        if (data === null) {
          data = new Array();
        } else {
          data = JSON.parse(data);
        }
        saveData(data)
      } catch (e) {
        console.log('Failed to fetch the data from storage')
      }
    }
    readData()


  }
  getWeatherData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${this.state.location.split(',')[0]}&lon=${this.state.location.split(',')[1]}&units=metric&
exclude=hourly,daily&appid=${API_KEY}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({temp: Math.round(data.current.temp)});
        this.setState({wind: Math.round(data.current.wind_speed)});
        this.setState({pressure: data.current.pressure});
        this.setState({description: data.current.weather[0].description});
        this.setState({timeZone: data.timezone}, () => {
          this.reloadStorageData();
        })
      });
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({location: `${position.coords.latitude},${position.coords.longitude}`}, () => {
            this.getWeatherData();
            this.geoCoding();
          },
          error => Alert.alert(error.message),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
      }
    )
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={{flex: 1}}>
            <View style={styles.address}>
              <Text style={styles.text}>Location: {this.state.location}</Text>
              <Text style={styles.text}>Address: {this.state.reverseCode}</Text>
            </View>
            <View style={styles.weather}>
              <Text style={styles.text}>Weather in {this.state.timeZone}:</Text>
              <Text style={styles.text}>Temperature: {this.state.temp} °C</Text>
              <Text style={styles.text}>Wind speed: {this.state.wind} m/s </Text>
              <Text style={styles.text}>Pressure: {this.state.pressure} </Text>
              <Text style={styles.text}>{this.state.description} </Text>
            </View>
            <View style={styles.address}>
              <Text style={styles.text}>News nearby</Text>

              <Text style={styles.listNews}>{this.state.news.map((el, i) =>
                <Text onPress={() => Linking.openURL(el.url)}>{i + 1}) {el.content}{"\n\n"}</Text>
              )}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  address: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    paddingTop: 50
  },
  weather: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#adc9f7',
    padding: 20

  },
  listNews: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 20
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212224'
  },
})

export default Location
