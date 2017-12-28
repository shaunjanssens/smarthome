// @flow
import React, { Component } from "react";
import { Wrapper, Content } from "./components/common";
import * as firebase from "firebase";
import config from "./config/config";
import { snapshotToArray } from "./helpers/firebase";
import Tab from "./pages/tab";
import Login from "./pages/login";

export default class App extends Component {
  state = {
    loading: true,
    currentpage: {
      title: "Lights",
      platform: "lights",
      next: "blinds"
    }
  };

  componentWillMount() {
    firebase.initializeApp(config.firebase);
    this.setState({ system: config.system });
  }

  componentDidMount() {
    const that = this;

    firebase.auth().onAuthStateChanged(function(user) {
      that.setState({ loading: false });
      if (user) {
        const topicsRef = firebase.database().ref("topics");
        const sensorRef = firebase.database().ref("sensors");

        let devices = null;
        let sensors = null;

        topicsRef.once("value").then(function(snapshot) {
          that.setState({ devices: snapshotToArray(snapshot) });
        });

        sensorRef.once("value").then(function(snapshot) {
          that.setState({ sensors: snapshotToArray(snapshot) });
        });

        that.setState({ topicsRef, sensorRef, user });
      }
    });
  }

  changeTab = tab => {
    let page;

    switch (tab) {
      case "lights":
        page = {
          title: "Lights",
          platform: "lights",
          next: "blinds"
        };
        break;
      case "blinds":
        page = {
          title: "Blinds",
          platform: "blinds",
          next: "thermostat"
        };
        break;
      case "thermostat":
        page = {
          title: "Thermostat",
          platform: "thermostat",
          next: "lights"
        };
        break;
      default:
        page = {
          title: "Lights",
          platform: "lights",
          next: "blinds"
        };
    }

    this.setState({ currentpage: page });
  };

  render() {
    const {
      loading,
      system,
      devices,
      sensors,
      currentpage,
      topicsRef,
      sensorRef,
      user
    } = this.state;

    return (
      <Wrapper>
        <Content>
          {loading ? (
            <h1>Loading</h1>
          ) : user ? (
            <Tab
              page={currentpage}
              devices={devices}
              sensors={sensors}
              topicsRef={topicsRef}
              sensorRef={sensorRef}
              changeTab={this.changeTab}
            />
          ) : (
            <Login system={system} />
          )}
        </Content>
      </Wrapper>
    );
  }
}
