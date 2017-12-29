// @flow
import React, { Component } from "react";
import { Wrapper, Content } from "./components/common";
import * as firebase from "firebase";
import config from "./config/config";
import { snapshotToArray } from "./helpers/firebase";
import Tab from "./pages/tab";
import Login from "./pages/login";

type PageType = {
  title: string,
  platform: string,
  next?: string
};

type SystemType = {
  name: string,
  description: string
};

type PropTypes = {};

type StateTypes = {
  loading: boolean,
  currentpage: PageType,
  system: SystemType,
  devices: any,
  sensors: any,
  topicsRef: any,
  sensorRef: any,
  automationRef: any,
  user: any
};

export default class App extends Component<PropTypes, StateTypes> {
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
        const automationRef = firebase.database().ref("automations");

        topicsRef.once("value").then(function(snapshot) {
          that.setState({ devices: snapshotToArray(snapshot) });
        });

        sensorRef.once("value").then(function(snapshot) {
          that.setState({ sensors: snapshotToArray(snapshot) });
        });

        that.setState({ topicsRef, sensorRef, automationRef, user });
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
      case "add":
        page = {
          title: "Automations",
          platform: "add",
          next: null
        };
        break;
      case "account":
        page = {
          title: "Account",
          platform: "account",
          next: null
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
      automationRef,
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
              automationRef={automationRef}
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
