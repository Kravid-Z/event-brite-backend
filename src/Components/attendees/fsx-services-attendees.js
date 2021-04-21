import fsx from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fsx;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../db"
);

export const getAttendees = async () =>
  await readJSON(join(dataFolderPath, "attendees.json"));

export const writeAttendees = async (content) =>
  await writeJSON(join(dataFolderPath, "attendees.json"), content);
