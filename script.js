
        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        const volumeControl = document.getElementById('volumeControl');

        let audioContext;
        let mediaStreamSource;
        let mediaRecorder;
        let gainNode;
        let audioChunks = [];

        startBtn.addEventListener('click', async () => {
            // 获取麦克风权限
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // 创建媒体流源
            mediaStreamSource = audioContext.createMediaStreamSource(stream);

            // 创建一个增益节点用于音量控制
            gainNode = audioContext.createGain();
            mediaStreamSource.connect(gainNode);

            // 将增益节点连接到音频输出
            gainNode.connect(audioContext.destination);

            // 设置音量控制滑动条的事件监听器
            volumeControl.addEventListener('input', () => {
                gainNode.gain.value = volumeControl.value;
            });

            // 设置MediaRecorder以便后续停止录音时保存音频数据
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
                audioChunks = [];  // 清空音频数据
            };

            mediaRecorder.start();
            startBtn.disabled = true;
            stopBtn.disabled = false;
        });

        stopBtn.addEventListener('click', () => {
            // 停止录音
            mediaRecorder.stop();
            audioContext.close(); // 关闭音频上下文
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });
