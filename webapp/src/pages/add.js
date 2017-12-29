// @flow
import React, { Component } from "react";
import styled from "styled-components";
import { snapshotToArray } from "../helpers/firebase";
import { Button } from "../components/common";

type PropTypes = {
  automationRef: any
};

type StateTypes = {
  automations?: Array<any>
};

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
`;

const Form = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0 6px 20px 0 rgba(73, 83, 92, 0.08);
  padding: 20px;
  transition: all 0.15s;
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
      event = automation.then.event + " event";
    }

    return `When ${trigger} is ${condition} ${value} then trigger ${event}.`;
  };

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      error: false
    });
  };

  handleForm = () => {
    const { when, condition, value, event } = this.state;

    if (when && condition && value && event) {
      const randomString =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);

      this.props.automationRef.child(randomString).set({
        key: randomString,
        if: {
          [condition]: value,
          topic: when
        },
        then: {
          event: event,
          platform: "ifttt"
        }
      });
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const { automations } = this.state;

    if (automations) {
      return (
        <div>
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
                  <Delete>Delete this automation</Delete>
                </Automation>
              );
            })}
          </Automations>
          <Form>
            <Input
              type="text"
              name="when"
              placeholder="when sensor"
              onChange={this.handleChange}
            />
            <Select
              name="condition"
              defaultValue="morethan"
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
              onChange={this.handleChange}
            />
            <Input
              type="text"
              name="event"
              placeholder="then tigger event"
              onChange={this.handleChange}
            />
            <Button
              onClick={() => {
                this.handleForm();
              }}
              value="add automation"
            />
          </Form>
        </div>
      );
    } else {
      return <h1>Loading</h1>;
    }
  }
}
