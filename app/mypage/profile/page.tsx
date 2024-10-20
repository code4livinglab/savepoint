import { userInfoLoader } from "./loader";
import UserProfile from "./_component/profile";

const ProjectDetailsPage = async () => {
  const userInfo = await userInfoLoader();
  return (
    <>
      <UserProfile profile={userInfo}></UserProfile>
    </>
  );
};

export default ProjectDetailsPage;
