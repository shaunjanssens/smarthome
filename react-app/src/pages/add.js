// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { snapshotToArray } from "../helpers/firebase";
import { Button } from "../components/common";

type PropTypes = {
  automationRef: any
};

type StateTypes = {
  automations?: Array<any>,
  platform: string,
  condition: string,
  devicevalue?: string
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Automations = styled.div``;

const Automation = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0 6px 20px 0 rgba(73, 83, 92, 0.08);
  padding: 15px 20px;
  transition: all 0.15s;
  user-select: none;
  margin-bottom: 20px;
  font-size: 1.6rem;

  p {
    padding-bottom: 10px;
  }
`;

const LastFired = styled.div`
  font-size: 1.4rem;
`;

const Delete = styled.div`
  border-top: 1px solid rgba(181, 183, 196, 0.2);
  margin-top: 15px;
  padding-top: 15px;
  cursor: pointer;
`;

const Form = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0 6px 20px 0 rgba(73, 83, 92, 0.08);
  padding: 20px;
  transition: all 0.15s;
  height: fit-content;
`;
const Input = styled.input`
  width: 100%;
  height: 50px;
  text-align: center;
  font-size: 1.6rem;
  font-family: inherit;
  border: 1px solid rgba(73, 83, 92, 0.1);
  border-radius: 3px;
  outline: none;
  margin-bottom: 20px;

  &::placeholder {
    color: rgba(73, 83, 92, 0.4);
  }
`;
const Select = styled.select`
  width: 100%;
  height: 50px;
  text-align-last: center;
  font-size: 1.6rem;
  font-family: inherit;
  border: 1px solid rgba(73, 83, 92, 0.1);
  border-radius: 3px;
  outline: none;
  margin-bottom: 20px;
  background: transparent;

  &::placeholder {
    color: rgba(73, 83, 92, 0.4);
  }
`;

export default class Add extends Component<PropTypes, StateTypes> {
  state = {
    automations: null,
    when: "",
    condition: "morethan",
    platform: "default",
    devicevalue: "default",
    value: "",
    event: "",
    error: false
  };

  componentDidMount() {
    const that = this;
    this.props.automationRef.on("value", snapshot => {
      that.setState({ automations: snapshotToArray(snapshot) });
    });
  }

  generateNiceSentence = automation => {
    const trigger = automation.if.topic;

    let value;
    let condition;
    if (automation.if.morethan) {
      value = automation.if.morethan;
      condition = "more than";
    } else if (automation.if.lessthan) {
      value = automation.if.lessthan;
      condition = "less than";
    } else if (automation.if.equals) {
      value = automation.if.equals;
      condition = "equals";
    }

    let event;
    if (automation.then.platform === "ifttt") {
      event = "trigger " + automation.then.event + " event";
    } else if (automation.then.platform === "output") {
      let status = automation.then.value === "1" ? "on" : "off";
      event = "turn " + automation.then.event + " " + status;
    }

    return `When ${trigger} is ${condition} ${value} then ${event}.`;
  };

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      error: false
    });
  };

  handleForm = () => {
    const { when, condition, value, event, platform, devicevalue } = this.state;

    if (when && condition && value && event && platform) {
      const postkey = this.props.automationRef.push().key;
      this.props.automationRef.child(postkey).set({
        key: postkey,
        if: {
          [condition]: value,
          topic: when
        },
        then: {
          event: event,
          platform: platform,
          value: devicevalue
        }
      });

      this.setState({
        when: "",
        condition: "morethan",
        value: "",
        event: "",
        platform: "default",
        devicevalue: "default"
      });
    } else {
      this.setState({ error: true });
    }
  };

  handleDelete = key => {
    this.props.automationRef.child(key).remove();
  };

  render() {
    const {
      automations,
      when,
      condition,
      value,
      event,
      platform,
      devicevalue
    } = this.state;

    if (automations) {
      return (
        <Container>
          <Automations>
            {automations.map(automation => {
              const rawDate = new Date(automation.lastfired);
              const date =
                rawDate.getDate() +
                "/" +
                rawDate.getMonth() +
                "/" +
                rawDate.getFullYear();
              const time = rawDate.getHours() + ":" + rawDate.getMinutes();

              return (
                <Automation key={automation.key}>
                  <p>{this.generateNiceSentence(automation)}</p>
                  <LastFired>
                    {automation.lastfired
                      ? `Last fired on ${date} at ${time}`
                      : `Never fired`}
                  </LastFired>
                  <Delete
                    onClick={() => {
                      this.handleDelete(automation.key);
                    }}
                  >
                    Delete this automation
                  </Delete>
                </Automation>
              );
            })}
          </Automations>
          <Form>
            <Input
              type="text"
              name="when"
              placeholder="when sensor"
              value={when}
              onChange={this.handleChange}
            />
            <Select
              name="condition"
              value={condition}
              onChange={this.handleChange}
            >
              <option value="morethan">more than</option>
              <option value="lessthan">less than</option>
              <option value="equals">equals</option>
            </Select>
            <Input
              type="text"
              name="value"
              placeholder="value"
              value={value}
              onChange={this.handleChange}
            />
            <Select
              name="platform"
              value={platform}
              onChange={this.handleChange}
            >
              <option value="default" disabled>
                then trigger
              </option>
              <option value="ifttt">ifttt</option>
              <option value="output">output</option>
            </Select>
            {platform === "ifttt" ? (
              <Input
                type="text"
                name="event"
                placeholder="with event"
                value={event}
                onChange={this.handleChange}
              />
            ) : null}
            {platform === "output" ? (
              <div>
                <Input
                  type="text"
                  name="event"
                  placeholder="with device key"
                  value={event}
                  onChange={this.handleChange}
                />
                <Select
                  name="devicevalue"
                  value={devicevalue}
                  onChange={this.handleChange}
                >
                  <option value="default" disabled>
                    and value
                  </option>
                  <option value="1">on</option>
                  <option value="0">off</option>
                </Select>
              </div>
            ) : null}
            <Button
              onClick={() => {
                this.handleForm();
              }}
              value="add automation"
            />
          </Form>
        </Container>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }
}
