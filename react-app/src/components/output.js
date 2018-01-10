// @flow
import React, { Component } from "react";
import styled from "styled-components";
import Toggle from "./toggle";
import UpAndDown from "./upanddown";
import Loading from "./loading";
import type { DeviceType } from "../types";

type PropTypes = {
  deviceId: string,
  deviceRef: any
};

type StateTypes = {
  device?: DeviceType
};

const OutputContainer = styled.div`
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0 6px 20px 0 rgba(73, 83, 92, 0.08);
  padding: 0 20px;
  transition: all 0.15s;
  user-select: none;

  ${props => {
    if (props.status) {
      return `border-left: 3px solid #6FD38A`;
    } else {
      return `border-left: 3px solid #E24E4E`;
    }
  }};
`;
const OutputContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;
const OutputName = styled.div`
  font-size: 18px;
  color: #49535c;
  margin-right: auto;
`;

export default class Output extends Component<StateTypes, PropTypes> {
  state = {
    device: null
  };

  componentWillMount() {
    const that = this;
    const { deviceId, deviceRef } = this.props;

    deviceRef.child(deviceId).on("value", function(snapshot) {
      that.setState({ device: snapshot.val() });
    });
  }

  changeDeviceStatus = status => {
    const { deviceId, deviceRef } = this.props;
    deviceRef.child(deviceId).update({
      state: status === 0 ? 1 : 0
    });
  };

  render() {
    const { deviceId, deviceRef } = this.props;
    const { device } = this.state;

    if (device) {
      if (device.type === "light" || device.type === "outlet") {
        return (
          <OutputContainer status={device.state} key={device.id}>
            <OutputContent>
              <OutputName>{device.name}</OutputName>
              <Toggle
                value={device.state}
                statusChange={this.changeDeviceStatus}
              />
            </OutputContent>
          </OutputContainer>
        );
      } else if (device.type === "blinds") {
        return (
          <OutputContainer status={device.state} key={device.id}>
            <OutputContent>
              <OutputName>{device.name}</OutputName>
              <UpAndDown
                value={device.state}
                statusChange={this.changeDeviceStatus}
              />
            </OutputContent>
          </OutputContainer>
        );
      }
    } else {
      return <Loading />;
    }

    return null;
  }
}
