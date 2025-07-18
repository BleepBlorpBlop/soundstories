'use client';

import { Recommendation } from './SoundStoriesApp';

interface RecommendationsListProps {
  recommendations: Recommendation[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Recommendation>) => void;
}

export function RecommendationsList({ recommendations, onDelete, onUpdate }: RecommendationsListProps) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this recommendation?')) {
      onDelete(id);
    }
  };

  const now = new Date();
  
  // Split recommendations into upcoming and past
  const upcomingRecommendations = recommendations
    .filter(rec => new Date(rec.scheduledDate) > now)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    
  const pastRecommendations = recommendations
    .filter(rec => new Date(rec.scheduledDate) <= now)
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  const RecommendationCard = ({ rec, isPast }: { rec: Recommendation, isPast: boolean }) => (
    <div className={`border-2 rounded-2xl p-6 ${isPast ? 'border-gray-200 bg-gray-50' : 'border-indigo-200 bg-indigo-50'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{rec.title}</h3>
          <div className={`text-sm ${isPast ? 'text-gray-500' : 'text-indigo-600 font-semibold'}`}>
            {isPast ? 'Published: ' : 'Scheduled: '}
            {new Date(rec.scheduledDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        <button
          onClick={() => handleDelete(rec.id)}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">{rec.story}</p>
      
      <img 
        src={rec.image} 
        alt={rec.title} 
        className="w-full max-w-sm h-32 object-cover rounded-lg mb-4" 
      />
      
      <div className="flex gap-2 text-xs">
        {rec.spotifyLink && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🎧 Spotify</span>
        )}
        {rec.youtubeLink && (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">📺 YouTube</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Upcoming Recommendations */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-95">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
          📅 Upcoming Recommendations ({upcomingRecommendations.length})
        </h2>
        
        {upcomingRecommendations.length === 0 ? (
          <p className="text-center text-gray-500 italic py-8">
            No upcoming recommendations scheduled.
          </p>
        ) : (
          <div className="grid gap-6">
            {upcomingRecommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} isPast={false} />
            ))}
          </div>
        )}
      </div>

      {/* Recommendation History */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl backdrop-blur-sm bg-opacity-95">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-3">
          📝 Recommendation History ({pastRecommendations.length})
        </h2>
        
        {pastRecommendations.length === 0 ? (
          <p className="text-center text-gray-500 italic py-8">
            No published recommendations yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {pastRecommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} isPast={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
