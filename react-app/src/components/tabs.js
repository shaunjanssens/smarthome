// @flow
import React from "react";
import styled from "styled-components";

type PropTypes = {
  changeTab: Function
};

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;
const TabItem = styled.div``;

const Tabs = ({ changeTab }: PropTypes) => {
  return (
    <TabsContainer>
      <TabItem
        onClick={() => {
          changeTab("lights");
        }}
      >
        Lights
      </TabItem>
      <TabItem
        onClick={() => {
          changeTab("blinds");
        }}
      >
        Blinds
      </TabItem>
      <TabItem
        onClick={() => {
          changeTab("thermostat");
        }}
      >
        Thermostat
      </TabItem>
    </TabsContainer>
  );
};

export default Tabs;
