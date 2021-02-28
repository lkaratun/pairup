import React, { useState, useContext } from "react";
import Router from "next/router";
import styled from "styled-components";
import axios, { serverSideRequest } from "utils/request";
import Link from "next/link";

import NewEventForm from "../components/NewEventForm";
import mediaWrapper from "../styles/device";
import config from "../config.json";
import { UserContext } from "../components/UserProvider";

const backendUrlFull = config[process.env.NODE_ENV].BACKEND_URL_FULL;

export async function getServerSideProps({ req }) {
  // By default, fetch 5 future events
  console.log("events URL = ", `${backendUrlFull}/events?limit=5`);

  const [activities, locations] = await Promise.all([
    serverSideRequest(req)({ url: `${backendUrlFull}/activities` }),
    serverSideRequest(req)({ url: `${backendUrlFull}/locations` })
  ]).catch(err => console.error(err.response));

  return {
    props: {
      activities: activities.data,
      locations: locations.data
    }
  };
}

function NewEvent(props) {
  const [serverPostFail, setServerPostFail] = useState(false);

  function createEvent(event) {
    axios({
      method: "post",
      url: `${backendUrlFull}/events`,
      data: event
    })
      .then(() => {
        setServerPostFail(false);
        Router.push("/events");
      })
      .catch(error => {
        console.error(error.response);
        setServerPostFail(true);
      });
  }

  const userContext = useContext(UserContext) || {};

  if (!userContext.firstName) {
    return (
      <EventWrapper>
        <InputSection>
          Please <Link href="/login">log in</Link> or <Link href="/register">register</Link> before creating an event
        </InputSection>
      </EventWrapper>
    );
  }

  return (
    <EventWrapper>
      <InputSection>
        <Title>Create New Event</Title>
        <NewEventForm createEvent={createEvent} {...props} />
        {serverPostFail && <p style={{ color: "red" }}>Event creation failed, try again</p>}
      </InputSection>
    </EventWrapper>
  );
}

export default NewEvent;

const EventWrapper = styled.div`
  background: #fafafa;
  padding-top: 100px;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${mediaWrapper.mobileL`
    padding-top: 10px;
    padding-bottom: 10px;
  `}
`;

const InputSection = styled.div`
  background: #fff;
  padding: 20px;
  border: 1px solid #00000021;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${mediaWrapper.mobileL`
    padding: 10px;
    width: 90vw;
    height: 80vh;
  `}
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
`;
