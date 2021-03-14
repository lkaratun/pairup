import React, { useState, useContext, useCallback } from "react";
import styled from "styled-components";
import { useCookie } from "next-universal-cookie";
import { gql, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";

import { BasicUserInfo, FullUserInfo } from "types/User";
import NameModal from "./NameModal";
import BioModal from "./BioModal";
// import { Ad } from "../../backend/src/generated/graphql";
type read = (name: string) => void;
type updateUserHandler = (userInfo: { firstName?: string; lastName?: string }) => void;

function Profile(props: { currentUser: FullUserInfo; updateUser: updateUserHandler }) {
  const [bioEditorOpened, setBioEditorOpened] = useState(false);
  const [nameEditorOpened, setNameEditorOpened] = useState(false);
  // const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);

  console.log("🚀 ~ file: Profile.js ~ line 10 ~ Profile ~ props.currentUser", props.currentUser);
  // console.log("🚀 ~ file: Profile.js ~ line 14 ~ Profile ~ cookies", cookies);

  const { lastName, email, image, bio, firstName, userId } = props.currentUser;

  const showNameEditor = () => setNameEditorOpened(true);
  const hideNameEditor = () => setNameEditorOpened(false);
  const showBioEditor = () => setBioEditorOpened(true);
  const hideBioEditor = () => setBioEditorOpened(false);

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
            confirm={newData => props.updateUser(newData)}
          />
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
            <>
              <p>No bio</p>
              <EditButton onClick={() => setBioEditorOpened(true)}>(add)</EditButton>
            </>
          )}
          <BioModal
            initialBio={bio}
            showModal={bioEditorOpened}
            hide={hideBioEditor}
            confirm={newData => props.updateUser(newData)}
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
      {firstName ? <GridWrapper>{renderUserInfo()}</GridWrapper> : "Please log in to view this page"}
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
