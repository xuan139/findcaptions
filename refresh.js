var global_caption_url = '';
var global_url = 'http://127.0.0.1:5000/';
// var global_url = 'https://excited-needlessly-gopher.ngrok-free.app/';
var globalCaptionUrls = [];


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

                // document.getElementById('result').textContent = data;

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

                            var videoElement = document.getElementById('myVideo');
                            var track = document.createElement('track');
                            videoElement.controls = true;
                            videoElement.src = data;          
                            track.kind = 'subtitles';


                            // videoElement.src = data;
                            videoSrc = videoElement.src;
                            var videoUrl = encodeURIComponent(currentTabUrl)
                            // var videoUrlHash = CryptoJS.SHA256(videoUrl).toString();
        
                            // 添加时间更新的监听器
                            videoElement.addEventListener('timeupdate', function() {
                                // Ensure CryptoJS is available before using it
                                // if (typeof CryptoJS !== 'undefined' && CryptoJS.SHA256) {
                                    // var videoUrlHash = CryptoJS.SHA256(videoUrl).toString();
                                    var currentTime = videoElement.currentTime;
        
                                    // 先删除先前的数据
                                    chrome.storage.local.remove(videoUrl, function() {
                                        // 在回调函数中保存新的数据
                                        var data = {};
                                        data[videoUrl] = currentTime;
                                        console.log(videoUrl, currentTime);
                                        chrome.storage.local.set(data);
                                    });
                                // } else {
                                //     console.error('CryptoJS is not available.');
                                // }
                            });
                            videoElement.addEventListener('loadedmetadata', function() {
                                // 获取视频的持续时间
                                console.log('load video')
                                console.log('videoUrl', videoUrl)
                                
                                chrome.storage.local.get(videoUrl, function(storageData) {
                                    // Use storageData instead of data
                                    var savedTime = storageData[videoUrl];
                                    console.log('videoUrl', videoUrl)
                                    var duration = videoElement.duration;
                                    console.log('savedTime 1st', savedTime);
                                    
                                    // Check if savedTime is within the valid range
                                    if (savedTime !== undefined && savedTime <= duration) {
                                        // 如果保存的时间存在，设置视频的当前时间
                                        videoElement.currentTime = savedTime;
                                    }
                                });
                            });

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

