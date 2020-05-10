import React from "react";
import axios from "utils/request";
import EventPage from "../components/EventPage";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

export async function getServerSideProps({ query }) {
  const [eventDetails, attendees] = await Promise.all([
    axios({
      url: `http:${backendUrl}/events/${query.id}`
    }),
    axios({
      url: `http:${backendUrl}/events/${query.id}/attendees`
    })
  ]).catch(() => [{ data: {} }, { data: {} }]);

  return {
    props: {
      ...eventDetails.data,
      attendees: attendees.data
    }
  };
}

export default function event(props) {
  return <EventPage {...props} />;
}
