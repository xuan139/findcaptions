var global_caption_url = '';
// var global_url = 'http://127.0.0.1:5000/';

var global_url = 'http://127.0.0.1:5000/process_video';
// var global_url = 'https://excited-needlessly-gopher.ngrok-free.app/';
var globalCaptionUrls = [];

function downloadcaptions() {
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        try {
            document.getElementById('result').textContent = 'waitting for download captions... or come back later ';

            var currentTabUrl = tabs[0].url;
            var apiUrl = global_url + '?youtube_url=' + encodeURIComponent(currentTabUrl);

            fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                if (data.task1 == undefined){
                    document.getElementById('result').textContent = 'invalid url';}

                else{
                console.log('url is ', data.task1);
                console.log('vtt is ', data.task2);
                // document.getElementById('result').textContent = data;

                const downloadVttDiv = document.getElementById('downloadVtt');
                const captionDiv = document.getElementById('caption');
                // Clear previous content
                downloadVttDiv.innerHTML = '';
                captionDiv.innerHTML = '';

                var task2Array = data.task2;

                // Iterate through the array

                // Get the number of records in task2Array
                var numberOfRecords = task2Array.length;
                console.log('Number of Records in task2Array:', numberOfRecords);

                var videoElement = document.getElementById('myVideo');

                videoElement.src = data.task1;          

                data.task2.forEach(function(url) {
                    var track = document.createElement('track');
                    track.kind = 'subtitles';
                    track.src = url;
                    const match = url.match(/\.([^.]+)\.[^.]+$/);
                    // Check if the match is found and get the captured group
                    const languageCode = match ? match[1] : null;
                    track.srclang = languageCode;
                    track.default = true;
                    videoElement.appendChild(track);
                });
                task2Array.forEach(item => {
                    console.log('Task 2 Item:', item);

                    var paragraph = document.createElement('p');
                    var downloadLink = document.createElement('a');
                    const match = item.match(/\.([^.]+)\.[^.]+$/);
                    // Check if the match is found and get the captured group
                    const languageCode = match ? match[1] : null;
                    downloadLink.textContent = 'Download VTT:'+ languageCode ;
                    downloadLink.href = item;
                    downloadLink.download = item; // You can customize the file name

                    captionDiv.appendChild(paragraph);
                    captionDiv.appendChild(downloadLink);
    
                });
                document.getElementById('result').textContent = `Found ${data.task2.length} caption(s)`;

                videoSrc = videoElement.src;
                var videoUrl = encodeURIComponent(currentTabUrl)
                            // var videoUrlHash = CryptoJS.SHA256(videoUrl).toString();
        
                // 添加时间更新的监听器
                videoElement.addEventListener('timeupdate', function() {
                    var currentTime = videoElement.currentTime;

                    // 先删除先前的数据
                    chrome.storage.local.remove(videoUrl, function() {
                        // 在回调函数中保存新的数据
                        var data = {};
                        data[videoUrl] = currentTime;
                        console.log(videoUrl, currentTime);
                        chrome.storage.local.set(data);
                    });

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
                });}
                });

        } catch (error) {
            document.getElementById('result').textContent = 'downloadaudio fail, try later';
            // console.error(error);
        }
    });
}

// function getVideoInformation() {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         var currentTabUrl = tabs[0].url;
//         var apiUrl = global_url + 'get_video_info?youtube_url=' + encodeURIComponent(currentTabUrl);

//         fetch(apiUrl)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 document.getElementById('result').textContent = 'ready to play...';

//                 var myVideo = document.getElementById('myVideo');
//                 myVideo.controls = true;
//                 myVideo.src = data;

//                 var vttUrlElement = document.getElementById('caption');
//                 var vttUrl = vttUrlElement.innerText || vttUrlElement.textContent;

//                 console.log('vttUrl', vttUrl);

//                 var track = document.createElement('track');
//                 track.src = vttUrl;
//                 track.kind = 'subtitles';
//                 track.srclang = 'en';

//                 myVideo.appendChild(track);
//                 track.default = true;

               
//             })
//             .catch(error => {
//                 console.error('get_video_info fail, try later:', error);
//                 document.getElementById('result').textContent = 'get_video_info fail';
//             });
//     });
// }

