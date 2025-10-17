import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export const chatHistoryService = {
  async createThread(userId: string, title: string = 'New Chat'): Promise<string> {
    const threadRef = await addDoc(collection(db, 'chatThreads'), {
      userId,
      title,
      messages: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return threadRef.id;
  },

  async getThreads(userId: string): Promise<ChatThread[]> {
    const q = query(
      collection(db, 'chatThreads'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        messages: data.messages || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  },

  async getThread(threadId: string): Promise<ChatThread | null> {
    const docRef = doc(db, 'chatThreads', threadId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      userId: data.userId,
      title: data.title,
      messages: data.messages || [],
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  },

  async updateThread(
    threadId: string, 
    updates: { title?: string; messages?: ChatMessage[] }
  ): Promise<void> {
    const docRef = doc(db, 'chatThreads', threadId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteThread(threadId: string): Promise<void> {
    const docRef = doc(db, 'chatThreads', threadId);
    await deleteDoc(docRef);
  },

  async addMessage(
    threadId: string, 
    message: ChatMessage
  ): Promise<void> {
    const thread = await this.getThread(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    const updatedMessages = [...thread.messages, message];
    await this.updateThread(threadId, { messages: updatedMessages });
  },
};
