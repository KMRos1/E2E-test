import * as fs from "fs";
import { resourceUsage } from "process";

const defaultHerokuAppNameLocation = "/tmp/e2e.HEROKU_APP_NAME";

type serverEnv = "rc" | "alpha" | "beta" | "gamma";
const acceptedServers = ["rc", "alpha", "beta", "gamma"];
const defaultServer = "rc";

interface UrlConfiguration {
  url: string;
  env: serverEnv;
}

function getFileHerokuAppName(): string {
  const fileContent: string = fs.readFileSync(defaultHerokuAppNameLocation, {
    encoding: "utf8",
    flag: "r",
  });

  if (!fileContent)
    throw new Error(
      `Missing Heroku App Name in file: ${defaultHerokuAppNameLocation}`
    );
  return fileContent;
}

export class UrlConfig {
  static urlConfiguration: UrlConfiguration;
  static set() {
    const herokuAppNameStoredInFile = () =>
      fs.existsSync(defaultHerokuAppNameLocation);
    const herokuAppNameStoredInEnv = () =>
      process.env.HEROKU_APP_NAME && process.env.HEROKU_APP_NAME.length > 1;
    let requestedEnv = "";
    if (herokuAppNameStoredInFile()) {
      requestedEnv = getFileHerokuAppName();
      if (!acceptedServers.includes(requestedEnv)) {
        throw new Error(
          "Wrong server requested. Available servers: " + acceptedServers
        );
      }
    } else if (herokuAppNameStoredInEnv()) {
      requestedEnv = process.env.HEROKU_APP_NAME;
      if (!acceptedServers.includes(requestedEnv)) {
        throw new Error(
          "Wrong server requested. Available servers: " + acceptedServers
        );
      }
    } else {
      requestedEnv = defaultServer;
    }
    this.urlConfiguration = {
      env: requestedEnv as serverEnv,
      url: `https://${requestedEnv}.app.pro.ph.movecloser.dev`,
    };
    return this.urlConfiguration;
  }

  static get() {
    if (this.urlConfiguration) {
      return this.urlConfiguration;
    } else {
      return this.set();
    }
  }
}
