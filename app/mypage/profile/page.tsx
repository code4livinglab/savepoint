import { loader, similarProjectsLoader } from "./loader";

const ProjectDetailsPage = async () => {
  // console.log(similarProjects);
  const userInfo = await loader();
  // console.log(userInfo);
  return (
    <>
      <div>{userInfo.id}</div>
      <div>{userInfo.name}</div>
      <div>{userInfo.email}</div>
    </>
  );
};

export default ProjectDetailsPage;
