import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Router from "next/router";
import axios from "utils/request";
import Input from "./Input";
import { WideButton } from "./shared/Buttons";
import SelectParticipantRange from "./SelectParticipantRange";
import DateRangePicker from "./DateRangePicker";
import DynamicActivitySearch from "./DynamicActivitySearch";
import DynamicLocationSearch from "./DynamicLocationSearch";
import config from "../config.json";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

class EventForm extends Component {
  state = {
    name: "",
    description: "",
    activityId: null,
    locationId: null,
    dateFrom: null,
    dateTo: null,
    minPeople: 2,
    maxPeople: 4,
    valid: true
  };

  handleSubmit = e => {
    e.preventDefault();
    // create new event object to be sent to API
    const newEvent = {
      name: this.state.name,
      minPeople: this.state.minPeople,
      maxPeople: this.state.maxPeople,
      activityId: this.state.activityId,
      locationId: this.state.locationId,
      description: this.state.description,
      dateFrom: this.state.dateFrom,
      dateTo: this.state.dateTo
    };

    // validate new object
    const REQUIRED_FIELDS = ["name", "activityId", "maxPeople"];
    for (let i = 0; i < REQUIRED_FIELDS.length; i++) {
      if (!newEvent[REQUIRED_FIELDS[i]]) {
        this.setState({ valid: false });
        return;
      }
    }
    this.props.createEvent(newEvent);
  };

  handleBackButton = () => {
    Router.push("/events");
  };

  handleInput = e => {
    // Method that syncs current input with state
    const { name, value } = e.target;
    const inputValue = { ...this.state, [name]: value };
    this.setState(inputValue);
  };

  updateActivity = (payload, existsInDB) => {
    // existsInDB flag is used to determine if that is a brand new attribute coming and needs to be created in DB or it is existing one
    if (existsInDB) {
      this.setState({ activityId: payload.id });
    } else {
      // create new instance of attribute with the ID
      const token = localStorage.getItem("token");
      const AuthStr = `Bearer ${token}`;
      const data = {
        name: payload.name
      };
      axios({
        method: "post",
        url: `${backendUrlFull}/activities`,
        data,
        headers: {
          Authorization: AuthStr
        }
      })
        .then(response => {
          this.setState({ activityId: response.data.id });
        })
        .catch(error => console.error(error));
    }
  };

  updateLocation = (payload, existsInDB) => {
    // existsInDB flag is used to determine if that is a brand new attribute coming and needs to be created in DB or it is existing one
    if (existsInDB) {
      this.setState({ locationId: payload.id });
    } else {
      // create new instance of attribute with the ID
      const token = localStorage.getItem("token");
      const AuthStr = `Bearer ${token}`;
      const data = {
        city: payload.city,
        country: payload.country
      };
      axios({
        method: "post",
        url: `${backendUrlFull}/locations`,
        data,
        headers: {
          Authorization: AuthStr
        }
      })
        .then(response => {
          this.setState({ locationId: response.data.id });
        })
        .catch(error => console.error(error));
    }
  };

  updateParticipantRange = (min, max) => {
    this.setState({ minPeople: min, maxPeople: max });
  };

  updateDateRange = (startDate, endDate) => {
    this.setState({
      dateFrom: startDate,
      dateTo: endDate
    });
  };

  render() {
    const { valid } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Event Name"
          onChange={this.handleInput}
          required
        />
        <Input
          id="description"
          name="description"
          type="text"
          placeholder="Description"
          onChange={this.handleInput}
        />
        <DynamicActivitySearch
          activities={this.props.activities}
          updateActivity={this.updateActivity}
          type="activities"
          placeholder="Activity"
          allowNew
        />
        <DynamicLocationSearch
          locations={this.props.locations}
          updateLocation={this.updateLocation}
          placeholder="City"
          allowNew
        />
        <SelectParticipantRange
          updateParticipantRange={this.updateParticipantRange}
        />
        <DateRangePicker updateDateRange={this.updateDateRange} />
        {!valid && (
          <ErrorMsg>
            Please make sure you filled name, activity and max people fields to
            continue!
          </ErrorMsg>
        )}
        <ButtonWrapper>
          <WideButton onClick={this.handleBackButton} color="red">
            Back
          </WideButton>
          <WideButton
            // onClick={this.handleBackButton}
            type="submit"
            color="purple"
          >
            Create
          </WideButton>
        </ButtonWrapper>
      </form>
    );
  }
}

const ButtonWrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 1fr 1fr;
  margin-top: 25px;
`;

const ErrorMsg = styled.p`
  color: red;
`;
export default EventForm;

EventForm.propTypes = {
  createEvent: PropTypes.func.isRequired
};