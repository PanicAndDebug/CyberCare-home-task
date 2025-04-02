import fs from "fs";

export default async () => {
  const userDataDir = "./playwright_data";

  if (fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
};
