// @flow
import React, { Component } from "react";
import styled from "styled-components";
import Toggle from "./toggle";
import UpAndDown from "./upanddown";
import type { DeviceType } from "../types";

type PropTypes = {
  device: DeviceType,
  topicsRef: any
};

type StateTypes = {
  lastvalue: number
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
    lastvalue: 0
  };

  componentWillMount() {
    const that = this;
    this.props.topicsRef
      .child(this.props.device.topic)
      .on("value", function(snapshot) {
        const device = snapshot.val();
        that.setState({ lastvalue: device.lastvalue });
      });
  }

  changeDeviceStatus = status => {
    this.props.topicsRef.child(this.props.device.topic).update({
      lastvalue: status === 1 ? 0 : 1
    });
  };

  render() {
    const { device } = this.props;
    const { lastvalue } = this.state;

    if (device) {
      if (device.platform === "lights") {
        return (
          <OutputContainer status={lastvalue}>
            <OutputContent>
              <OutputName>{device.name}</OutputName>
              <Toggle
                value={lastvalue}
                statusChange={this.changeDeviceStatus}
              />
            </OutputContent>
          </OutputContainer>
        );
      } else if (device.platform === "blinds") {
        return (
          <OutputContainer status={lastvalue}>
            <OutputContent>
              <OutputName>{device.name}</OutputName>
              <UpAndDown
                value={lastvalue}
                statusChange={this.changeDeviceStatus}
              />
            </OutputContent>
          </OutputContainer>
        );
      }
    } else {
      return null;
    }
  }
}
