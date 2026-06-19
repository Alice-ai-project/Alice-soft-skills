export class ChatView {
    constructor() {
        this.chatContainer = document.getElementById('chat-container');
        this.micBtn = document.getElementById('mic-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.aiStatusText = document.getElementById('ai-status-text');
    }

    updateMicUI(isRecording, statusText) {
        if (this.micBtn && this.stopBtn) {
            if (isRecording) {
                this.micBtn.style.display = 'none';
                this.stopBtn.style.display = 'flex';
                this.stopBtn.classList.add('recording');
            } else {
                this.micBtn.style.display = 'flex';
                this.stopBtn.style.display = 'none';
                this.stopBtn.classList.remove('recording');
            }
        }
        if (this.aiStatusText) {
            this.aiStatusText.textContent = statusText;
        }
    }

    displayUserMessage(message) {
        if (!this.chatContainer) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.innerHTML = `
            <div class="message-bubble">${message}</div>
        `;
        this.chatContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    displayAIMessage(message) {
        if (!this.chatContainer) return;
        
        // Remove typing indicators if any
        const indicators = this.chatContainer.querySelectorAll('.typing-indicator');
        indicators.forEach(el => el.remove());

        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ai-message';
        msgDiv.innerHTML = `
            <div class="message-bubble">${message}</div>
        `;
        this.chatContainer.appendChild(msgDiv);
        this.scrollToBottom();
    }

    scrollToBottom() {
        if (this.chatContainer) {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    bindMicControls(startHandler, stopHandler) {
        if (this.micBtn) {
            this.micBtn.addEventListener('click', startHandler);
        }
        if (this.stopBtn) {
            this.stopBtn.addEventListener('click', stopHandler);
        }
    }
}
