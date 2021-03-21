import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

class ActivityTypePicker extends Component {
  state = {
    popupOpen: false,
    selectedActivityType: "activitytype"
  };

  handleActivityTypeSelection = activitytype => {
    // Callback fn that sends selected activitytype to parent component
    const { updateSelection } = this.props;
    this.setState({ popupOpen: false, selectedActivityType: activitytype.name });
    updateSelection("activitytype", activitytype.name, activitytype.id);
  };

  render() {
    const { popupOpen, selectedActivityType } = this.state;
    const { activityTypes, type } = this.props;
    const categoryList = activityTypes.map(activitytypeObject => (
      <ActivityTypeListItem
        key={activitytypeObject.id}
        onClick={e => this.handleActivityTypeSelection(activitytypeObject, e)}
      >
        {activitytypeObject.name}
      </ActivityTypeListItem>
    ));

    return (
      <ActivityTypeWrapper type={type}>
        <ActivityTypeBox
          type={type}
          onFocus={() => this.setState({ popupOpen: true })}
          onClick={() => this.setState({ popupOpen: true })}
        >
          {selectedActivityType}
        </ActivityTypeBox>
        {popupOpen && <ul>{categoryList}</ul>}
      </ActivityTypeWrapper>
    );
  }
}

export default ActivityTypePicker;

ActivityTypePicker.propTypes = {
  updateSelection: PropTypes.func.isRequired,
  activityTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired
};

const ActivityTypeWrapper = styled.div`
  margin-bottom: ${props => (props.type === "form" ? "5px" : "")};
  &:focus {
    outline: none;
  }
  ul {
    list-style-type: none;
    margin: 2px 2px 0px 0px;
    padding: 0;
    position: absolute;
    display: grid;
    grid-template-columns: 1fr;
    width: ${props => (props.type === "form" ? "130px" : "140px")};
    grid-gap: 5px;
    background: white;
    padding: 2px;
    border-radius: 3px;
    box-shadow: rgba(0, 0, 0, 0.5) 0 3px 10px 0;
    z-index: 1;
  }
`;

const ActivityTypeBox = styled.div`
  width: 90%;
  cursor: pointer;
  text-align: left;
  text-transform: capitalize;
  font-size: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #757575;
  background-color: #fff;
  border-radius: 3px;
  transition: all 100ms ease-out;
  &:hover {
    background: purple;
    color: white;
  }
`;

const ActivityTypeListItem = styled.li`
  text-transform: capitalize;
  text-align: left;
  cursor: pointer;
  padding: 3px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  &:hover {
    color: white;
    background: black;
  }
`;
