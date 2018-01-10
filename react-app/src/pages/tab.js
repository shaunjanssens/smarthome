// @flow
import React, { Component } from "react";
import styled from "styled-components";
import Header from "../components/header";
import ThermostatPage from "./thermostat";
import AutomationsPage from "./automations";
import OutputPage from "./output";
import Loading from "../components/loading";

import type { DeviceType, SensorType, RoomType, PageType } from "../types";

type PropTypes = {
  devices: Array<DeviceType>,
  sensors: Array<SensorType>,
  rooms: Array<RoomType>,
  deviceRef: any,
  sensorRef: any,
  automationRef: any
};

type StateTypes = {
  index: number,
  noTabPage?: any
};

export default class Tab extends Component<PropTypes, StateTypes> {
  state = {
    index: 0,
    noTabPage: null
  };

  getPages = () => {
    const { page } = this.state;
    const { rooms } = this.props;

    let pages = [];
    rooms.map((room, i, arr) => {
      pages.push(room);
      pages[i].index = i;
      pages[i].next = arr.length - 1 !== i ? rooms[i + 1].name : "Thermostat";
      return pages[i];
    });

    let thermostatPage = {
      id: "thermostat",
      name: "Thermostat",
      next: pages[0].name,
      index: pages.length
    };
    pages.push(thermostatPage);

    return pages;
  };

  changeTab = (index: number, page?: string) => {
    const pages = this.getPages();
    const newIndex = index > pages.length - 1 ? 0 : index;

    let noTabPage = false;

    if (page === "automations") {
      noTabPage = {
        name: "Automations",
        id: "automations"
      };
    }
    this.setState({ index: newIndex, noTabPage });
  };

  render() {
    const {
      devices,
      sensors,
      rooms,
      deviceRef,
      sensorRef,
      automationRef
    } = this.props;
    const { index, noTabPage } = this.state;

    if (devices && sensors && rooms) {
      let page = !noTabPage ? this.getPages()[index] : noTabPage;

      let output;

      if (page.id === "thermostat") {
        output = (
          <ThermostatPage
            sensors={sensors}
            sensorRef={sensorRef}
            key={page.id}
          />
        );
      } else if (page.id === "automations") {
        output = <AutomationsPage automationRef={automationRef} />;
      } else {
        output = <OutputPage page={page} deviceRef={deviceRef} key={page.id} />;
      }

      return (
        <div>
          <Header page={page} changeTab={this.changeTab} />
          {output}
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}
