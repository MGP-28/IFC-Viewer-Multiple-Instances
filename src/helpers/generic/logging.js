function consoleLogObject(obj, message = "") {
  if (message) console.log(message, JSON.stringify(obj));
  else console.log(JSON.stringify(obj));
}

/**
 *
 * @param {Object} logs {title (string), objects (array)}
 */
function multipleLogsWithSeperator(logs) {
  const title = logs.title ? logs.title : "No title";
  console.log("----- START -----");
  console.log(title);
  console.log("-----------------");
  logs.objects.forEach((element) => {
    console.log(element);
  });
  console.log("------ END ------");
}

export { consoleLogObject, multipleLogsWithSeperator };
