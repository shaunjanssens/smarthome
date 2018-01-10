// @flow
import React, { Component } from "react";
import { Wrapper, Content } from "./components/common";
import * as firebase from "firebase";
import config from "./config/config";
import { snapshotToArray } from "./helpers/firebase";
import Tab from "./pages/tab";
import Login from "./pages/login";
import Loading from "./components/loading";

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
  system: SystemType,
  devices: any,
  sensors: any,
  rooms: any,
  deviceRef: any,
  sensorRef: any,
  automationRef: any,
  roomsRef: any,
  user: any
};

export default class App extends Component<PropTypes, StateTypes> {
  state = {
    loading: true
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
        const deviceRef = firebase.database().ref("devices");
        const sensorRef = firebase.database().ref("sensors");
        const automationRef = firebase.database().ref("automations");
        const roomsRef = firebase.database().ref("rooms");

        deviceRef.once("value").then(function(snapshot) {
          that.setState({ devices: snapshotToArray(snapshot) });
        });

        sensorRef.once("value").then(function(snapshot) {
          that.setState({ sensors: snapshotToArray(snapshot) });
        });

        roomsRef.once("value").then(function(snapshot) {
          let rooms = snapshotToArray(snapshot).sort((a, b) => {
            return a.order - b.order;
          });
          that.setState({ rooms });
        });

        that.setState({ deviceRef, sensorRef, automationRef, roomsRef, user });
      }
    });
  }

  render() {
    const {
      loading,
      system,
      devices,
      sensors,
      rooms,
      currentpage,
      deviceRef,
      sensorRef,
      automationRef,
      user
    } = this.state;
    return (
      <Wrapper>
        <Content>
          {loading ? (
            <Loading />
          ) : user ? (
            <Tab
              page={currentpage}
              devices={devices}
              sensors={sensors}
              rooms={rooms}
              deviceRef={deviceRef}
              sensorRef={sensorRef}
              automationRef={automationRef}
            />
          ) : (
            <Login system={system} />
          )}
        </Content>
      </Wrapper>
    );
  }
}
