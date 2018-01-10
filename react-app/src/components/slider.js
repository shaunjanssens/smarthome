// @flow
import React, { Component } from "react";
import styled from "styled-components";

type PropTypes = {
  changeStep: Function,
  steps: number,
  startValue: number
};

type StateTypes = {
  knobX: number,
  step: number,
  active: boolean
};

const Track = styled.div`
  height: 10px;
  background: rgba(73, 83, 92, 0.04);
  background-image: linear-gradient(-90deg, #e24e4e 0%, #7cc1fb 100%);
  box-shadow: 0 0 15px 0 rgba(73, 83, 92, 0.1),
    inset 0 1px 3px 0 rgba(73, 83, 92, 0.1);
  border-radius: 5px;
`;
const Thumb = styled.div`
  position: relative;
  transform: translateY(-10px) translateX(-10px);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 2px 15px 0 rgba(73, 83, 92, 0.1),
    inset 0 -1px 3px 0 rgba(73, 83, 92, 0.15);

  left: ${props => props.left}px;
`;
const Tooltip = styled.div`
  position: relative;
  color: #fff;
  left: 225px;
  text-align: center;
  width: 36px;
  height: 36px;
  font-size: 1.4rem;
  transform: translateX(-12px) translateY(15px);

  &:after {
    position: absolute;
    content: "";
    width: 36px;
    height: 36px;
    background: #49535c;
    border-radius: 30px 30px 30px 4px;
    transform: rotate(135deg);
    box-shadow: 0 0 6px 0 rgba(73, 83, 92, 0.2);
    left: 0;
    top: -10px;
    z-index: -1;
  }

  left: ${props => props.left}px;
`;

export default class Slider extends Component<PropTypes, StateTypes> {
  state = { knobX: 0, step: 0, active: false };

  componentWillReceiveProps(nextProps) {
    let oneStep = this.slider.getBoundingClientRect().width / nextProps.steps;

    this.setState({
      knobX: oneStep * nextProps.step,
      step: nextProps.step
    });
  }

  getClosest = (mouseX, sliderWidth, steps) => {
    let stepWidth = sliderWidth / steps;
    let modulo = (mouseX / stepWidth) % steps;

    let initialStep = Math.floor(modulo);
    let aboveHalf = (modulo - initialStep) * 10 >= 5 ? true : false;

    let step = aboveHalf ? initialStep + 1 : initialStep;
    let knobX = step * stepWidth;

    return { step, knobX };
  };

  handleStart = e => {
    this.setState({ active: true });
    document.addEventListener("mousemove", this.handleDrag);
    document.addEventListener("mouseup", this.handleEnd);
    document.addEventListener("touchmove", this.handleTouchDrag);
    document.addEventListener("touchend", this.handleEnd);
  };

  handleTouchDrag = e => {
    e.clientX = e.touches[0].clientX;
    this.handleDrag(e);
  };

  handleDrag = e => {
    let slider = this.slider.getBoundingClientRect();
    let mouseX = e.clientX - slider.left;

    if (mouseX > 0 && mouseX < slider.width) {
      let { step, knobX } = this.getClosest(
        mouseX,
        slider.width,
        this.props.steps
      );
      this.setState({ knobX: knobX, step: step });
      this.props.changeStep(step);
    }
  };

  handleEnd = e => {
    this.setState({ active: false });
    document.removeEventListener("mousemove", this.handleDrag);
    document.removeEventListener("mouseup", this.handleEnd);
    document.removeEventListener("touchmove", this.handleTouchDrag);
    document.removeEventListener("touchend", this.handleEnd);
  };

  render() {
    return (
      <Track
        innerRef={slider => {
          this.slider = slider;
        }}
        onClick={this.handleDrag}
      >
        {this.state.knobX ? (
          <div>
            <Thumb
              left={this.state.knobX}
              onMouseDown={this.handleStart}
              onTouchStart={this.handleStart}
            />
            <Tooltip left={this.state.knobX}>
              {this.props.startValue + this.state.step}
            </Tooltip>
          </div>
        ) : null}
      </Track>
    );
  }
}
