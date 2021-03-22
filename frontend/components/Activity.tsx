import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import { WideButton } from "./shared/Buttons";
import { useCookie } from "next-universal-cookie";
import { Activity, ActivityType, NewActivityResponseInput } from "generated-types";
import { gql, useMutation } from "@apollo/client";

function ActivityDisplay({ activity, loading, refetch }: { activity: Activity; loading: boolean; refetch: () => void }) {
  const { activityType = {} as ActivityType, description } = activity;
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);

  const respondMutation = gql`
    mutation createActivityResponse($data: NewActivityResponseInput!) {
      createActivityResponse(data: $data) {
        id
        user {
          id
        }
        activity {
          id
        }
      }
    }
  `;
  const [mutate, mutationResponse] = useMutation(respondMutation);

  async function handleRespond() {
    const response = await mutate({
      variables: { data: { userId: cookies.userId, activityId: activity.id } }
    });

    console.log("🚀 ~ file: Activity.tsx ~ line 37 ~ function ~ response.data", response.data);
    refetch();
    return response.data.user;
  }

  return (
    <ActivityCard>
      <ActivityTitle>{activityType?.name} </ActivityTitle>
      <p>{description}</p>
      {cookies.userId ? (
        activity.responses.length === 0 ? (
          loading ? (
            "Loading"
          ) : (
            <WideButton onClick={handleRespond}>Respond</WideButton>
          )
        ) : (
          "You have already responded to this activity"
        )
      ) : (
        <NotLoggedInMessage>Please log in to respond to activities</NotLoggedInMessage>
      )}
    </ActivityCard>
  );
}

const ActivityCard = styled.div`
  padding: 1em;
  margin: 1em;
  flex-basis: 20%;
  border-radius: 0.05em;
  background: hsla(232, 59%, 50%, 0.05);
  box-shadow: 2px 2px 11px -4px rgba(0, 0, 0, 0.5);
  min-height: 15vh;
`;
const ActivityTitle = styled.h2`
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

export default ActivityDisplay;
