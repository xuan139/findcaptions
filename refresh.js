var global_caption_url = '';
var global_url = 'http://192.168.0.171:5000/';

var globalCaptionUrls = [];

function applyButtonStyles(button) {
    button.style.padding = '10px 15px'; // Adjust padding as needed
    button.style.backgroundColor = '#3498db'; // Set background color
    button.style.color = '#ffffff'; // Set text color
    button.style.border = 'none'; // Remove border
    button.style.borderRadius = '5px'; // Add rounded corners
    button.style.width = '80px'; // Adjust width
    button.style.height = '30px'; // Adjust height
  }

function downloadcaptions() {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        try {
            document.getElementById('result').textContent = 'waitting for download captions... or come back later ';

            var currentTabUrl = tabs[0].url;
            var apiUrl = global_url + 'downloadaudio?youtube_url=' + encodeURIComponent(currentTabUrl);

            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                document.getElementById('result').textContent = data;

                const downloadVttDiv = document.getElementById('downloadVtt');
                const captionDiv = document.getElementById('caption');
                // Clear previous content
                downloadVttDiv.innerHTML = '';
                captionDiv.innerHTML = '';
                data.forEach(item => {
                    const captionUrl = global_url + item;
                    globalCaptionUrls.push(captionUrl);
                });
    
                document.getElementById('result').textContent = `Found ${data.length} caption(s)`;
                var apiUrl = global_url + 'get_video_info?youtube_url=' + encodeURIComponent(currentTabUrl);

                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        
                        // document.getElementById('result').textContent = data;

                        globalCaptionUrls.forEach((url, index) => {
                            // Create a paragraph element to contain the URL
                            const paragraph = document.createElement('p');
      
                            const match = url.match(/\.([^.]+)\.[^.]+$/);
                            // Check if the match is found and get the captured group
                            const languageCode = match ? match[1] : null;
                            var downloadLink = document.createElement('a');
                            downloadLink.textContent = 'Download VTT:'+ languageCode ;
                            downloadLink.href = url;
                            downloadLink.download = url; // You can customize the file name
                            // Create a button element

                            var myVideo = document.getElementById('myVideo');
                            var track = document.createElement('track');
                            myVideo.controls = true;
                            myVideo.src = data;          
                            track.kind = 'subtitles';

                            track.srclang = languageCode;
                            track.src = url;
                                
                            myVideo.appendChild(track);
                            track.default = true;
                        
                            captionDiv.appendChild(paragraph);
                            captionDiv.appendChild(downloadLink);
                            
                        });
                    })
                    .catch(error => {
                        console.error('get_video_info fail, try later:', error);
                        document.getElementById('result').textContent = 'get_video_info fail';
                    });
    
            })
            .catch(error => {
                console.error('Error fetching VTT files:', error);
                document.getElementById('result').textContent = 'not valid';

            });
        } catch (error) {
            document.getElementById('result').textContent = 'downloadaudio fail, try later';
            // console.error(error);
        }
    });
}


// function fetchVttFiles() {

// }


// function getVideoFiles() {
//     return new Promise((resolve, reject) => {
//         chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
//             try {
//                 document.getElementById('result').textContent = 'captions downloaded';
//                 var currentTabUrl = tabs[0].url;
//                 var regExp = /^.*(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|.*v=|.*\/videos\/|.*[?&]v=))([^"&?\/\s]{11}).*$/;
//                 var match = currentTabUrl.match(regExp);
//                 var videoId = (match && match[1]) ? match[1] : null;

//                 var apiUrl = global_url + `/get_files/${videoId}`;
//                 const response = await fetch(apiUrl);

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 var baseUrl = global_url;
//                 var vttFiles = data.vtt_files.map(file => baseUrl + file);

//                 var downloadLinks = document.getElementById('downloadVtt');
//                 vttFiles.forEach((vttFile, index) => {
//                     var link = document.createElement('a');
//                     link.href = vttFile;
//                     link.download = `caption${index + 1}.vtt`;
//                     link.textContent = `Download VTT ${index + 1}`;
//                     downloadLinks.appendChild(link);
//                     downloadLinks.appendChild(document.createElement('br'));
//                 });

//                 resolve(); // Resolve the promise to signal completion
//             } catch (error) {
//                 console.error("get_file:", error);
//                 document.getElementById('result').textContent = 'Caption not ready, come back later';
//                 reject(error); // Reject the promise in case of an error
//             }
//         });
//     });
// }

function getVideoInformation() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTabUrl = tabs[0].url;
        var apiUrl = global_url + 'get_video_info?youtube_url=' + encodeURIComponent(currentTabUrl);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('result').textContent = 'ready to play...';

                var myVideo = document.getElementById('myVideo');
                myVideo.controls = true;
                myVideo.src = data;

                var vttUrlElement = document.getElementById('caption');
                var vttUrl = vttUrlElement.innerText || vttUrlElement.textContent;

                console.log('vttUrl', vttUrl);

                var track = document.createElement('track');
                track.src = vttUrl;
                track.kind = 'subtitles';
                track.srclang = 'en';

                myVideo.appendChild(track);
                track.default = true;
            })
            .catch(error => {
                console.error('get_video_info fail, try later:', error);
                document.getElementById('result').textContent = 'get_video_info fail';
            });
    });
}

