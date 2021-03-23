import { gql, useMutation, useQuery } from "@apollo/client";
import { Select, TextArea } from "components/shared/FormElements";
import { Form, Formik } from "formik";
import { ActivityType, Location } from "generated-types";
import React from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { useApollo } from "../lib/ApolloClient";

const getActivityTypesLocationsQuery = gql`
  query getActivityTypes {
    activityTypes {
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

const createActivityTypeMutation = gql`
  mutation createAd($data: NewActivityInput!) {
    createAd(data: $data) {
      id
      description
    }
  }
`;

interface Values {
  activityTypeId: string;
  description: string;
  locationId: string;
}

export default function createActivityTypeForm() {
  const { error, data, loading } = useQuery<{ activityTypes: ActivityType[]; locations: Location[] }>(
    getActivityTypesLocationsQuery
  );
  console.log("🚀 ~ file: createActivityType.tsx ~ line 48 ~ createActivityTypeForm ~ data", data);
  const apolloClient = useApollo();

  const [mutate, mutationResponse] = useMutation(createActivityTypeMutation);

  function createActivityTypeOptions() {
    const options = data?.activityTypes?.map(activityType => (
      <option key={activityType.id} value={activityType.id}>
        {activityType.name}
      </option>
    ));
    options?.unshift(
      <option key="placeholder" value="">
        Choose activityType type
      </option>
    );
    return options;
  }

  function createLocationOptions() {
    const options = data?.locations?.map(location => (
      <option key={location.id} value={location.id}>
        {location.city} ({location.country})
      </option>
    ));
    options?.unshift(
      <option key="placeholder" value="">
        Choose location
      </option>
    );
    return options;
  }

  return (
    <Container>
      <Header>Create your activityType!</Header>
      <Formik
        initialValues={{
          activityTypeId: "",
          description: "New activityType description",
          locationId: "Vancouver"
        }}
        validationSchema={Yup.object({
          activityTypeId: Yup.string().required("Required"),
          description: Yup.string()
            .max(1024, "Must be 1024 characters or less")
            .required("Required"),
          locationId: Yup.string()
            .max(100, "Must be 100 characters or less")
            .required("Required")
        })}
        onSubmit={(values: Values) => {
          // const { activityTypeId, description, locationId } = values;
          console.log("🚀 ~ file: createActivityType.tsx ~ line 96 ~ createActivityTypeForm ~ values", values);
          mutate({ variables: { data: values } });
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2));
          // }, 400);
        }}
      >
        <Form>
          <Select label="Category" name="activityTypeId" placeholder="Select activityType type">
            {createActivityTypeOptions()}
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
