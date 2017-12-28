// @flow
import React from "react";
import styled from "styled-components";
import Header from "../components/header";
import Thermostat from "./thermostat";
import Output from "../components/output";
import Sensor from "../components/sensor";

import type { DeviceType, PageType } from "../types";

type PropTypes = {
  page: PageType,
  devices: Array<DeviceType>,
  sensors: Array<DeviceType>,
  topicsRef: any,
  sensorRef: any,
  changeTab: Function
};

const DevicesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const renderOutputTab = (page, devices, topicsRef) => {
  return devices
    .filter(device => device.platform === page.platform)
    .map(device => {
      return (
        <Output device={device} topicsRef={topicsRef} key={device.topic} />
      );
    });
};

const Tab = ({
  page,
  devices,
  sensors,
  topicsRef,
  sensorRef,
  changeTab
}: PropTypes) => {
  if (devices && sensors) {
    return (
      <div>
        <Header page={page} changeTab={changeTab} />
        <DevicesContainer>
          {page.platform === "thermostat" ? (
            <Thermostat page={page} sensors={sensors} sensorRef={sensorRef} />
          ) : (
            renderOutputTab(page, devices, topicsRef)
          )}
        </DevicesContainer>
      </div>
    );
  } else {
    return <h1>Loading</h1>;
  }
};

export default Tab;
