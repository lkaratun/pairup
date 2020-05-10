import React, { useState, useContext } from "react";
import axios from "utils/request";
import styled from "styled-components";
import { format } from "date-fns";
import { withRouter } from "next/router";
import { UserContext } from "components/UserProvider";
import MainLayout from "./MainLayout";
import Attendees from "./Attendees";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

function isUserAttending(userId, attendees) {
  console.log("isUserAttending -> attendees", attendees);
  console.log("isUserAttending -> userId", userId);
  const attendeesIds = attendees.map(att => att.id);
  return attendeesIds.includes(userId);
}

function EventPage(props) {
  const {
    name,
    description,
    country,
    city,
    authorId,
    dateFrom,
    dateTo,
    maxPeople
  } = props;

  if (!name)
    return (
      <MainLayout>
        <Container>
          <EventCard>
            <Name>Event not found</Name>
          </EventCard>
        </Container>
      </MainLayout>
    );

  const [attendees, setAttendees] = useState(props.attendees);
  const [modalIsVisible, setModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    props.image || "../static/stock-event.jpg"
  );
  const user = useContext(UserContext);
  console.log("EventPage -> user", user);
  const userId = user.id;
  console.log("EventPage -> userId", userId);

  const [userIsAttending, setUserIsAttending] = useState(
    isUserAttending(userId, attendees)
  );

  const deleteEvent = () => {
    const { router } = props;
    axios({
      url: `http:${backendUrl}/events/${router.query.id}`,
      method: "delete"
    })
      .then(router.push("/events"))
      .catch(error => console.error(error.response));
  };

  const updateAttendees = async () => {
    const { router } = props;
    const newAttendees = await axios({
      url: `${backendUrl}/events/${router.query.id}/attendees`
    });
    setAttendees(newAttendees.data);
  };

  const joinEvent = () => {
    const { router } = props;
    axios({
      method: "post",
      url: `http:${backendUrl}/events/${router.query.id}/attend`
    })
      .then(async () => {
        await setUserIsAttending(true);
        updateAttendees();
      })
      .catch(error => console.log(error.response));
  };

  const leaveEvent = () => {
    const { router } = props;
    axios({
      url: `http:${backendUrl}/events/${router.query.id}/attend`,
      method: "delete"
    })
      .then(async () => {
        await updateAttendees();
        setUserIsAttending(false);
      })
      .catch(error => console.log(error));
  };

  // const { router } = props;

  const spotsLeft = maxPeople - attendees.length;

  return (
    <MainLayout>
      <Container>
        <EventCard>
          <Name>{name}</Name>
          <InfoWrapper>
            <InfoPanel>
              <Description>
                <Title>Description</Title>
                <SubTitle>{description}</SubTitle>
              </Description>
              <div>
                <Title>Location: </Title>
                {city ? (
                  <SubTitle>
                    {city}, {country}
                  </SubTitle>
                ) : (
                  <SubTitle>not set</SubTitle>
                )}
              </div>
              <div>
                <Title>Starts: </Title>
                <SubTitle>{format(dateFrom, "MMMM DD, YYYY")}</SubTitle>
              </div>
              <div>
                <Title>Ends: </Title>
                <SubTitle>{format(dateTo, "MMMM DD, YYYY")}</SubTitle>
              </div>
            </InfoPanel>
            <div>
              <EventImage src={imageUrl} alt="people in a group" />
              {userId === authorId && (
                <ImageUploader
                  url={`/events/${props.router.query.id}/images`}
                  onCompletion={setImageUrl}
                />
              )}
            </div>
          </InfoWrapper>
          <Attendees attendees={attendees} />
          <JoinPanel>
            <AvailableSpotsLeftNotice
              spotsLeft={spotsLeft}
              maxPeople={maxPeople}
            />
            <ControlledAttendanceButtons
              userId={userId}
              authorId={authorId}
              userIsAttending={userIsAttending}
              leaveEvent={leaveEvent}
              joinEvent={joinEvent}
              eventIsFull={spotsLeft === 0}
            />
          </JoinPanel>
          <ControlButtons>
            {Number(userId) === Number(authorId) && (
              <DeleteButton onClick={() => setModalVisible(true)}>
                Delete
              </DeleteButton>
            )}
          </ControlButtons>
          <Modal
            showModal={modalIsVisible}
            hide={() => setModalVisible(false)}
            confirm={deleteEvent}
          />
        </EventCard>
      </Container>
    </MainLayout>
  );
}

function AvailableSpotsLeftNotice({ spotsLeft, maxPeople }) {
  if (maxPeople === null) {
    return null;
  }
  if (spotsLeft === 0) {
    return <h4>Event is full</h4>;
  }
  return <h4>{spotsLeft} spot(s) left</h4>;
}

function ControlledAttendanceButtons({
  userId,
  authorId,
  userIsAttending,
  leaveEvent,
  joinEvent,
  eventIsFull
}) {
  const userIsOwner = userId === authorId;
  if (userIsOwner) {
    return null;
  }
  if (eventIsFull && !userIsAttending) {
    return null;
  }
  if (userIsAttending) {
    return <LeaveButton onClick={leaveEvent}>Leave</LeaveButton>;
  }
  if (!userIsAttending) {
    return <JoinButton onClick={joinEvent}>Join</JoinButton>;
  }
}

const Container = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const EventCard = styled.div`
  min-height: 20vh;
  padding: 2em;
  margin: 0.5em 0;
  border-radius: 0.25em;
  background: hsla(232, 59%, 50%, 0.05);
  box-shadow: 2px 2px 11px -4px rgba(0, 0, 0, 0.3);
`;

const InfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 350px;
  grid-gap: 30px;
`;

const InfoPanel = styled.div`
  border: 1px solid grey;
  text-align: left;
  padding: 10px;
  border-radius: 10px;
`;

const EventImage = styled.img`
  width: 100%;
  border-radius: 10px;
`;

const Title = styled.p`
  font-size: 1em;
  font-weight: 700;
  margin: 0;
`;

const SubTitle = styled.p`
  font-size: 1em;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
`;

const Name = styled.div`
  text-transform: capitalize;
  font-size: 3rem;
  margin-bottom: 25px;
`;
const Description = styled.div`
  border-bottom: 1px dotted #1b115a;
  margin-bottom: 5px;
`;

const JoinPanel = styled.div`
  padding: 10px;
  margin-top: 50px;
`;

const JoinButton = styled.button`
  font-size: 1.4rem;
  padding: 4px;
  cursor: pointer;
  outline: 0;
  margin: 0;
  color: white;
  border: 0;
  background: #1d740d;
  border-radius: 3px;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
`;
const LeaveButton = styled.button`
  font-size: 1.4rem;
  padding: 4px;
  cursor: pointer;
  outline: 0;
  margin: 0;
  color: white;
  border: 0;
  background: #1da1f2;
  border-radius: 3px;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
`;

const ControlButtons = styled.div`
  text-align: right;
`;

const DeleteButton = styled.button`
  font-size: 1.4rem;
  padding: 4px;
  cursor: pointer;
  outline: 0;
  margin: 0;
  color: white;
  border: 0;
  background: #ea4335;
  border-radius: 3px;
  padding-left: 10px;
  padding-right: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
  margin-left: 10px;
`;

export default withRouter(EventPage);
