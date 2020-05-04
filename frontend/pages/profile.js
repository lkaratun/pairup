import React from "react";
import axios from "axios";
import Profile from "../components/Profile";
import MainLayout from "../components/MainLayout";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

export async function getServerSideProps({ req }) {
  const [userData, events] = await Promise.all([
    axios({
      url: `http:${backendUrl}/users`,
      headers: { cookie: req?.headers?.cookie || "" }
    }).then(res => res.data),
    axios({
      url: `http:${backendUrl}/events`,
      headers: { cookie: req?.headers?.cookie || "" }
    }).then(res => res.data.events)
  ]);

  return { props: { userData, events } };
}

function ProfilePage(props) {
  return (
    <MainLayout>
      <Profile {...props} />
    </MainLayout>
  );
}

export default ProfilePage;
