'use client';

import { useState, useRef } from 'react';
import { SpotifySearch } from './SpotifySearch';
import { Recommendation } from './SoundStoriesApp';

interface AdminPanelProps {
  onAddRecommendation: (recommendation: Omit<Recommendation, 'id' | 'createdAt'>) => void;
  recommendations: Recommendation[];
}

export function AdminPanel({ onAddRecommendation, recommendations }: AdminPanelProps) {
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    spotifyLink: '',
    youtubeLink: '',
    otherLinks: '',
    scheduledDate: '',
    image: ''
  });
  
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDefaultDate = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().slice(0, 16);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTrackSelect = (track: any) => {
    setSelectedTrack(track);
    setFormData(prev => ({
      ...prev,
      title: `${track.name} - ${track.artists.map((a: any) => a.name).join(', ')}`,
      spotifyLink: track.external_urls.spotify
    }));

    if (!formData.image && track.album.images[0]) {
      setImagePreview(track.album.images[0].url);
      setFormData(prev => ({ ...prev, image: track.album.images[0].url }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set default date if empty
    const dateToUse = formData.scheduledDate || getDefaultDate();
    
    if (!formData.title || !formData.story || !formData.image || !dateToUse) {
      alert('Please fill in all required fields');
      return;
    }

    const recommendation = {
      title: formData.title,
      story: formData.story,
      spotifyLink: formData.spotifyLink || undefined,
      youtubeLink: formData.youtubeLink || undefined,
      otherLinks: [],
      image: formData.image,
      scheduledDate: dateToUse,
      spotifyData: selectedTrack
    };

    onAddRecommendation(recommendation);
    
    setFormData({
      title: '',
      story: '',
      spotifyLink: '',
      youtubeLink: '',
      otherLinks: '',
      scheduledDate: '',
      image: ''
    });
    setSelectedTrack(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    alert('Recommendation added successfully!');
  };

  const wordCount = formData.story.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-95">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
        🎯 Admin Panel
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎵 Add Song
          </label>
          <SpotifySearch onTrackSelect={handleTrackSelect} />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Song Title & Artist *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Bohemian Rhapsody - Queen"
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
          />
        </div>

        <div>
          <label htmlFor="story" className="block text-sm font-semibold text-gray-700 mb-2">
            Story (1000 words) *
          </label>
          <textarea
            id="story"
            name="story"
            value={formData.story}
            onChange={handleInputChange}
            placeholder="Tell the story behind this recommendation..."
            required
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white resize-vertical"
          />
          <div className={`text-sm mt-1 ${wordCount > 1000 ? 'text-red-500' : 'text-gray-500'}`}>
            {wordCount}/1000 words
          </div>
        </div>

        <div>
          <label htmlFor="imageUpload" className="block text-sm font-semibold text-gray-700 mb-2">
            Recommendation Image *
          </label>
          <input
            type="file"
            id="imageUpload"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            required={!imagePreview}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 max-w-full max-h-48 rounded-xl shadow-lg object-cover"
            />
          )}
        </div>

        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-semibold text-gray-700 mb-2">
            Scheduled Date *
          </label>
          <input
            type="datetime-local"
            id="scheduledDate"
            name="scheduledDate"
            value={formData.scheduledDate || getDefaultDate()}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Add Recommendation
          </button>
        </div>
      </form>
    </div>
  );
}
