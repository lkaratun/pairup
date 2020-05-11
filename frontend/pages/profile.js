import React from "react";
import { serverSideRequest } from "utils/request";
import Profile from "../components/Profile";
import MainLayout from "../components/MainLayout";

export async function getServerSideProps({ req }) {
  const [userData, events] = await Promise.all([
    serverSideRequest(req)({ url: "users" }),
    serverSideRequest(req)({ url: "events" })
  ])
    .then(arr => arr.map(i => i.data))
    .catch(console.log);

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
