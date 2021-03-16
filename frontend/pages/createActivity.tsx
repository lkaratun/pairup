import React, { useState, useContext, useCallback, FunctionComponent } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";
import { useCookie } from "next-universal-cookie";
import styled from "styled-components";
import { UserContext } from "components/UserProvider";
import Input from "../components/Input";
import LoginButton from "../components/LoginButton";
import StyledErrorMsg from "../styles/StyledErrorMsg";
import config from "../config.json";
import { Formik, Form, useField } from "formik";
import { TextInput  } from 'components/shared/FormElements';
import * as Yup from "yup";

interface Values {
  activityType: string;
  description: string;
  location: string;
}

export default function SignupForm() {
  return (
    <>
      <h1>Subscribe!</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          acceptedTerms: false, // added for our checkbox
          jobType: "" // added for our select
        }}
        validationSchema={Yup.object({
          activityType: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          description: Yup.string()
            .max(20, "Must be 20 characters or less")
            .required("Required"),
          location: Yup.string()
            .email("Invalid email address")
            .required("Required")
        })}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 400);
        }}
      >
        <Form>
          <TextInput
            label="Activity type"
            name="activityType"
            type="text"
            placeholder="Frisbee? Bike ride? anything you want"
          />

          <TextInput
            label="Description"
            name="description"
            type="text"
            placeholder="The weather is great. Let's get out and toss a frisbee!"
          />

          <TextInput label="Location" name="location" type="text" placeholder="Vancouver" />

          <button type="submit">Create</button>
        </Form>
      </Formik>
    </>
  );
}
