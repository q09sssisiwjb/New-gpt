export async function generateTitleFromMessage(message: string): Promise<string> {
  try {
    const response = await fetch('/api/generate-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      console.error('Failed to generate title:', response.statusText);
      return fallbackTitle(message);
    }

    const data = await response.json();
    return data.title || fallbackTitle(message);
  } catch (error) {
    console.error('Error generating title:', error);
    return fallbackTitle(message);
  }
}

function fallbackTitle(message: string): string {
  const cleanMessage = message.trim();
  
  if (cleanMessage.length === 0) {
    return 'New Chat';
  }
  
  const maxLength = 50;
  
  if (cleanMessage.length <= maxLength) {
    return cleanMessage;
  }
  
  const truncated = cleanMessage.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
