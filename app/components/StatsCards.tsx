interface StatsCardsProps {
  totalRecommendations: number;
  totalSubscribers: number;
  thisWeek: number;
}

export function StatsCards({ totalRecommendations, totalSubscribers, thisWeek }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center text-white border border-white/20">
        <div className="text-3xl font-bold mb-2">{totalRecommendations}</div>
        <div className="text-white/80">Total Recommendations</div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center text-white border border-white/20">
        <div className="text-3xl font-bold mb-2">{totalSubscribers}</div>
        <div className="text-white/80">Calendar Subscribers</div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center text-white border border-white/20">
        <div className="text-3xl font-bold mb-2">{thisWeek}</div>
        <div className="text-white/80">This Week's Plays</div>
      </div>
    </div>
  );
}
