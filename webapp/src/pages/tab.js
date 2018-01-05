// @flow
import React from "react";
import styled from "styled-components";
import Header from "../components/header";
import ThermostatPage from "./thermostat";
import AddPage from "./add";
import OutputPage from "./output";
import Loading from "../components/loading";

import type { DeviceType, PageType } from "../types";

type PropTypes = {
  page: PageType,
  devices: Array<DeviceType>,
  sensors: Array<DeviceType>,
  deviceRef: any,
  sensorRef: any,
  automationRef: any,
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

const Tab = ({
  page,
  devices,
  sensors,
  deviceRef,
  sensorRef,
  automationRef,
  changeTab
}: PropTypes) => {
  if (devices && sensors) {
    let output;

    if (page.platform === "thermostat") {
      output = (
        <ThermostatPage page={page} sensors={sensors} sensorRef={sensorRef} />
      );
    } else if (page.platform === "add") {
      output = <AddPage automationRef={automationRef} />;
    } else {
      output = (
        <OutputPage page={page} devices={devices} deviceRef={deviceRef} />
      );
    }

    return (
      <div>
        <Header page={page} changeTab={changeTab} />
        <DevicesContainer>{output}</DevicesContainer>
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Tab;
