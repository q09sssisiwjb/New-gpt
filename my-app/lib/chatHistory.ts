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
  writeBatch,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export const chatHistoryService = {
  async createThread(userId: string, title: string = 'New Chat'): Promise<string> {
    const threadRef = await addDoc(collection(db, 'chatThreads'), {
      userId,
      title,
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
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  },

  async getMessages(threadId: string): Promise<ChatMessage[]> {
    const messagesRef = collection(db, 'chatThreads', threadId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp?.toDate() || new Date(),
      };
    });
  },

  async updateThread(
    threadId: string, 
    updates: { title?: string }
  ): Promise<void> {
    const docRef = doc(db, 'chatThreads', threadId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteThread(threadId: string): Promise<void> {
    const messagesRef = collection(db, 'chatThreads', threadId, 'messages');
    
    const deleteInBatches = async () => {
      const batchSize = 500;
      const q = query(messagesRef, limit(batchSize));
      
      const snapshot = await getDocs(q);
      
      if (snapshot.size === 0) {
        return;
      }
      
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      
      if (snapshot.size === batchSize) {
        await deleteInBatches();
      }
    };
    
    await deleteInBatches();
    
    const threadRef = doc(db, 'chatThreads', threadId);
    await deleteDoc(threadRef);
  },

  async addMessage(
    threadId: string, 
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<string> {
    const batch = writeBatch(db);
    
    const messagesRef = collection(db, 'chatThreads', threadId, 'messages');
    const messageRef = doc(messagesRef);
    batch.set(messageRef, {
      ...message,
      timestamp: serverTimestamp(),
    });
    
    const threadRef = doc(db, 'chatThreads', threadId);
    batch.update(threadRef, {
      updatedAt: serverTimestamp(),
    });
    
    await batch.commit();
    return messageRef.id;
  },
};
