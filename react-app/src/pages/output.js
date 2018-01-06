// @flow
import React from "react";
import Output from "../components/output";

const renderOutputTab = (page, devices, deviceRef) => {
  return devices
    .filter(device => device.platform === page.platform)
    .map(device => {
      return (
        <Output device={device} deviceRef={deviceRef} key={device.topic} />
      );
    });
};

const OutputPage = ({ page, devices, deviceRef }) => {
  return renderOutputTab(page, devices, deviceRef);
};

export default OutputPage;
