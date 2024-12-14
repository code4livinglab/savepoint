"use client";
import React, { useEffect, useState } from "react";
import { Link as MUILink, Paper, Stack, Typography } from "@mui/material";
import { Project } from "@/app/_types/project";
import { DownloadButton } from "./DownloadButton";
import { MarkdownViewer } from "./MarkdownViewer";
import { CloseButton } from "../../_components/CloseButton";
import { getFileListWithSizes } from "../action";
import Link from "next/link";

export const ProjectDetails = ({ project }: { project: Project }) => {
  const [fileList, setFileList] = useState<
    { fileName: string; fileSize: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileList = async () => {
      try {
        const files = await getFileListWithSizes(project.id);
        const safeFiles = files.filter(
          (file): file is { fileName: string; fileSize: number } =>
            file.fileName !== undefined && file.fileSize !== undefined
        );
        setFileList(safeFiles);
      } catch (error) {
        console.error("Error fetching file list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFileList();
  }, [project.id]);

  return (
    <Paper
      elevation={3}
      sx={{ width: 480, height: 720, margin: 3, padding: 2 }}
      className="absolute bottom-0 left-0 overflow-auto"
    >
      <Stack spacing={2}>
        <MarkdownViewer project={project} />

        <Typography variant="caption" sx={{ width: "100%" }}>
          <MUILink
            component={Link}
            href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja"
            sx={{ color: "info.main" }}
          >
            &nbsp;CC BY-SA 4.0&nbsp;
          </MUILink>
          のライセンスに基づいて公開
          <img
            className="inline-block h-4 mx-1"
            src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
            alt=""
          />
          <img
            className="inline-block h-4 mx-1"
            src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
            alt=""
          />
          <img
            className="inline-block h-4 mx-1"
            src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
            alt=""
          />
        </Typography>
        {loading ? (
          <Typography variant="body2">Loading files...</Typography>
        ) : fileList.length > 0 ? (
          <>
            <Typography variant="h6">File List</Typography>
            <Stack spacing={1}>
              {fileList.map((file, index) => (
                <Typography key={index} variant="body2">
                  ・{file.fileName} - {file.fileSize}
                </Typography>
              ))}
            </Stack>
          </>
        ) : (
          <Typography variant="body2">No files available.</Typography>
        )}
        <DownloadButton projectId={project.id} />
        <CloseButton />
      </Stack>
    </Paper>
  );
};
