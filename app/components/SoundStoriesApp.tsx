'use client';

import { useState, useEffect } from 'react';
import { AdminPanel } from './AdminPanel';
import { SubscriberPanel } from './SubscriberPanel';
import { RecommendationsList } from './RecommendationsList';
import { StatsCards } from './StatsCards';

export interface Recommendation {
  id: number;
  title: string;
  story: string;
  spotifyLink?: string;
  youtubeLink?: string;
  otherLinks?: Array<{ platform: string; url: string }>;
  image: string;
  scheduledDate: string;
  createdAt: string;
  spotifyData?: any;
}

export interface AppState {
  recommendations: Recommendation[];
  subscribers: any[];
  calendarEvents: any[];
  spotifyPlaylistUrl?: string;
}

export default function SoundStoriesApp() {
  const [appState, setAppState] = useState<AppState>({
    recommendations: [],
    subscribers: [],
    calendarEvents: [],
    spotifyPlaylistUrl: undefined
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedData = localStorage.getItem('soundstories-data');
      if (savedData) {
        setAppState(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = (newState: AppState) => {
    setAppState(newState);
    localStorage.setItem('soundstories-data', JSON.stringify(newState));
  };

  const addRecommendation = (recommendation: Omit<Recommendation, 'id' | 'createdAt'>) => {
    const newRecommendation: Recommendation = {
      ...recommendation,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const newState = {
      ...appState,
      recommendations: [...appState.recommendations, newRecommendation]
    };
    saveData(newState);
  };

  const deleteRecommendation = (id: number) => {
    const newState = {
      ...appState,
      recommendations: appState.recommendations.filter(r => r.id !== id)
    };
    saveData(newState);
  };

  const updateRecommendation = (id: number, updates: Partial<Recommendation>) => {
    const newState = {
      ...appState,
      recommendations: appState.recommendations.map(r => 
        r.id === id ? { ...r, ...updates } : r
      )
    };
    saveData(newState);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading SoundStories...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center text-white mb-12 py-12">
          <h1 className="text-5xl font-bold mb-4 text-shadow-lg">
            🎵 SoundStories
          </h1>
          <p className="text-xl opacity-90">
            Curated music recommendations delivered through your calendar
          </p>
        </div>

        <StatsCards 
          totalRecommendations={appState.recommendations.length}
          totalSubscribers={appState.subscribers.length}
          thisWeek={Math.floor(Math.random() * 1000)}
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <AdminPanel 
            onAddRecommendation={addRecommendation}
            recommendations={appState.recommendations}
          />
          
          <SubscriberPanel 
            appState={appState}
            onUpdateState={saveData}
          />
        </div>

        <RecommendationsList
          recommendations={appState.recommendations}
          onDelete={deleteRecommendation}
          onUpdate={updateRecommendation}
        />
      </div>
    </div>
  );
}
