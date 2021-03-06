// @flow
import React, { Component } from "react";
import styled from "styled-components";
import type { DeviceType } from "../types";
import { IconWind, IconHumidity, IconTemperature } from "./svgs";

type PropTypes = {
  sensor: DeviceType,
  sensorRef: any
};

type StateTypes = {
  value: number
};

const Container = styled.div`
  display: flex;
  background: #ffffff;
  box-shadow: 0 6px 15px 0 rgba(73, 83, 92, 0.08);
  border-radius: 3px;
  padding: 10px 0;
  height: fit-content;
`;

const PlatformIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 40px;
`;

const Icon = styled.div`
  width: 18px;
  height: 18px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(181, 183, 196, 0.2);
  flex: 1;
`;

const Value = styled.div``;

export default class Sensor extends Component<StateTypes, PropTypes> {
  state = {
    value: 0
  };

  componentWillMount() {
    const that = this;
    this.props.sensorRef
      .child(this.props.sensor.id)
      .on("value", function(snapshot) {
        const sensor = snapshot.val();
        that.setState({ value: sensor.value });
      });
  }

  getSensorMeta = type => {
    let meta = { icon: null, prefix: null, sufix: null };

    switch (type) {
      case "temperature":
        meta = { icon: <IconTemperature />, prefix: null, sufix: "°" };
        break;
      case "humidity":
        meta = { icon: <IconHumidity />, prefix: null, sufix: "%" };
        break;
      default:
    }

    return meta;
  };

  render() {
    const { sensor } = this.props;
    const { value } = this.state;

    const { icon, prefix, sufix } = this.getSensorMeta(sensor.type);

    return (
      <Container>
        <PlatformIcon>
          <Icon>{icon}</Icon>
        </PlatformIcon>
        <Content>
          <Value>
            {prefix}
            {value}
            {sufix}
          </Value>
        </Content>
      </Container>
    );
  }
}
