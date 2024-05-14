import html2canvas from "html2canvas";
import * as pdfMake from "pdfmake/build/pdfmake";
import { jsPDF } from "jspdf";

function getMaxScroll() {
  var limit = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  return limit;
}

function makeLogs(logFunction: any) {
  setInterval(function () {
    logFunction();
  }, 1000);
}

function getTimeStamp() {
  const now = new Date();
  return now.toISOString();
}

function logObject() {
  let temp = {
    logType: "REGULAR",
    timeStamp: getTimeStamp(),
    scrolly: window.scrollY,
    maxScroll: getMaxScroll(),
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
    scrollTop: window.document.documentElement.scrollTop,
    screenContent: "",
    urlDetails: "",
    elements: [],
  };
  return temp;
}

window.addEventListener("scroll", function (event) {
  const logString = { ...logObject(), logType: "EVENT_SCROLL" };
  // console.log("Scroll Log:", logString);
});

makeLogs(function () {
  const [visibleTextContent, elements] = collectVisibleText();
  // const visibleTextContent = textContent;
  const currentURLDetails = window.location;
  const logString = {
    ...logObject(),
    logType: "REGULAR",
    // screenContent: visibleTextContent,
    urlDetails: currentURLDetails,
    elements: elements,
  };
  console.log("regular Log:", logString);
  // saveDataToIndexedDB(JSON.stringify(logString));
  postData({logObject:logString})

});
//------------------------------------------ content save approch ---------------------------------

function isElementInViewport(el: any) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function isVisible(el: any) {
  return !(window.getComputedStyle(el).display === "none");
}

function collectVisibleText() {
  const allElements = document.querySelectorAll("*");
  let visibleText = "";
  let elementArray: { element: any; viewPercentage: number; text: string }[] =
    [];

  allElements.forEach((el: any) => {
    if (
      isElementInViewport(el) &&
      isVisible(el) &&
      el.hasChildNodes() &&
      getVisibleHeightPx(el) !== 0 &&
      el.nodeType === Node.ELEMENT_NODE
    ) {
      elementArray.push({
        element: el,
        viewPercentage: getVisibleHeightPx(el),
        text: el.textContent.trim(),
      });
      visibleText += " " + el.textContent.trim();
    }
  });

  return [visibleText, elementArray];
}
// ---------------------------------- using intersection observer API ---------------------------

// Define the callback function
const observerCallback = (entries: any) => {
  entries.forEach((entry: any) => {
    if (entry.isIntersecting && entry.intersectionRatio === 1) {
      // Element is fully visible in the viewport
      const visibleText: string = entry.target.textContent.trim();
      // console.log("+++++++++++++ Visible text:", visibleText.replace(/\s+/g, ''));
    }
  });
};

// Create the observer
const observer = new IntersectionObserver(observerCallback, {
  root: null, // Use the whole document as the root
  rootMargin: "0px", // No additional margin
  threshold: 1, // Trigger when 100% of the element is visible
});

// Observe the elements you're interested in
const elements = document.querySelectorAll("body *");
elements.forEach((element) => {
  observer.observe(element);
});

// -------------------------------------------- view percentage ----------------------------------

function getVisibleHeightPx(element: any) {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  // Check if the element is not in the viewport
  if (rect.bottom < 0 || rect.top > windowHeight) {
    return 0; // The element is not visible
  }

  // Calculate the visible height of the element
  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(rect.bottom, windowHeight);

  return visibleBottom - visibleTop;
}

// ----------------------------- manage data in file-------------------------------

// function saveDataToIndexedDB(data: any, dbName = "logDB", storeName = "logs") {
//   return new Promise<void>((resolve, reject) => {
//     const request = indexedDB.open(dbName);

//     request.onerror = () => {
//       console.error("Error opening IndexedDB database.");
//       reject();
//     };

//     request.onupgradeneeded = (event: any) => {
//       const db = event.target.result;
//       db.createObjectStore(storeName, { autoIncrement: true });
//     };

//     request.onsuccess = (event: any) => {
//       const db = event.target.result;
//       const transaction = db.transaction([storeName], "readwrite");
//       const objectStore = transaction.objectStore(storeName);
//       const addRequest = objectStore.add(data);

//       addRequest.onsuccess = () => {
//         console.log("Data saved to IndexedDB successfully.");
//         resolve();
//       };

//       addRequest.onerror = () => {
//         console.error("Error saving data to IndexedDB.");
//         reject();
//       };
//     };
//   });
// }

// ---------------------------------------------------------- get active tab -----------------------------------------



async function postData(data: any): Promise<Response> {
  const URL = "http://localhost:5000/"
  try {
    const response = await fetch(URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    console.log('api response:',response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}