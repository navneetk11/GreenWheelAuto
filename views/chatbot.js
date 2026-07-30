(function() {
    'use strict';

    console.log('✅ Chatbot script loaded!');

    const API_URL = '/api/chatbot';
    const BOT_AVATAR = '🚗';
    const USER_AVATAR = '👤';

    let isOpen = false;

    function createWidget() {
        console.log('✅ Creating chatbot widget...');

        const widget = document.createElement('div');
        widget.id = 'chatbot-widget';
        widget.innerHTML = `
            <button id="chatbot-toggle" class="chatbot-toggle">
                <span class="chatbot-icon">💬</span>
                <span class="chatbot-close-icon" style="display:none;">✕</span>
            </button>

            <div id="chatbot-window" class="chatbot-window" style="display:none;">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <span class="chatbot-avatar">🚗</span>
                        <div>
                            <div class="chatbot-title">GreenWheel Bot</div>
                            <div class="chatbot-status">Online • Ready to help</div>
                        </div>
                    </div>
                    <button id="chatbot-minimize" class="chatbot-minimize">−</button>
                </div>

                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="chatbot-message bot">
                        <div class="chatbot-message-content">
                            👋 Hi there! I'm your GreenWheel Auto assistant. Ask me about:
                            <ul>
                                <li>🚗 Vehicle range and specs</li>
                                <li>💰 Pricing and deals</li>
                                <li>🔋 Charging information</li>
                                <li>📋 How to browse or buy</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" placeholder="Ask me anything..." class="chatbot-input">
                    <button id="chatbot-send" class="chatbot-send-btn">➤</button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        const toggleBtn = document.getElementById('chatbot-toggle');
        const closeBtn = document.getElementById('chatbot-minimize');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const windowEl = document.getElementById('chatbot-window');
        const icon = toggleBtn.querySelector('.chatbot-icon');
        const closeIcon = toggleBtn.querySelector('.chatbot-close-icon');

        toggleBtn.addEventListener('click', function() {
            isOpen = !isOpen;
            windowEl.style.display = isOpen ? 'flex' : 'none';
            icon.style.display = isOpen ? 'none' : 'inline';
            closeIcon.style.display = isOpen ? 'inline' : 'none';
            if (isOpen) {
                input.focus();
                scrollToBottom();
            }
        });

        closeBtn.addEventListener('click', function() {
            isOpen = false;
            windowEl.style.display = 'none';
            icon.style.display = 'inline';
            closeIcon.style.display = 'none';
        });

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            input.value = '';
            input.focus();

            showTyping();

            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            })
            .then(res => res.json())
            .then(data => {
                hideTyping();
                addMessage(data.response || data.message || "I'm sorry, I didn't understand that.", 'bot');
            })
            .catch(err => {
                hideTyping();
                addMessage("⚠️ Sorry, I'm having trouble connecting. Please try again later.", 'bot');
                console.error('Chatbot error:', err);
            });
        }

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') sendMessage();
        });

        console.log('✅ Chatbot widget created!');
    }

    function addMessage(text, sender) {
        const container = document.getElementById('chatbot-messages');
        const div = document.createElement('div');
        div.className = `chatbot-message ${sender}`;

        const content = document.createElement('div');
        content.className = 'chatbot-message-content';

        if (sender === 'bot') {
            content.innerHTML = text;
        } else {
            content.textContent = text;
        }

        const avatar = document.createElement('span');
        avatar.className = 'chatbot-message-avatar';
        avatar.textContent = sender === 'bot' ? BOT_AVATAR : USER_AVATAR;

        div.appendChild(avatar);
        div.appendChild(content);
        container.appendChild(div);
        scrollToBottom();
    }

    function showTyping() {
        const container = document.getElementById('chatbot-messages');
        const div = document.createElement('div');
        div.id = 'chatbot-typing';
        div.className = 'chatbot-message bot';
        div.innerHTML = `
            <span class="chatbot-message-avatar">${BOT_AVATAR}</span>
            <div class="chatbot-message-content">
                <span class="chatbot-typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </div>
        `;
        container.appendChild(div);
        scrollToBottom();
    }

    function hideTyping() {
        const typing = document.getElementById('chatbot-typing');
        if (typing) typing.remove();
    }

    function scrollToBottom() {
        const container = document.getElementById('chatbot-messages');
        container.scrollTop = container.scrollHeight;
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #chatbot-widget {
                position: fixed;
                bottom: 24px;
                right: 24px;
                z-index: 9999;
                font-family: 'Inter', 'Segoe UI', sans-serif;
            }

            .chatbot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #C4F135, #A8B82E);
                border: none;
                box-shadow: 0 8px 30px rgba(196, 241, 53, 0.3);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                color: #0B0D0C;
                transition: transform 0.3s, box-shadow 0.3s;
                position: relative;
            }
            .chatbot-toggle:hover {
                transform: scale(1.08);
                box-shadow: 0 12px 40px rgba(196, 241, 53, 0.4);
            }
            .chatbot-toggle .chatbot-close-icon {
                font-size: 24px;
                font-weight: 300;
            }

            .chatbot-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 500px;
                background: #16191A;
                border: 1px solid #2A2D2A;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                flex-direction: column;
                overflow: hidden;
                display: none;
            }

            .chatbot-header {
                padding: 16px 20px;
                background: #1A1E1F;
                border-bottom: 1px solid #2A2D2A;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-shrink: 0;
            }
            .chatbot-header-info {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .chatbot-avatar {
                font-size: 28px;
            }
            .chatbot-title {
                font-weight: 600;
                font-size: 15px;
                color: #F5F6F2;
            }
            .chatbot-status {
                font-size: 11px;
                color: #9AA39C;
            }
            .chatbot-minimize {
                background: none;
                border: none;
                color: #9AA39C;
                font-size: 20px;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 6px;
                transition: background 0.2s;
            }
            .chatbot-minimize:hover {
                background: #2A2D2A;
                color: #F5F6F2;
            }

            .chatbot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                background: #0B0D0C;
            }
            .chatbot-messages::-webkit-scrollbar {
                width: 4px;
            }
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: #2A2D2A;
                border-radius: 4px;
            }

            .chatbot-message {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                max-width: 90%;
            }
            .chatbot-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }
            .chatbot-message-avatar {
                font-size: 22px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            .chatbot-message-content {
                background: #1A1E1F;
                padding: 10px 14px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.6;
                color: #F5F6F2;
                border: 1px solid #2A2D2A;
            }
            .chatbot-message.user .chatbot-message-content {
                background: #C4F135;
                color: #0B0D0C;
                border-color: #C4F135;
            }
            .chatbot-message-content ul {
                margin: 4px 0;
                padding-left: 18px;
            }
            .chatbot-message-content li {
                margin: 4px 0;
            }

            .chatbot-typing-dots {
                display: inline-flex;
                gap: 4px;
                font-size: 20px;
                padding: 0 4px;
            }
            .chatbot-typing-dots span {
                animation: chatbot-bounce 1.2s infinite;
            }
            .chatbot-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .chatbot-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

            @keyframes chatbot-bounce {
                0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                30% { transform: translateY(-6px); opacity: 1; }
            }

            .chatbot-input-area {
                padding: 12px 16px;
                border-top: 1px solid #2A2D2A;
                display: flex;
                gap: 10px;
                background: #0B0D0C;
                flex-shrink: 0;
            }
            .chatbot-input {
                flex: 1;
                padding: 10px 14px;
                border-radius: 10px;
                border: 1px solid #2A2D2A;
                background: #16191A;
                color: #F5F6F2;
                font-size: 14px;
                outline: none;
                transition: border-color 0.3s;
            }
            .chatbot-input:focus {
                border-color: #C4F135;
            }
            .chatbot-input::placeholder {
                color: #6B7280;
            }
            .chatbot-send-btn {
                padding: 10px 18px;
                border-radius: 10px;
                border: none;
                background: #C4F135;
                color: #0B0D0C;
                font-size: 18px;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            .chatbot-send-btn:hover {
                opacity: 0.85;
            }

            @media (max-width: 480px) {
                .chatbot-window {
                    width: 90vw;
                    right: 0;
                    height: 450px;
                }
                .chatbot-toggle {
                    width: 54px;
                    height: 54px;
                    font-size: 24px;
                }
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Chatbot styles injected!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            injectStyles();
            createWidget();
        });
    } else {
        injectStyles();
        createWidget();
    }

})();