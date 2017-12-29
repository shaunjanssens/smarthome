// @flow
import React from "react";
import styled from "styled-components";
import { IconAdd, IconProfile, IconArrow } from "./svgs";
import type { PageType } from "../types";

type PropTypes = {
  page: PageType,
  changeTab: Function
};

const Container = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ecedee;
`;
const Content = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;

  div {
    margin-left: 15px;
  }
`;
const Icon = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
`;
const Title = styled.h1`
  padding-bottom: 0;
`;
const Next = styled.h3`
  padding: 6px 0 0;

  div {
    margin-left: 10px;
  }
`;

const Header = ({ page, changeTab }: PropTypes) => {
  return (
    <Container>
      <Icons>
        <Icon
          icon="profile"
          onClick={() => {
            changeTab("account");
          }}
        >
          <IconProfile />
        </Icon>
        <Icon
          icon="add"
          onClick={() => {
            changeTab("add");
          }}
        >
          <IconAdd />
        </Icon>
      </Icons>
      <Content>
        <Title>{page.title}</Title>
        {page.next && (
          <Next
            onClick={() => {
              changeTab(page.next);
            }}
          >
            {page.next}
            <Icon icon="next">
              <IconArrow />
            </Icon>
          </Next>
        )}
      </Content>
    </Container>
  );
};

export default Header;
