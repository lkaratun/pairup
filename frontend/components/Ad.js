import React from "react";
import styled from "styled-components";
import { WideButton } from "./shared/Buttons";

function Ad({ ad }) {
  const { activity = {}, description } = ad;
  return (
    <AdCard>
      <AdTitle>{activity?.name} </AdTitle>
      <p>{description}</p>
      <WideButton>Respond</WideButton>
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

const JoinButton = styled.button`
  margin: auto;
`;

export default Ad;
