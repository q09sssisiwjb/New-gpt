export function generateTitleFromMessage(message: string): string {
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
