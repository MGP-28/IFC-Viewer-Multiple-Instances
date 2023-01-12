onmessage = async (e) => {
  const modelData = e.data;
  const categories = [];

    // logic here

  postMessage(result);
};

self.addEventListener('unhandledrejection', function (event) {
    // the event object has two special properties:
    // event.promise - the promise that generated the error
    // event.reason  - the unhandled error object
    throw event.reason;
});