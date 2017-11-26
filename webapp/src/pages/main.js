// @Flow
import React, { Component } from "react";
import styled from "styled-components";
import { black } from "../components/variables";
import { rem, rgba } from "../components/helpers";
import firebase, { auth, provider } from "../services/firebase.js";
import Wrapper from "../components/wrapper";
import Header from "../components/header";
import Button from "../components/button";

type PropTypes = {};

const Profile = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const ProfilePicture = styled.img`
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 50%;
`;
const ProfileName = styled.span`
  line-height: 32px;
  font-weight: 600;
  padding-left: 15px;
`;

export default class MainPage extends Component<PropTypes> {
  state = {
    user: null
  };

  componentDidMount() {
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
        console.log(user);
      }
    });
  }

  render() {
    const { user } = this.state;
    return (
      <Wrapper>
        <Header title="Lights" nextTitle="Thermostat" />
        {user && (
          <Profile>
            <ProfilePicture src={user.photoURL} />
            <ProfileName>Welcome {user.displayName}</ProfileName>
          </Profile>
        )}
        <Button onClick={this.props.logout}>Logout</Button>
      </Wrapper>
    );
  }
}
