const { writeFile } = require("fs");
const { argv } = require("yargs");

// read environment variables from .env file
require("dotenv").config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === "prod";

const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   CLIENT_ID: "${process.env.CLIENT_ID}",
   CLIENT_SECRET: "${process.env.CLIENT_SECRET}",
   REDIRECT_URI: "${process.env.REDIRECT_URI}"
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err: Error) => {
  if (err) {
    console.log(err);
  }

  console.log(`Wrote variables to ${targetPath}`);
});
