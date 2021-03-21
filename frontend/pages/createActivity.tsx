import React, { useState, useContext, useCallback, FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { initializeApollo, useApollo } from "../lib/ApolloClient";
import { useCookie } from "next-universal-cookie";
import styled from "styled-components";
import { UserContext } from "components/UserProvider";
import Input from "../components/Input";
import LoginButton from "../components/LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";
import { Formik, Form, useField } from "formik";
import { TextArea, TextInput, Select } from "components/shared/FormElements";
import * as Yup from "yup";
import { Activity, Location } from "generated-types";

const getActivitiesLocationsQuery = gql`
  query getActivities {
    activities {
      id
      name
    }
    locations {
      id
      country
      city
    }
  }
`;

const createActivityMutation = gql`
  mutation createAd($data: NewAdInput!) {
    createAd(data: $data) {
      id
      description
    }
  }
`;

interface Values {
  activityId: string;
  description: string;
  locationId: string;
}

export default function createActivityForm() {
  const { error, data, loading } = useQuery<{ activities: Activity[], locations: Location[]}>(getActivitiesLocationsQuery);
  console.log("🚀 ~ file: createActivity.tsx ~ line 48 ~ createActivityForm ~ data", data)
  const apolloClient = useApollo();

  const [mutate, mutationResponse] = useMutation(createActivityMutation);

  function createActivityOptions() {
    const options = data?.activities?.map(activity => (
      <option key={activity.id} value={activity.id}>
        {activity.name}
      </option>
    ));
    options?.unshift(<option key="placeholder" value="">Choose activity type</option>);
    return options
  }

  function createLocationOptions() {
    const options = data?.locations?.map(location => (
      <option key={location.id} value={location.id}>
        {location.city} ({location.country})
      </option>
    ));
    options?.unshift(<option key="placeholder" value="">Choose location</option>);
    return options
  }

  return (
    <Container>
      <Header>Create your activity!</Header>
      <Formik
        initialValues={{
          activityId: "",
          description: "New activity description",
          locationId: "Vancouver"
        }}
        validationSchema={Yup.object({
          activityId: Yup.string()
            .required("Required"),
          description: Yup.string()
            .max(1024, "Must be 1024 characters or less")
            .required("Required"),
          locationId: Yup.string()
            .max(100, "Must be 100 characters or less")
            .required("Required")
        })}
        onSubmit={(values: Values) => {
          // const { activityId, description, locationId } = values;
          console.log("🚀 ~ file: createActivity.tsx ~ line 96 ~ createActivityForm ~ values", values)
          mutate({variables: {data: values}});
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          // }, 400);
        }}
      >
        <Form>
          <Select label="Category" name="activityId" placeholder="Select activity type">
            {createActivityOptions()}
          </Select>
          <Select label="Location" name="locationId" placeholder="Select location">
            {createLocationOptions()}
          </Select>

          <TextArea
            label="Description"
            name="description"
            type="text"
            placeholder="The weather is great. Let's get out and toss a frisbee!"
          />

          <button type="submit">Create</button>
        </Form>
      </Formik>
    </Container>
  );
}

const Header = styled.h1`
  margin: 1rem auto;
  flex-basis: 100%;
`;

const Container = styled.div`
  max-width: 80vw;
  margin: 50px auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
`;
