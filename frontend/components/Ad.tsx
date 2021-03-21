import React, { useCallback, useContext } from "react";
import styled from "styled-components";
import { WideButton } from "./shared/Buttons";
import { useCookie } from "next-universal-cookie";
import { Ad as AdType, NewAdResponseInput } from "generated-types";
import { gql, useMutation } from "@apollo/client";

function Ad({ ad, loading, refetch }: { ad: AdType; loading: boolean; refetch: () => void }) {
  const { activitytype = {}, description } = ad;
  const [cookies, setCookie, removeCookie] = useCookie(["firstName", "userId"]);

  const respondMutation = gql`
    mutation createAdResponse($data: NewAdResponseInput!) {
      createAdResponse(data: $data) {
        id
        user {
          id
        }
        ad {
          id
        }
      }
    }
  `;
  const [mutate, mutationResponse] = useMutation(respondMutation);

  async function handleRespond() {
    const response = await mutate({
      variables: { data: { userId: cookies.userId, adId: ad.id } }
    });

    console.log("🚀 ~ file: Ad.tsx ~ line 37 ~ function ~ response.data", response.data);
    refetch();
    return response.data.user;
  }

  return (
    <AdCard>
      <AdTitle>{activitytype?.name} </AdTitle>
      <p>{description}</p>
      {cookies.userId ? (
        ad.responses.length === 0 ? (
          loading ? (
            "Loading"
          ) : (
            <WideButton onClick={handleRespond}>Respond</WideButton>
          )
        ) : (
          "You have already responded to this ad"
        )
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
