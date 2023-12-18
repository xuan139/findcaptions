// fetchData.js
function fetchDataAndDisplayResult() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      document.getElementById('result').innerHTML = 'generating captions backend...';
  
      var currentTabUrl = tabs[0].url;
      var apiUrl = global_url + 'searchvtt?youtube_url=' + encodeURIComponent(currentTabUrl);
  
      // Make the HTTP request using the fetch API
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.text();  // Read the response as text
        })
        .then(data => {
          document.getElementById('result').innerHTML = data.replace(/\n/g, '<br>');
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          document.getElementById('result').textContent = 'Error fetching data';
        });
    });
  }
  