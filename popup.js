// popup.js

document.addEventListener('DOMContentLoaded', function() {
  // Create a container div for your extension content
  // var extensionContainer = document.createElement('div');
  //  extensionContainer.innerHTML = '<div style="width: 10%;"><div id="result"></div><p></p><button id="getDataBtn">play</button></div>';

  // // Append the container to the body of the webpage
  // document.body.appendChild(extensionContainer);

  // Your existing code to get and display the current URL
  // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  //   var url = tabs[0].url;
  //   document.getElementById('url').textContent = 'URL: ' + url;
  // });

  // Add an event listener to the button for making the HTTP request
  document.getElementById('getDataBtn').addEventListener('click', function() {
    // URL for your HTTP request using the current tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTabUrl = tabs[0].url;
      // var apiUrl = 'http://192.168.0.171:5000/get_youtube_video_info?youtube_url=' + encodeURIComponent(currentTabUrl);
      var apiUrl = 'http://192.168.0.171:5000/searchvtt?youtube_url=' + encodeURIComponent(currentTabUrl);
           // Make the HTTP request using the fetch API
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();  // Read the response as text
        })
        /* The `.then(data => { ... })` block is a callback function that is executed after the HTTP
        request is successfully made and the response is received. */
        .then(data => {
          // Display the raw response in the 'result' div
          // document.getElementById('result').textContent =  data;
          document.getElementById('result').innerHTML = data.replace(/\n/g, '<br>');
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          document.getElementById('result').textContent = 'Error fetching data';
        });
    });
  });
});
