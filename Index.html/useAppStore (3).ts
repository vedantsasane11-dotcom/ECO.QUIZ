import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Certificate {
  id: string;
  moduleId: string;
  moduleTitle: string;
  score: number;
  date: string;
  userName: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'quiz_completed' | 'certificate_earned';
}

interface UserData {
  userName: string;
  certificates: Certificate[];
  activities: Activity[];
  profilePhoto: string | null;
  unreadCount: number;
  modulesCompleted: number;
  totalScore: number;
  emailNotifications: boolean;
  profileVisibility: boolean;
  quizProgress: Record<string, { currentIndex: number, userAnswers: string[] }>;
  bio: string;
  location: string;
  twoFactorEnabled: boolean;
}

interface AppStore {
  isAuthenticated: boolean;
  currentUserEmail: string | null;
  users: Record<string, UserData>;
  login: (email: string) => void;
  logout: () => void;
  deleteAccount: () => void;
  
  userName: string;
  setUserName: (name: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  certificates: Certificate[];
  addCertificate: (cert: Omit<Certificate, 'id' | 'date'>) => void;
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'date'>) => void;
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  
  emailNotifications: boolean;
  setEmailNotifications: (enabled: boolean) => void;
  profileVisibility: boolean;
  setProfileVisibility: (enabled: boolean) => void;
  bio: string;
  setBio: (bio: string) => void;
  location: string;
  setLocation: (location: string) => void;
  setTwoFactorEnabled: (enabled: boolean) => void;
  
  unreadCount: number;
  markNotificationsAsRead: () => void;
  modulesCompleted: number;
  incrementModulesCompleted: () => void;
  totalScore: number;
  addScore: (score: number) => void;

  quizProgress: Record<string, { currentIndex: number, userAnswers: string[] }>;
  updateQuizProgress: (id: string, currentIndex: number, userAnswers: string[]) => void;
  clearQuizProgress: (id: string) => void;
}

const defaultUserData: UserData = {
  userName: 'Student',
  certificates: [],
  activities: [],
  profilePhoto: null,
  unreadCount: 0,
  modulesCompleted: 0,
  totalScore: 0,
  emailNotifications: true,
  profileVisibility: false,
  quizProgress: {},
  bio: "",
  location: "",
  twoFactorEnabled: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentUserEmail: null,
      users: {},
      
      login: (email: string) => set((state) => {
        const user = state.users[email] || {
          ...defaultUserData,
          userName: email.split('@')[0]
        };
        return {
          isAuthenticated: true,
          currentUserEmail: email,
          ...user
        };
      }),
      
      logout: () => set((state) => {
        if (!state.currentUserEmail) return { isAuthenticated: false };
        const currentUserData: UserData = {
          userName: state.userName,
          certificates: state.certificates,
          activities: state.activities,
          profilePhoto: state.profilePhoto,
          unreadCount: state.unreadCount,
          modulesCompleted: state.modulesCompleted,
          totalScore: state.totalScore,
          emailNotifications: state.emailNotifications,
          profileVisibility: state.profileVisibility,
          quizProgress: state.quizProgress,
          bio: state.bio,
          location: state.location,
          twoFactorEnabled: state.twoFactorEnabled,
        };
        return {
          isAuthenticated: false,
          currentUserEmail: null,
          users: {
            ...state.users,
            [state.currentUserEmail]: currentUserData
          },
          ...defaultUserData
        };
      }),

      deleteAccount: () => set((state) => {
        if (!state.currentUserEmail) return { isAuthenticated: false };
        const nextUsers = { ...state.users };
        delete nextUsers[state.currentUserEmail];
        return {
          isAuthenticated: false,
          currentUserEmail: null,
          users: nextUsers,
          ...defaultUserData
        };
      }),
      
      ...defaultUserData,
      userName: 'Student',
      
      setUserName: (name) => set({ userName: name }),
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setProfilePhoto: (photo) => set({ profilePhoto: photo }),
      
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setProfileVisibility: (enabled) => set({ profileVisibility: enabled }),
      setBio: (bio) => set({ bio }),
      setLocation: (location) => set({ location }),
      setTwoFactorEnabled: (enabled) => set({ twoFactorEnabled: enabled }),
      
      updateQuizProgress: (id, currentIndex, userAnswers) => set((state) => ({
        quizProgress: {
          ...state.quizProgress,
          [id]: { currentIndex, userAnswers }
        }
      })),
      
      clearQuizProgress: (id) => set((state) => {
        const nextTarget = { ...state.quizProgress };
        delete nextTarget[id];
        return { quizProgress: nextTarget };
      }),
      
      addCertificate: (cert) =>
        set((state) => {
          if (state.certificates.some((c) => c.moduleId === cert.moduleId)) {
            return state;
          }
          return {
            certificates: [
              ...state.certificates,
              {
                ...cert,
                id: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                date: new Date().toISOString(),
              },
            ],
          };
        }),
      
      markNotificationsAsRead: () => set({ unreadCount: 0 }),
      
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              ...activity,
              id: `ACT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              date: new Date().toISOString(),
            },
            ...state.activities,
          ].slice(0, 5),
          unreadCount: state.unreadCount + 1,
        })),
        
      incrementModulesCompleted: () =>
        set((state) => ({ modulesCompleted: state.modulesCompleted + 1 })),
        
      addScore: (score) => set((state) => ({ totalScore: state.totalScore + score })),
    }),
    {
      name: 'ecoquiz-storage',
    }
  )
);
