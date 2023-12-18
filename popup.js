// popup.js

document.addEventListener('DOMContentLoaded', function() {

  // Your existing code to get and display the current URL
  var global_url = 'http://192.168.0.171:5000/'
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var myImage = document.getElementById('myImage');
    myImage.style.width = '150px'
    myImage.src = global_url + 'static/demo.png'
    // Set the src attribute dynamically
    var currentTabUrl = tabs[0].url;
    var regExp = /^.*(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|.*v=|.*\/videos\/|.*[?&]v=))([^"&?\/\s]{11}).*$/;
    // Extract the video ID using the regular expression
    var match = currentTabUrl.match(regExp);
    // Check if there is a match and return the video ID
    var videoId = (match && match[1]) ? match[1] : null;
  
    var apiUrl = global_url+`/get_files/${videoId}`;
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Replace 'yourdomain.com' with your actual domain or IP address
        var baseUrl = global_url;
  
        var webpFiles = data.webp_files.map(file => baseUrl + file);
        var vttFiles = data.vtt_files.map(file => baseUrl + file);
  
        console.log("WebP Files:", webpFiles);
        console.log("VTT Files:", vttFiles);
  
        myImage.src = webpFiles[0];
        
        myImage.style.width = '300px'
        // Create download links for each VTT file
        var downloadLinks = document.getElementById('downloadVtt');
        vttFiles.forEach((vttFile, index) => {
          var link = document.createElement('a');
          link.href = vttFile;
          link.download = `caption${index + 1}.vtt`; // You can customize the file name
          link.textContent = `Download VTT ${index + 1}`;
          downloadLinks.appendChild(link);
          downloadLinks.appendChild(document.createElement('br')); // Add line break
        });
        // Perform further actions with the complete file URLs as needed
      })
      .catch(error => {
        console.error("Error fetching files:", error);
      });
  });
  
  
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    document.getElementById('result').innerHTML = 'generating captions backend...';
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var currentTabUrl = tabs[0].url;
      var apiUrl = global_url+'searchvtt?youtube_url=' + encodeURIComponent(currentTabUrl);
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
          document.getElementById('result').innerHTML = data.replace(/\n/g, '<br>');
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          document.getElementById('result').textContent = 'Error fetching data';
        });
    });
  });

});


// http://192.168.0.171:5000/get_files/https://www.youtube.com/watch?v=sVNrXXM1txo