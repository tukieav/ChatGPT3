document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const contextInput = document.getElementById('context-input');
  const chatMessages = document.getElementById('chat-messages');
  const temperatureInput = document.getElementById('temperature-input');
  const topPInput = document.getElementById('top_p-input');
  const frequencyPenaltyInput = document.getElementById('frequency_penalty-input');
  const presencePenaltyInput = document.getElementById('presence_penalty-input');

  messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userMessage = messageInput.value.trim();
    if (!userMessage) {
      return;
    }

    addMessageToChat('user', userMessage);
    messageInput.value = '';

    const context = contextInput.value.trim();
    const temperature = parseFloat(temperatureInput.value) || 0.9;
    const topP = parseFloat(topPInput.value) || 1;
    const frequencyPenalty = parseFloat(frequencyPenaltyInput.value) || 0;
    const presencePenalty = parseFloat(presencePenaltyInput.value) || 0;

    const gpt3Response = await fetchGpt3Response(userMessage, context, temperature, topP, frequencyPenalty, presencePenalty);
    addMessageToChat('gpt3', gpt3Response);
  });

  async function fetchGpt3Response(userMessage, context, temperature, topP, frequencyPenalty, presencePenalty) {
    const response = await fetch('/api/gpt3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input: userMessage, context: context, temperature: temperature, top_p: topP, frequency_penalty: frequencyPenalty, presence_penalty: presencePenalty })
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
  async function fetchUser() {
  const response = await fetch('/api/user');
  const data = await response.json();
  return data.user;
}

function updateUserUI(user) {
  // Tutaj możesz zaktualizować interfejs użytkownika na podstawie stanu logowania
  if (user) {
    console.log(`User is logged in: ${user.displayName}`);
  } else {
    console.log('User is not logged in');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Pobierz dane o użytkowniku i zaktualizuj interfejs użytkownika
  const user = await fetchUser();
  updateUserUI(user);
});
  const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', async () => {
  await fetch('/logout');
  const user = await fetchUser();
  updateUserUI(user);
});
});