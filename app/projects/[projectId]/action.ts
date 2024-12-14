"use server";

import { revalidatePath } from "next/cache";
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { prisma } from "@/app/prisma";
import { getSessionUserId } from "./loader";

const bucketName = process.env.BUCKET_NAME_RAW;
const bucketRegion = process.env.BUCKET_REGION;
const identityPoolId = process.env.IDENTITY_POOL_ID;
const transbucket = process.env.BUCKET_NAME_TRANSFORMED;
const projectsKey = "projects/";

const client = new S3Client({
  region: bucketRegion,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: bucketRegion },
    identityPoolId: identityPoolId as string,
  }),
});

// ユーザー権限の追加
export const addRole = async (projectId: string) => {
  const userId = await getSessionUserId();

  if (!userId) {
    throw new Error("Failed to add role: User ID is null or undefined");
  }

  try {
    await prisma.projectUser.create({
      data: {
        userId,
        projectId,
        role: "VIEWER",
      },
    });

    revalidatePath(`/projects/${projectId}`);
    return null;
  } catch (error) {
    console.error("Error accepting NDA:", error);
    return null;
  }
};

// ファイルの取得
const getFile = async (projectId: string, fileName: string) => {
  const projectUri = projectsKey + projectId + "/";
  const listParams = {
    Bucket: transbucket,
    Prefix: projectUri,
    Delimiter: "/",
  };
  const listVersion = await client.send(new ListObjectsV2Command(listParams));
  const folders = listVersion.CommonPrefixes?.map((prefix) => prefix.Prefix);

  const latestVersion = folders
    ?.map((folder) => folder?.split("/")[2])
    .filter((folder) => !isNaN(Number(folder)))
    .sort((a, b) => Number(b) - Number(a))[0];

  const fileKey = projectUri + latestVersion + "/" + fileName;
  const data = await client.send(
    new ListObjectsV2Command({ Bucket: transbucket, Prefix: fileKey })
  );

  if (data.Contents?.length && data.Contents.length > 0) {
    const href = `https://${transbucket}.s3.${bucketRegion}.amazonaws.com/${fileKey}`;
    return Response.json({ url: href });
  }
};

// ファイルのダウンロード
export const downloadAction = async (projectId: string) => {
  const projectUri = projectsKey + projectId;
  const filesData = await client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: projectUri,
    })
  );

  const filePromises = filesData.Contents?.map(async (file) => {
    const fileData = await client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: file.Key,
      })
    );

    if (fileData.Body) {
      const byteArray = await fileData.Body.transformToByteArray(); // Uint8Array
      return {
        key: file.Key,
        byteArray: byteArray,
        contentType: fileData.ContentType,
      };
    }
  });

  return await Promise.all(filePromises || []);
};

/**
 * Retrieves the list of file names and their sizes for a given project.
 * @param {string} projectId - The ID of the project to fetch files for.
 * @returns {Promise<{ fileName: string, fileSize: number }[]>} - A list of file names and their sizes.
 */
export const getFileListWithSizes = async (projectId: number) => {
  try {
    const projectUri = projectsKey + projectId;
    const listParams = {
      Bucket: bucketName,
      Prefix: projectUri,
    };

    const filesData = await client.send(new ListObjectsV2Command(listParams));

    if (!filesData.Contents || filesData.Contents.length === 0) {
      return [];
    }

    const fileDetails = filesData.Contents.map((file) => ({
      fileName: file.Key?.replace(`${projectUri}/`, ""),
      fileSize: file.Size
        ? (file.Size / (1024 * 1024)).toFixed(2) + " MB"
        : "0 MB",
    })).filter(
      (file) =>
        file.fileName && file.fileName.trim() !== "" && file.fileSize !== "0 MB"
    );

    return fileDetails;
  } catch (error) {
    console.error("Error fetching file list with sizes:", error);
    throw new Error("Failed to fetch file list with sizes.");
  }
};

// Example usage:
// getFileListWithSizes('your-project-id').then(console.log).catch(console.error);
