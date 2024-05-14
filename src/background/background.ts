console.log("hello from background.ts")

// function getCurrentTab(): Promise<chrome.tabs.Tab> {
//     return new Promise((resolve, reject) => {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         if (tabs.length === 0) {
//           reject('No active tab found');
//         } else {
//           resolve(tabs[0]);
//         }
//       });
//     });
//   }
  
//   function isTabActive(tab: chrome.tabs.Tab): boolean {
//     return tab.active === true;
//   }

//   getCurrentTab()
//   .then((tab) => {
//     if (isTabActive(tab)) {
//       console.log('The current tab is activated');
//       // Do something with the activated tab
//     } else {
//       console.log('The current tab is not activated');
//     }
//   })
//   .catch((error) => {
//     console.error('Error getting the current tab:', error);
//   });