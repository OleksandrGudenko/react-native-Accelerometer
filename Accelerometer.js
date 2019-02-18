import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

export default class AccelerometerSensor extends React.Component {
  state = {
    accelerometerData: {},
    action: [],
    average: [],
    position: {},
    toggle:{},
    batterySaver: {},
    runCounter: 0
  }

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
      this.setState({toggle: {service: 'Turn On'}})
    } else {
      this._subscribe();
      Accelerometer.setUpdateInterval(50);
      this.setState({toggle: {service: 'Turn Off'}})
    }
    
    
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(100); 
    this.setState({batterySaver: true})
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(50);
    this.setState({batterySaver: false})
  }

  _subscribe = () => {
      this._subscription = Accelerometer.addListener(accelerometerData => {        
        var length = this.state.action.length;
        if (length == 3){      

            var res = [];
            let action = this.state.action;
            for (var i = 0; i < this.state.action.length; i++){
                var x = action[i].x;
                var y = action[i].y;
                var z = action[i].z;
                var averageRes = Math.sqrt(( Math.pow(x, 2) ) + ( Math.pow(z, 2) ) + (Math.pow(y, 2)) ); 
                res = res.concat(averageRes);
            }
            var speed = [];
            var a;
            var b;
            var c;
            if( res.length == 3){
                for (var i=0; i < res.length; i++){
                    speed.push(Math.abs(res[i]*0.45-0.45)*3.6) ;
                }
                    for (var i=0; i< speed.length;i++){
                        if (i == 0) a = speed[i];
                        if (i == 1) b = speed[i];
                        if (i == 2) c = speed[i];
                    }

                var userSpeed = (a + b + c)/ 3;
                    if (  userSpeed < 0.55 ){
                        this.setState({position: {state:'Walking'}})
                    } else if (userSpeed > 0.55){
                        this.setState({position: {state:'Running'}})
                        this.setState({runCounter: this.state.runCounter +1})
                    }
                }
            

            this.setState({action: this.state.action.slice(1),
                accelerometerData: accelerometerData,
                average: res,
            });

        } if (length < 3) {
            this.setState({ 
                accelerometerData: accelerometerData,
                action: this.state.action.concat([accelerometerData]),
            });
        }
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {
    let { state } = this.state.position;
    let { service } = this.state.toggle;
    let { x, y, z } = this.state.accelerometerData;

    return (
      <View style={styles.sensor}>
        <Text style={styles.heading}>{state}</Text>
        <Text>Run Counter: {this.state.runCounter}</Text>

        <Text>Accelerometer:</Text>
        <Text>x: {round(x)} y: {round(y)} z: {round(z)}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>{service}</Text>
          </TouchableOpacity>
          {this.state.batterySaver == true ?
                    <TouchableOpacity onPress={this._fast} style={styles.button}>
                    <Text>Battery Saver is On</Text>
                    </TouchableOpacity>
            :
            <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Battery Saver is Off</Text>
            </TouchableOpacity>
          }
        </View>

      </View>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
    width: 400
  },
  button: {
    flex: 1,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  heading: {
      fontSize: 90,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 25
  },
  list: {
      marginTop: 20
  }
});
