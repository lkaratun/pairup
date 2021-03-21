import React, { Component } from "react";
import styled from "styled-components";
import Link from "next/link";
import dynamic from "next/dynamic";
import axios, { serverSideRequest } from "utils/request";

import EventList from "../components/EventList";
import mediaWrapper from "../styles/mediaWrapper";
import config from "../config.json";

import { ColoredButton } from "../components/shared/Buttons";
import DynamicLocationSearch from "../components/DynamicLocationSearch";
import DynamicActivityTypeSearch from "../components/DynamicActivityTypeSearch";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

const DateSelectorDynamic = dynamic(() => import("../components/DateSelector"), {
  ssr: false
});

export async function getServerSideProps({ req }) {
  const temp = await serverSideRequest(req)({
    data: {
      query: `query activityTypes {
        activityTypes {
          id
          name
        }
      }`
    }
  })
    .then(res => res.data.data)
    .catch(err => console.error(err.response.data));
  console.log("getServerSideProps -> temp", temp);

  const { activityTypes } = temp;

  return {
    props: {
      activityTypes
    }
  };
}

class Dashboard extends Component {
  state = {
    filters: { dateFrom: null, city: null, activitytype: null },
    events: this.props.events || [],
    offset: 0,
    cleared: null,
    screenWidth: null
  };

  async componentDidMount() {
    // determine if user is on mobile (required for data picker component)
    const screenWidth = window.innerWidth;
    this.setState({ screenWidth });
  }

  updateDate = date => {
    console.log("Dashboard -> date", date);
    const oldState = { ...this.state };
    const oldFilters = oldState.filters;
    oldFilters["dateFrom"] = date;
    this.setState({ filters: oldFilters, cleared: false });
  };

  updateActivityType = data => {
    const oldState = { ...this.state };
    const oldFilters = oldState.filters;
    oldFilters["activitytype"] = data.name;
    // updated the cleared state and filters
    this.setState({ filters: oldFilters, cleared: false });
  };

  updateLocation = data => {
    const oldState = { ...this.state };
    const oldFilters = oldState.filters;
    oldFilters["city"] = data.city;
    this.setState({ filters: oldFilters, cleared: false });
  };

  clearFilters = () => {
    this.setState({
      filters: { dateFrom: null, city: null, activitytype: null },
      cleared: true
    });
  };

  loadMoreEvents = async () => {
    const { offset } = this.state;
    const newOffset = offset + 5;
    const newEvents = await axios({
      url: `${backendUrlFull}/events?timestamp=${Date.now()}&limit=5&offset=${newOffset}`
    });
    console.log("More events URL = ", `${backendUrlFull}/events?&limit=5&offset=${newOffset}`);

    console.log("Dashboard -> loadMoreEvents -> events", this.state.events);
    console.log("Dashboard -> loadMoreEvents -> newEvents.data", newEvents);
    this.setState(prevState => ({
      events: [...prevState.events, ...newEvents.data],
      offset: newOffset
    }));
  };

  render() {
    const { events, filters, cleared, screenWidth } = this.state;
    const mobile = screenWidth && screenWidth < 415;
    return (
      <>
        <TopPanel>
          <div>
            <h4>
              <Link href="/newevent">
                <StyledButton>Create</StyledButton>
              </Link>
              new PairUp
              <br />
              or check out existing events below
            </h4>
          </div>
        </TopPanel>
        <Divider>
          <h4>
            <span>Active Events</span>
          </h4>
        </Divider>
        <FilterControlPanel>
          {/* <DynamicActivityTypeSearch
            // placeholder="ActivityType"
            allowNew={false}
            updateActivityType={this.updateActivityType}
            cleared={cleared}
            activityTypes={this.props.activityTypes}
          />
          <DynamicLocationSearch
            placeholder="City"
            updateLocation={this.updateLocation}
            allowNew={false}
            cleared={cleared}
            locations={this.props.locations}
          /> */}
          <DateSelectorDynamic placeholder="date" updateSelection={this.updateDate} cleared={cleared} mobile={mobile} />
          <ColoredButton type="button" onClick={this.clearFilters} color="gray">
            Clear
          </ColoredButton>
        </FilterControlPanel>
        {events?.length && (
          <EventContainer>
            <EventList events={events} filters={filters} loadMoreEvents={this.loadMoreEvents} />
          </EventContainer>
        )}
      </>
    );
  }
}

export default Dashboard;

const TopPanel = styled.div`
  padding-left: 100px;
  padding-right: 100px;
  padding-top: 50px;
  padding-bottom: 50px;
  background: rgb(22, 67, 75);
  background: linear-gradient(90deg, rgba(22, 67, 75, 1) 0%, rgba(28, 12, 91, 1) 100%);
  color: white;
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  font-size: 1.3rem;
  height: 20vh;

  ${mediaWrapper.mobileL`
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
  `}

  h4 {
    line-height: 2.3rem;

    ${mediaWrapper.mobileL`
      line-height: 2.0rem;
      font-size: 1.0rem;
  `}
  }
`;

const DownArrow = styled.img`
  width: 70px;

  ${mediaWrapper.mobileL`
      width: 40px;
  `}
`;

const StyledButton = styled.a`
  border: 1px solid white;
  border-radius: 2px;
  padding: 4px;
  margin-right: 0.5em;
  cursor: pointer;
  &:hover {
    color: gold;
  }
`;

const Divider = styled.div`
  margin-top: 25px;
  margin-bottom: 25px;
  margin-left: auto;
  margin-right: auto;
  width: 80vw;
  text-align: center;
  h4 {
    text-align: center;
    width: 100%;
    border-bottom: 3px solid purple;
    line-height: 0.1em;
    margin: 10px 0 20px;
  }

  span {
    background: #fff;
    padding: 0 10px;
  }
`;

const FilterControlPanel = styled.div`
  justify-content: center;
  padding: 10px;
  background-color: #8bc6ec;
  background-image: linear-gradient(135deg, #8bc6ec 0%, #9599e2 100%);
  display: grid;
  grid-template-columns: 160px 160px 150px 50px;
  width: auto;
  grid-gap: 10px;
  border-radius: 4px;
  margin-bottom: 50px;

  ${mediaWrapper.mobileL`
    grid-gap: 3px;
    grid-template-columns: 1fr 1fr 80px auto;
    margin-bottom: 5px;
  `}
`;

const EventContainer = styled.div`
  width: 60%;
  margin: auto;
  text-align: center;

  ${mediaWrapper.mobileL`
    width: 90%;
  `}
`;
