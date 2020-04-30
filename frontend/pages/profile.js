import React from "react";
import cookie from "cookie";
import axios from "axios";
import Profile from "../components/Profile";
import MainLayout from "../components/MainLayout";
import config from "../config.json";

const backendUrl = config[process.env.NODE_ENV].BACKEND_URL;

export async function getServerSideProps({ req }) {
  console.log(
    "In profile page -> getServerSideProps, cookies = ",
    cookie.parse(req?.headers?.cookie)
  );

  console.log("request URL = ", `http:${backendUrl}/auth/view`);

  const response = await axios({
    url: `http:${backendUrl}/auth/view`,
    headers: { cookie: req?.headers?.cookie }
  });
  console.log("response = ", response.data);

  return { props: {} };
}

function ProfilePage(props) {
  return (
    <MainLayout>
      <Profile />
    </MainLayout>
  );
}

export default ProfilePage;
