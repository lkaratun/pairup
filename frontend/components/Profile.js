import React, { useState, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import axios from "axios";
import ImageUploader from "./ImageUploader";
import { UserContext } from "./UserProvider";
import Event from "./Event";
import BioModal from "./BioModal";
import NameModal from "./NameModal";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

function Profile(props) {
  // const firstName = this.props.
  const [userData, setUserData] = useState({
    lastName: props.lastName,
    email: props.email,
    image: props.image || "../static/no_photo.jpg",
    bio: props.bio
  });
  const [bioEditorOpened, setBioEditorOpened] = useState(false);
  const [nameEditorOpened, setNameEditorOpened] = useState(false);
  const userContext = useContext(UserContext) || {};
  const { firstName, updateUser } = userContext;

  const { lastName, email, image, bio } = userData;

  // const renderEvents = eventsArray =>
  //   eventsArray.map(event => <Event {...event} key={event.id} />);

  // const showBioEditor = () => setBioEditorOpened(true);

  // const hideBioEditor = () => setBioEditorOpened(false);

  const showNameEditor = () => setNameEditorOpened(true);

  // const hideNameEditor = () => setNameEditorOpened(false);

  // const setName = (firstName, lastName) => {
  //   axios
  //     .put(`${backendUrl}/users`, {
  //       first_name: firstName,
  //       last_name: lastName
  //     })
  //     .catch(err => console.error(err.response));
  // };

  return (
    <>
      {firstName ? (
        <GridWrapper>
          <SideBar>
            <ProfileImage src={image} />
            <ImageUploader
              url="/users/images"
              // onCompletion={updateImage}
              style={{ gridColumn: "1 / span 1", gridRow: "2 / span 1" }}
            />
            <PersonalInfo>
              <FirstLastName>
                {firstName} {lastName}
              </FirstLastName>
              <EditButton onClick={showNameEditor}>(edit)</EditButton>
              <br />
              <strong>Email</strong> <br />
              {email}
              <br />
              {bio !== null && bio !== "null" && bio !== "" ? (
                <p>
                  <strong>Bio</strong>
                  <EditButton onClick={() => setBioEditorOpened(true)}>
                    (edit)
                  </EditButton>
                  <br /> {bio}
                </p>
              ) : (
                <p>
                  No bio
                  <EditButton onClick={() => setBioEditorOpened(true)}>
                    (add)
                  </EditButton>
                </p>
              )}
              <BioModal
                showModal={bioEditorOpened}
                hide={() => setBioEditorOpened(false)}
                // confirm={setBio}
              />
              <NameModal
                showModal={nameEditorOpened}
                hide={() => setNameEditorOpened(false)}
                confirm={(newFirstName, newLastName) =>
                  updateUser({ firstName: newFirstName, lastName: newLastName })
                }
              />
            </PersonalInfo>
          </SideBar>

          <MainContent>
            <h2 style={{ marginTop: "0", marginBottom: "0" }}>My events</h2>
            {/* {events} */}
          </MainContent>
        </GridWrapper>
      ) : (
        "Please log in to view this page"
      )}
    </>
  );
}

Profile.contextType = UserContext;

Profile.propTypes = {
  context: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    loggedIn: PropTypes.bool,
    image: PropTypes.string,
    token: PropTypes.string,
    bio: PropTypes.string,
    updateUser: PropTypes.func
  }).isRequired
};

export default Profile;

const FirstLastName = styled.h2`
  display: inline-block;
  margin-right: 0.2em;
`;

const EditButton = styled.button.attrs({ type: "button" })`
  background: none;
  padding: 0;
  border: none;
  cursor: pointer;
  color: navy;
  &:hover {
    text-decoration: underline;
  }
`;
const SideBar = styled.div`
  grid-column: 1 / span 1;
  margin: 2vw 0;
`;
const MainContent = styled.div`
  grid-column: 2 / span 1;
  grid-row: 1 / span 2;
  margin: 2vw;
`;

const Container = styled.div`
  margin: auto;
  width: 70%;
  padding: 3%;
  border: 1px solid grey;
`;

const ProfileImage = styled.img`
  margin: 1%;
  width: 100%;
  height: auto;
`;

const PersonalInfo = styled.div`
  display: block;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr;
  column-gap: 3%;
`;
