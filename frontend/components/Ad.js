import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "components/UserProvider";
import { WideButton } from "./shared/Buttons";

function Ad({ ad }) {
  const { activity = {}, description } = ad;
  const user = useContext(UserContext);
  console.log("🚀 ~ file: Ad.js ~ line 9 ~ Ad ~ user", user);
  return (
    <AdCard>
      <AdTitle>{activity?.name} </AdTitle>
      <p>{description}</p>
      {user.userId ? (
        <WideButton>Respond</WideButton>
      ) : (
        <NotLoggedInMessage>Please log in to respond to ads</NotLoggedInMessage>
      )}
    </AdCard>
  );
}

const AdCard = styled.div`
  padding: 1em;
  margin: 1em;
  flex-basis: 20%;
  border-radius: 0.05em;
  background: hsla(232, 59%, 50%, 0.05);
  box-shadow: 2px 2px 11px -4px rgba(0, 0, 0, 0.5);
  min-height: 15vh;
`;
const AdTitle = styled.h2`
  font-size: 1.4em;
  margin: 0.5em 0;
  cursor: pointer;
  color: hsla(0, 0%, 30%, 1);
  &:hover {
    color: hsla(0, 0%, 0%, 1);
    text-decoration: underline;
  }
`;

const NotLoggedInMessage = styled.div`
  color: hsla(0, 0%, 0%, 0.5);
`;

export default Ad;
