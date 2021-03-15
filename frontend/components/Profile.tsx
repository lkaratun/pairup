import React, { useState, useContext, useCallback } from "react";
import styled from "styled-components";

import { FullUserInfo } from "types/User";
import NameModal from "./NameModal";
import BioModal from "./BioModal";
import { UserInput } from "generated-types";
type updateUserHandler = (userInfo: { firstName?: string; lastName?: string }) => void;

function Profile(props: { currentUser: FullUserInfo; updateUser: updateUserHandler }) {
  const [bioEditorOpened, setBioEditorOpened] = useState(false);
  const [nameEditorOpened, setNameEditorOpened] = useState(false);

  console.log("🚀 ~ file: Profile.js ~ line 10 ~ Profile ~ props.currentUser", props.currentUser);

  const { lastName, email, image, bio, firstName, userId } = props.currentUser;

  const showNameEditor = () => setNameEditorOpened(true);
  const hideNameEditor = () => setNameEditorOpened(false);
  const showBioEditor = () => setBioEditorOpened(true);
  const hideBioEditor = () => setBioEditorOpened(false);

  function  renderAdResponses() {
    return props.currentUser.adResponses.map(response => response.id);
  }

  function renderUserInfo() {
    return (
      <SideBar>
        <ProfileImage src={image} />
        <PersonalInfo>
          <FirstLastName>
            {firstName} {lastName}
          </FirstLastName>
          <EditButton onClick={showNameEditor}>(edit)</EditButton>
          <NameModal
            firstName={firstName}
            lastName={lastName}
            showModal={nameEditorOpened}
            hide={hideNameEditor}
            confirm={(newData: UserInput) => props.updateUser(newData)}
          />
          <br />
          <strong>Email</strong> <br />
          {email}
          <br />
          {bio ? (
            <p>
              <strong>Bio</strong>
              <EditButton onClick={showBioEditor}>(edit)</EditButton>
              <br /> {bio}
            </p>
          ) : (
            <>
              <p>No bio</p>
              <EditButton onClick={showBioEditor}>(add)</EditButton>
            </>
          )}
          <BioModal
            initialBio={bio}
            showModal={bioEditorOpened}
            hide={hideBioEditor}
            confirm={(newData: UserInput) => props.updateUser(newData)}
          />
        </PersonalInfo>
      </SideBar>
    );
  }

  function renderMainContent() {
    return (
      <MainContent>
        <h2 style={{ marginTop: "0", marginBottom: "0" }}>My ads</h2>
      </MainContent>
    );
  }

  return (
    <Container>
      {firstName ? (
        <GridWrapper>
          {renderUserInfo()}
          {renderMainContent()}
          {renderAdResponses()}
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
