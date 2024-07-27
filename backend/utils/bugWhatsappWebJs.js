const fs = require("fs").promises;
const path = require("path");

const BASE_PATH = ".wwebjs_auth";

async function cleanDirectory(sessionDir = "session", excludeDir = "Default") {
  const fullPath = path.join(BASE_PATH, sessionDir); // Collect the full path
  try {
    console.warn(`Clearing the directory before launching: ${fullPath}`);
    const items = await fs.readdir(fullPath);
    for (const item of items) {
      const itemPath = path.join(fullPath, item);
      const stats = await fs.lstat(itemPath);
      if (stats.isDirectory()) {
        if (item !== excludeDir) {
          await fs.rm(itemPath, { recursive: true, force: true });
        }
      } else {
        await fs.unlink(itemPath);
      }
    }
  } catch (error) {
    console.log(`Error when clearing a directory: ${error.message}`);
  }
}
module.exports = { cleanDirectory };
