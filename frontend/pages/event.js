import React from "react";
import axios from "utils/request";
import EventPage from "../components/EventPage";
import config from "../config.json";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

export async function getServerSideProps({ query }) {
  const [eventDetails, attendees] = await Promise.all([
    axios({
      url: `${backendUrlFull}/events/${query.id}`
    }),
    axios({
      url: `${backendUrlFull}/events/${query.id}/attendees`
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
