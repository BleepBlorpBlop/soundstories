'use client';

import { useState, useEffect } from 'react';

interface SpotifySearchProps {
  onTrackSelect: (track: any) => void;
}

export function SpotifySearch({ onTrackSelect }: SpotifySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    setSpotifyConnected(true);
  }, []);

  const extractSpotifyTrackId = (url: string): string | null => {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.includes('open.spotify.com/track/')) {
      handleSpotifyLink(value);
      return;
    }

    if (value.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchSpotify(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setShowResults(false);
    }
  };

  const handleSpotifyLink = async (url: string) => {
    const trackId = extractSpotifyTrackId(url);
    if (!trackId) return;

    setIsSearching(true);
    try {
      const track = await fetchSpotifyTrack(trackId);
      onTrackSelect(track);
      setShowResults(false);
    } catch (error) {
      console.error('Error fetching Spotify track:', error);
      alert('Error fetching track from Spotify. Please try searching manually.');
    } finally {
      setIsSearching(false);
    }
  };

  const searchSpotify = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const results = await fetchSpotifySearch(query);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Spotify search error:', error);
      setSearchResults([]);
      setShowResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchSpotifyTrack = async (trackId: string) => {
    const demoTracks: { [key: string]: any } = {
      '4iV5W9uYEdYUVa79Axb7Rh': {
        id: '4iV5W9uYEdYUVa79Axb7Rh',
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        album: {
          name: 'A Night at the Opera',
          images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a' }],
          release_date: '1975-11-21'
        },
        external_urls: { spotify: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh' },
        popularity: 87,
        duration_ms: 355000
      }
    };

    return demoTracks[trackId] || {
      id: trackId,
      name: 'Unknown Track',
      artists: [{ name: 'Unknown Artist' }],
      album: {
        name: 'Unknown Album',
        images: [{ url: 'https://via.placeholder.com/300' }],
        release_date: '2000-01-01'
      },
      external_urls: { spotify: `https://open.spotify.com/track/${trackId}` },
      popularity: 50,
      duration_ms: 180000
    };
  };

  const fetchSpotifySearch = async (query: string) => {
    const demoResults = [
      {
        id: '4iV5W9uYEdYUVa79Axb7Rh',
        name: 'Bohemian Rhapsody',
        artists: [{ name: 'Queen' }],
        album: {
          name: 'A Night at the Opera',
          images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a' }],
          release_date: '1975-11-21'
        },
        external_urls: { spotify: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh' },
        popularity: 87,
        duration_ms: 355000
      },
      {
        id: '5CQ30WqJwcep0pYcV4AMNc',
        name: 'Stairway to Heaven',
        artists: [{ name: 'Led Zeppelin' }],
        album: {
          name: 'Led Zeppelin IV',
          images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69' }],
          release_date: '1971-11-08'
        },
        external_urls: { spotify: 'https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc' },
        popularity: 80,
        duration_ms: 482000
      }
    ];

    return demoResults.filter(track =>
      track.name.toLowerCase().includes(query.toLowerCase()) ||
      track.artists[0].name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleResultClick = (track: any) => {
    onTrackSelect(track);
    setShowResults(false);
    setSearchQuery(`${track.name} - ${track.artists[0].name}`);
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => searchResults.length > 0 && setShowResults(true)}
        placeholder="Search Spotify or paste link... (Demo mode)"
        className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl focus:outline-none transition-colors bg-gray-50 focus:bg-white"
      />

      {isSearching && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {searchResults.map((track) => (
            <div
              key={track.id}
              onClick={() => handleResultClick(track)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <img
                src={track.album.images[0]?.url || 'https://via.placeholder.com/40'}
                alt={track.name}
                className="w-10 h-10 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{track.name}</div>
                <div className="text-gray-600 text-xs">
                  {track.artists.map((a: any) => a.name).join(', ')} 
                  {track.album.release_date && ` • ${new Date(track.album.release_date).getFullYear()}`}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {track.popularity || 0}/100
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
