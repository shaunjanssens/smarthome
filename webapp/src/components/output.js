// @flow
import React, { Component } from "react";
import styled from "styled-components";
import Toggle from "./toggle";
import UpAndDown from "./upanddown";
import type { DeviceType } from "../types";

type PropTypes = {
  device: DeviceType,
  deviceRef: any
};

type StateTypes = {
  value: number
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
    value: 0
  };

  componentWillMount() {
    const that = this;
    this.props.deviceRef
      .child(this.props.device.topic)
      .on("value", function(snapshot) {
        const device = snapshot.val();
        that.setState({ value: device.value });
      });
  }

  changeDeviceStatus = status => {
    this.props.deviceRef.child(this.props.device.topic).update({
      value: status === 1 ? 0 : 1
    });
  };

  render() {
    const { device } = this.props;
    const { value } = this.state;

    if (device) {
      if (device.platform === "lights") {
        return (
          <OutputContainer status={value}>
            <OutputContent>
              <OutputName>{device.name}</OutputName>
              <Toggle value={value} statusChange={this.changeDeviceStatus} />
            </OutputContent>
          </OutputContainer>
        );
      } else if (device.platform === "blinds") {
        return (
          <OutputContainer status={value}>
            <OutputContent>
              <OutputName>{device.name}</OutputName>
              <UpAndDown value={value} statusChange={this.changeDeviceStatus} />
            </OutputContent>
          </OutputContainer>
        );
      }
    } else {
      return null;
    }
  }
}
