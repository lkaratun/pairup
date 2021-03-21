import React from "react";
import { isBefore, isAfter } from "date-fns";
import PropTypes from "prop-types";
import styled from "styled-components";
import Event from "./Event";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import { ColoredButton } from "./shared/Buttons";

function filterEvents(events, filters) {
  function compareEventAndFilter(event, filtersObject) {
    let everyFilterMatching = true;
    Object.keys(filtersObject).forEach(filter => {
      if (filter === "dateFrom") {
        if (filters[filter] !== null) {
          const filterDate = new Date(filters.dateFrom);
          const eventFrom = new Date(event.dateFrom);
          const eventTo = new Date(event.dateTo);
          if (isAfter(eventFrom, filterDate) || isBefore(eventTo, filterDate)) {
            everyFilterMatching = false;
          }
        }
      } else if (filter === "activityType") {
        if (filters[filter] !== null) {
          const filterValue = filters[filter].toLowerCase();
          const eventValue = event[filter].toLowerCase();
          if (filterValue !== eventValue) {
            everyFilterMatching = false;
          }
        }
      } else if (filter === "city") {
        if (filters[filter] !== null && event[filter] !== null) {
          const filterValue = filters[filter].toLowerCase();
          const eventValue = event[filter].toLowerCase();
          if (filterValue !== eventValue) {
            everyFilterMatching = false;
          }
        }
      }
    });
    return everyFilterMatching;
  }

  const filteredEvents = events.filter(event =>
    compareEventAndFilter(event, filters)
  );
  return filteredEvents;
}

const makeEventsDomElements = events =>
  events.map(event => <Event {...event} key={event.id} />);

const EventList = props => {
  const { filters, events } = props;
  const eventsToShow = makeEventsDomElements(filterEvents(events, filters));
  if (eventsToShow.length === 0)
    return <StyledErrorMsg>No events found</StyledErrorMsg>;
  return (
    <>
      <StyledList>{eventsToShow}</StyledList>
      <ColoredButton color="neutral" onClick={props.loadMoreEvents}>
        Load More
      </ColoredButton>
    </>
  );
};

export default EventList;

EventList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.shape({
    dateFrom: PropTypes.string,
    city: PropTypes.string,
    activityType: PropTypes.string
  }).isRequired,
  loadMoreEvents: PropTypes.func.isRequired
};

const StyledList = styled.div`
  text-align: left;
`;
