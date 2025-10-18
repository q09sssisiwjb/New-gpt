const CUSTOM_API_KEY_STORAGE_KEY = 'openrouter_custom_api_key';

export interface CustomApiKeyData {
  apiKey: string;
  modelId?: string;
  timestamp: number;
}

export const customApiKeyStorage = {
  save(apiKey: string, modelId?: string): void {
    if (typeof window === 'undefined') return;
    
    const data: CustomApiKeyData = {
      apiKey,
      modelId,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(CUSTOM_API_KEY_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('customApiKeyUpdated'));
    } catch (error) {
      console.error('Failed to save custom API key:', error);
    }
  },

  get(): CustomApiKeyData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY);
      if (!stored) return null;
      
      return JSON.parse(stored) as CustomApiKeyData;
    } catch (error) {
      console.error('Failed to retrieve custom API key:', error);
      return null;
    }
  },

  remove(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(CUSTOM_API_KEY_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('customApiKeyUpdated'));
    } catch (error) {
      console.error('Failed to remove custom API key:', error);
    }
  },

  hasCustomKey(): boolean {
    const data = this.get();
    return data !== null && data.apiKey.length > 0;
  }
};
