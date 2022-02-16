const { appendFileSync, existsSync, mkdirSync } = require("fs");
const moment = require("moment");

module.exports = (toLog) => {
  const data = moment(Date.now()).format("LLL");

  if (!existsSync("./logs")) mkdirSync("./logs");
  console.log(!existsSync("./logs"))
  appendFileSync("./logs/logs.txt", `[${data} - Logs] ${toLog}\n`);
  return;
};
