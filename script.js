document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const messages = document.getElementById('messages');
    const apiKey = '1200b5dd271649ae98e189601a8485af8e5092b1f456fd240c6e1e7c09e86735';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    function appendMessage(content, className) {
        const message = document.createElement('div');
        message.textContent = content;
        message.classList.add('message', className);
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    async function getBotResponse(message) {
        try {
            const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${"1200b5dd271649ae98e189601a8485af8e5092b1f456fd240c6e1e7c09e86735"}`
                },
                body: JSON.stringify({
                    model: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
                    messages: [{ role: "user", content: message }],
                    max_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.7,
                    top_k: 50,
                    repetition_penalty: 1,
                    stop: ["<|eot_id|>"]
                })
            });

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, I encountered an error.';
        }
    }

    function botResponse(text) {
        appendMessage(text, 'bot-message');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    }

    startButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        appendMessage(transcript, 'user-message');

        const botReply = await getBotResponse(transcript);
        botResponse(botReply);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event);
    };
});