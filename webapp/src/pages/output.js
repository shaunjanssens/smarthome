// @flow
import React from "react";
import styled from "styled-components";
import Output from "../components/output";

const renderOutputTab = (page, devices, topicsRef) => {
  return devices
    .filter(device => device.platform === page.platform)
    .map(device => {
      return (
        <Output device={device} topicsRef={topicsRef} key={device.topic} />
      );
    });
};

const OutputPage = ({ page, devices, topicsRef }) => {
  return renderOutputTab(page, devices, topicsRef);
};

export default OutputPage;
