onmessage = async (e) => {
  const references = {
    modelRef: undefined,
    levelRef: undefined,
    categoryRef: undefined,
  };

  const leafNodes = e.data;
  const categories = {};

  // logic here
  //



  //
  //////

  postMessage("nice");
};

self.addEventListener("unhandledrejection", function (event) {
  // the event object has two special properties:
  // event.promise - the promise that generated the error
  // event.reason  - the unhandled error object
  throw event.reason;
});
