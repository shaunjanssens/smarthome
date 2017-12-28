// @flow
import React from "react";
import styled from "styled-components";
import { IconWind, IconHumidity } from "./svgs";

type PropTypes = {
  weather: any
};

const Container = styled.div`
  background: #ffffff;
  box-shadow: 0 6px 15px 0 rgba(73, 83, 92, 0.08);
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 40px;
`;
const Content = styled.div`
  display: flex;
`;
const Temperature = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-right: 10px;
  font-size: 3.2rem;
  font-weight: 200;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
  padding-left: 15px;
  border-left: 1px solid rgba(181, 183, 196, 0.2);
`;
const Place = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
  margin-bottom: 15px;
`;
const Meta = styled.div`
  display: flex;
  font-size: 1.2rem;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
`;
const Icon = styled.div`
  display: inline-block;
  margin-right: 7px;
  width: 14px;
  height: 14px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const weather = ({ weather }: PropTypes) => {
  if (weather) {
    return (
      <Container>
        <Content>
          <Temperature>{Math.round(weather.main.temp)}°</Temperature>
          <Info>
            <Place>Weather in {weather.name}</Place>
            <Meta>
              <Item>
                <Icon>
                  <IconWind />
                </Icon>
                {Math.round(weather.wind.speed)} km/h
              </Item>
              <Item>
                <Icon>
                  <IconHumidity />
                </Icon>
                {Math.round(weather.main.humidity)}%
              </Item>
            </Meta>
          </Info>
        </Content>
      </Container>
    );
  } else {
    return <h1>Loading</h1>;
  }
};

export default weather;
