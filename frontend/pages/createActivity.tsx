import React, { useState, useContext, useCallback, FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import { useCookie } from "next-universal-cookie";
import styled from "styled-components";
import { UserContext } from "components/UserProvider";
import Input from "../components/Input";
import LoginButton from "../components/LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";
import { Formik, Form, useField } from "formik";
import { TextArea, TextInput, DataList } from "components/shared/FormElements";
import * as Yup from "yup";
import { map } from "lodash";

const getActivitiesQuery = gql`
  query getActivities {
    activities {
      id
      name
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
  activityType: string;
  description: string;
  location: string;
}

export default function createActivityForm() {
  const { error, data, loading, refetch } = useQuery(getActivitiesQuery);
  console.log("🚀 ~ file: createActivity.tsx ~ line 43 ~ createActivityForm ~ data", data)
  
  const [mutate, mutationResponse] = useMutation(createActivityMutation);

  function createActivityOptions() {
    console.log("🚀 ~ file: createActivity.tsx ~ line 54 ~ createActivityOptions ~ data?", data);
    return data?.activities?.map(activity => <option key={activity.id} value={activity.name} />);
  }

  return (
    <Container>
      <Header>Create your activity!</Header>
      <Formik
        initialValues={{
          activityType: "",
          description: "New activity description",
          location: "Vancouver"
        }}
        validationSchema={Yup.object({
          activityType: Yup.string()
            .max(100, "Must be 100 characters or less")
            .required("Required"),
          description: Yup.string()
            .max(1024, "Must be 1024 characters or less")
            .required("Required"),
          location: Yup.string()
            .max(100, "Must be 100 characters or less")
            .required("Required")
        })}
        onSubmit={(values) => {
          

          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
          }, 400);
        }}
      >
        <Form>
          <DataList label="Category" name="activityType" placeholder="Select activity type">
            {createActivityOptions()}
          </DataList>

          <TextInput label="Location" name="location" type="text" placeholder="Vancouver" />

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
