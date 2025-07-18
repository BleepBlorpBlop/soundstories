'use client';

import { useState } from 'react';
import { AppState } from './SoundStoriesApp';

interface SubscriberPanelProps {
  appState: AppState;
  onUpdateState: (newState: AppState) => void;
}

export function SubscriberPanel({ appState, onUpdateState }: SubscriberPanelProps) {
  const [testEmail, setTestEmail] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState(appState.spotifyPlaylistUrl || '');
  const [showPlaylistManagement, setShowPlaylistManagement] = useState(!!appState.spotifyPlaylistUrl);

  const calendarUrl = "webcal://soundstories.app/calendar/feed.ics";

  const copyCalendarUrl = () => {
    navigator.clipboard.writeText(calendarUrl).then(() => {
      alert('Calendar URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy URL. Please select and copy manually.');
    });
  };

  const sendTestEmail = () => {
    if (!testEmail) {
      alert('Please enter an email address.');
      return;
    }

    if (appState.recommendations.length === 0) {
      alert('Please add at least one recommendation first.');
      return;
    }

    const latestRec = appState.recommendations[appState.recommendations.length - 1];
    console.log('Test email would be sent to:', testEmail);
    console.log('Email content preview:', {
      subject: `🎵 Your Weekly SoundStories Recommendation`,
      body: `${latestRec.title}\n\n${latestRec.story}\n\n🎧 Links: ${latestRec.spotifyLink || 'N/A'}`
    });
    
    alert(`Test email sent to ${testEmail}! (Check console for preview)`);
  };

  const savePlaylistUrl = () => {
    if (!playlistUrl.trim()) {
      alert('Please enter a Spotify playlist URL');
      return;
    }
    
    if (!playlistUrl.includes('open.spotify.com/playlist/')) {
      alert('Please enter a valid Spotify playlist URL');
      return;
    }
    
    const newState = { ...appState, spotifyPlaylistUrl: playlistUrl };
    onUpdateState(newState);
    setShowPlaylistManagement(true);
    alert('Playlist URL saved!');
  };

  const generatePlaylistTracks = () => {
    const tracksWithSpotify = appState.recommendations.filter(rec => rec.spotifyLink);
    
    if (tracksWithSpotify.length === 0) {
      alert('No recommendations with Spotify links found.');
      return;
    }
    
    const trackList = tracksWithSpotify.map((rec, index) => {
      const trackId = rec.spotifyLink?.match(/track\/([a-zA-Z0-9]+)/)?.[1];
      return `${index + 1}. ${rec.title}\n   ${rec.spotifyLink}\n   Track ID: ${trackId || 'N/A'}`;
    }).join('\n\n');
    
    navigator.clipboard.writeText(trackList).then(() => {
      alert(`Track list copied to clipboard!\n\n${tracksWithSpotify.length} tracks ready for your Spotify playlist.`);
    }).catch(() => {
      console.log('Track list:', trackList);
      alert('Track list generated! Check console for details.');
    });
  };

  const tracksWithSpotify = appState.recommendations.filter(rec => rec.spotifyLink).length;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-95">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
        📅 Subscribe to SoundStories
      </h2>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <h3 className="text-indigo-700 font-bold text-lg mb-4 flex items-center gap-2">
            🎵 Get Weekly Music Discoveries
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Subscribe once and receive curated music recommendations with stories every week. 
            New songs will automatically appear in your calendar app.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-2">Copy the calendar link below</div>
                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm break-all text-gray-700">
                  {calendarUrl}
                </div>
                <button
                  onClick={copyCalendarUrl}
                  className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
                >
                  📋 Copy Calendar Link
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-2">Add to your calendar app:</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><strong>📱 iPhone/iPad:</strong> Settings → Calendar → Accounts → Add Account → Other → Add Subscribed Calendar</div>
                  <div><strong>🖥️ Google Calendar:</strong> Left sidebar → Other calendars → + → From URL</div>
                  <div><strong>💻 Outlook:</strong> File → Account Settings → Internet Calendars → New</div>
                  <div><strong>🍎 Mac Calendar:</strong> File → New Calendar Subscription</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <div>
                <div className="font-semibold text-gray-700">Enjoy weekly discoveries!</div>
                <div className="text-sm text-gray-600">New recommendations appear automatically every Friday at 7 AM PT</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="testEmail" className="block text-sm font-semibold text-gray-700 mb-2">
            📧 Test Email Preview
          </label>
          <input
            type="email"
            id="testEmail"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
          />
          <button
            onClick={sendTestEmail}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Send Preview
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            🎧 SoundStories Spotify Playlist
          </h4>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="playlistUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                Spotify Playlist URL
              </label>
              <input
                type="url"
                id="playlistUrl"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://open.spotify.com/playlist/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
              <button
                onClick={savePlaylistUrl}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Save Playlist
              </button>
            </div>

            {showPlaylistManagement && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h5 className="text-green-700 font-semibold mb-3">📋 Playlist Management</h5>
                <div className="text-gray-700 text-sm mb-3">
                  📊 <strong>{tracksWithSpotify}</strong> of <strong>{appState.recommendations.length}</strong> recommendations have Spotify links
                </div>
                <button
                  onClick={generatePlaylistTracks}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                >
                  Generate Track List
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-700 mb-3">📊 Community Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">247</div>
              <div className="text-sm text-gray-600">Active Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{appState.recommendations.length}</div>
              <div className="text-sm text-gray-600">Songs Shared</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
