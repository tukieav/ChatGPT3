document.addEventListener('DOMContentLoaded', () => {
  const loginContainer = document.getElementById('login-container');
  const chatContainer = document.getElementById('chat-container');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const contextInput = document.getElementById('context-input');
  const chatMessages = document.getElementById('chat-messages');
  const logoutLink = document.querySelector('a[href="/logout"]');

async function checkUserLoggedIn() {
  const response = await fetch('/api/user');
  if (response.ok) {
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  } else {
    loginContainer.style.display = 'block';
    chatContainer.style.display = 'none';
  }
}

  messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = messageInput.value.trim();
    if (!userMessage) {
      return;
    }

    addMessageToChat('user', userMessage);
    messageInput.value = '';

    const context = contextInput.value.trim();
    const gpt3Response = await fetchGpt3Response(userMessage, context);
    addMessageToChat('gpt3', gpt3Response);
  });

  async function fetchGpt3Response(userMessage, context) {
    const response = await fetch('/api/gpt3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: userMessage, context: context })
    });

    const data = await response.json();
    return data.output;
  }

  function addMessageToChat(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  logoutLink.addEventListener('click', async (event) => {
  event.preventDefault();
  const response = await fetch('/logout');
  if (response.ok) {
    checkUserLoggedIn();
  }
});

});
