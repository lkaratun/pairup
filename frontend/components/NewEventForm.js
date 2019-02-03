import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Router from "next/router";
import axios from "axios";
import Input from "./Input";
import LoginButton from "./LoginButton";
import BackButton from "./BackButton";
import SelectParticipantRange from "./SelectParticipantRange";
// import ActivityPicker from "./ActivityPicker";
// import LocationSearch from "./LocationSearch";
import DateRangePicker from "./DateRangePicker";
import DynamicActivitySearch from "./DynamicActivitySearch";
import config from "../config.json";

const backendUrl = config.BACKEND_URL;

class EventForm extends Component {
  state = {
    name: "",
    description: "",
    activity_id: "",
    place_id: "",
    date_from: "",
    date_to: "",
    min_people: "2",
    max_people: "2",
    valid: true
  };

  handleSubmit = e => {
    e.preventDefault();
    const newEvent = {
      name: this.state.name,
      min_people: this.state.min_people,
      max_people: this.state.max_people,
      activity_id: this.state.activity_id,
      place_id: this.state.place_id,
      description: this.state.description,
      date_from: this.state.date_from,
      date_to: this.state.date_to
    };

    // validation of fields
    const eventArr = Object.keys(newEvent);
    for (let i = 0; i < eventArr.length; i++) {
      // define optional fields here for early return and no validation
      if (eventArr[i] === "valid" || eventArr[i] === "date_from" || eventArr[i] === "date_to") break;
      if (newEvent[eventArr[i]].length === 0) {
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

  updateAttribute = (type, payload, existsInDB) => {
    // determine which type of information is coming [activity, city or country]
    // existsInDB flag is used to determine if that is a brand new attribute coming and needs to be created in DB or it is existing one
    if (type === "activities") {
      console.log(`updating ${type}`);
      console.log(payload);

      if (existsInDB) {
        this.setState({ activity_id: payload.id });
      } else {
        // create new instance of attribute with the ID
        const token = localStorage.getItem("token");
        const AuthStr = `Bearer ${token}`;
        const data = {
          name: payload.name
        };
        axios({
          method: "post",
          url: `${backendUrl}/${type}`,
          data,
          headers: {
            Authorization: AuthStr
          }
        })
          .then(response => {
            console.log(response);
            this.setState({ activity_id: response.data.id });
          })
          .catch(error => console.error(error));
      }
    }
  };

  updateActivity = (type, name, id) => {
    this.setState({ activity: name, activity_id: id });
  };

  updateLocation = (type, name, id) => {
    this.setState({ place_id: id });
  };

  updateParticipantRange = (min, max) => {
    this.setState({ min_people: min, max_people: max });
  };

  updateDateRange = (startDate, endDate) => {
    this.setState({
      date_from: startDate,
      date_to: endDate
    });
  };

  render() {
    // const { places, activities } = this.props;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <Input id="name" name="name" type="text" placeholder="Event Name" handleChange={this.handleInput} required />
          <Input
            id="description"
            name="description"
            type="text"
            placeholder="Description"
            handleChange={this.handleInput}
          />
          <DynamicActivitySearch updateAttribute={this.updateAttribute} type="activities" placeholder="Activity" />
          {/* <ActivityPicker type="form" updateSelection={this.updateActivity} activities={activities} />
          <LocationSearch locations={places} updateSelection={this.updateLocation} /> */}
          <SelectParticipantRange updateParticipantRange={this.updateParticipantRange} />
          <DateRangePicker updateDateRange={this.updateDateRange} />
          {!this.state.valid && <ErrorMsg>Error: Please fill all fields to create an event!</ErrorMsg>}
          <ButtonWrapper>
            <BackButton handleBackButton={this.handleBackButton} />
            <LoginButton title="Create" />
          </ButtonWrapper>
        </form>
      </>
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
  places: PropTypes.arrayOf(PropTypes.object).isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired,
  createEvent: PropTypes.func.isRequired
};
