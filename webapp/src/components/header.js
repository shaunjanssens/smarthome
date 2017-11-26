// @Flow
import React, { Component } from "react";
import styled from "styled-components";
import { black } from "./variables";
import { rem, rgba } from "./helpers";

type PropTypes = {
  title: string,
  nextTitle?: string,
  icons: boolean
};

const HeaderContainer = styled.div``;
const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 30px 0px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${rgba(black, 0.1)};
`;
const HeaderTitle = styled.h2`
  font-size: ${rem(26)};
`;
const NextTitle = styled.h3`
  font-size: ${rem(18)};
  padding-top: 7px;
`;
const Icons = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  width: 100%;

  > * {
    margin-left: 10px;
  }
`;
const IconProfile = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background: ${black};
`;
const IconAdd = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background: ${black};
`;
const IconNext = styled.span`
  display: inline-block;
  width: 6px;
  height: 10px;
  background: ${black};
  margin-left: 5px;
`;

export default class Header extends Component<PropTypes> {
  static defaultProps = {
    icons: true
  };
  render() {
    const { title, nextTitle, icons } = this.props;
    return (
      <HeaderContainer>
        {icons ? (
          <Icons>
            <IconProfile />
            <IconAdd />
          </Icons>
        ) : (
          <Icons />
        )}
        <HeaderContent>
          <HeaderTitle>{title}</HeaderTitle>
          {nextTitle && (
            <NextTitle>
              {nextTitle} <IconNext />
            </NextTitle>
          )}
        </HeaderContent>
      </HeaderContainer>
    );
  }
}
