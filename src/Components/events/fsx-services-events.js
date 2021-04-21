import fsx from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fsx;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../db"
);

export const getEvents = async () =>
  await readJSON(join(dataFolderPath, "events.json"));

export const writeEvents = async (content) =>
  await writeJSON(join(dataFolderPath, "events.json"), content);
