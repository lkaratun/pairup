import React, { useState, useContext } from "react";
import styled from "styled-components";
import ImageUploader from "./ImageUploader";
import { UserContext } from "./UserProvider";
import Event from "./Event";
import BioModal from "./BioModal";
import NameModal from "./NameModal";

function Profile(props) {
  const [currentUser, setCurrentUser] = useState({
    firstName: props.currentUser?.firstName,
    lastName: props.currentUser?.lastName,
    email: props.currentUser?.email,
    image: props.currentUser?.image ?? "../static/no_photo.jpg",
    bio: props.currentUser?.bio
  });
  const [bioEditorOpened, setBioEditorOpened] = useState(false);
  const [nameEditorOpened, setNameEditorOpened] = useState(false);
  const userContext = useContext(UserContext) || {};
  const { firstName, updateUser } = userContext;

  const { lastName, email, image, bio } = currentUser;

  const renderEvents = eventsArray => eventsArray.map(event => <Event {...event} key={event.id} />);

  const showNameEditor = () => setNameEditorOpened(true);

  function renderNameEditModal() {
    return (
      <NameModal
              showModal={nameEditorOpened}
              hide={() => setNameEditorOpened(false)}
              initialLastName={currentUser.lastName}
              confirm={(newFirstName, newLastName) =>
                updateUser({
                  firstName: newFirstName,
                  lastName: newLastName
                }).then(res =>
                  setCurrentUser({
                    ...currentUser,
                    firstName: res.firstName,
                    lastName: res.lastName
                  })
                )
              }
        />
    );
  }

  console.log("🚀 ~ file: Profile.js ~ line 51 ~ Profile ~ firstName", firstName);
  return (
    <Container>
      {firstName ? (
        <GridWrapper>
          <SideBar>
            <ProfileImage src={image} />
            <ImageUploader
              url="/users/images"
              onCompletion={newImage => setCurrentUser({ ...currentUser, image: newImage })}
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
              {bio ? (
                <p>
                  <strong>Bio</strong>
                  <EditButton onClick={() => setBioEditorOpened(true)}>(edit)</EditButton>
                  <br /> {bio}
                </p>
              ) : (
                <p>
                  No bio
                  <EditButton onClick={() => setBioEditorOpened(true)}>(add)</EditButton>
                </p>
              )}
              <BioModal
                showModal={bioEditorOpened}
                hide={() => setBioEditorOpened(false)}
                initialBio={currentUser.bio}
                confirm={newBio =>
                  updateUser({ bio: newBio }).then(res => setCurrentUser({ ...currentUser, bio: res.bio }))
                }
              />
              {renderNameEditModal()}
            </PersonalInfo>
          </SideBar>

          {/* <MainContent>
            <h2 style={{ marginTop: "0", marginBottom: "0" }}>My events</h2>
            {renderEvents(props.events)}
          </MainContent> */}
        </GridWrapper>
      ) : (
        "Please log in to view this page"
      )}
    </Container>
  );
}

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
