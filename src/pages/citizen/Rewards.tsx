import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../components/ui';
import { MOCK_LEADERBOARD } from '../../data/mockData';
import { Trophy, Star, Medal, Award, Target, Zap, Users, Shield } from 'lucide-react';

const BADGE_DESCRIPTIONS = [
  { icon: '🌟', name: 'First Reporter', desc: 'Filed first complaint', pts: 100 },
  { icon: '🦸', name: 'Community Hero', desc: 'Helped resolve 10+ issues', pts: 500 },
  { icon: '🔥', name: 'Active Citizen', desc: '5 complaints in a month', pts: 200 },
  { icon: '⚡', name: 'Quick Reporter', desc: 'Reported an emergency', pts: 300 },
  { icon: '🏆', name: 'Top Contributor', desc: 'Reached top 10 in leaderboard', pts: 1000 },
  { icon: '💎', name: 'Diamond Citizen', desc: '1000+ points earned', pts: 0 },
  { icon: '🎯', name: 'Precision Reporter', desc: 'Perfect category detection', pts: 150 },
  { icon: '🤝', name: 'Team Player', desc: 'Verified 5 crowd reports', pts: 250 },
];

export const Rewards: React.FC = () => {
  const { user } = useAuthStore();

  const earnedBadgeIds = user?.badges?.map(b => b.name) || [];
  const userRank = MOCK_LEADERBOARD.find(e => e.name === user?.name)?.rank || 'N/A';

  const nextMilestone = [500, 1000, 2000, 5000].find(m => m > (user?.points || 0)) || 5000;
  const progress = Math.min(100, Math.round(((user?.points || 0) / nextMilestone) * 100));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rewards & Badges</h1>
        <p className="text-gray-500 text-sm mt-1">Earn points and badges by participating in civic improvement</p>
      </div>

      {/* Points Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-sm">Total Civic Points</p>
            <p className="text-5xl font-bold mt-1">{user?.points?.toLocaleString()}</p>
            <p className="text-yellow-100 text-sm mt-2">Rank #{userRank} in {user?.city}</p>
          </div>
          <Trophy size={64} className="text-yellow-200" />
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-sm text-yellow-100 mb-2">
            <span>{user?.points} pts</span>
            <span>{nextMilestone} pts to next milestone</span>
          </div>
          <div className="bg-white/20 rounded-full h-3">
            <div className="bg-white rounded-full h-3 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Medal size={20} className="text-yellow-500" /> Your Badges ({user?.badges?.length || 0})
        </h2>
        {user?.badges?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No badges yet. Start reporting issues to earn badges!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {user?.badges?.map(badge => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center"
              >
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-sm font-semibold text-gray-800 mt-2">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* All Available Badges */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award size={20} className="text-blue-500" /> Available Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGE_DESCRIPTIONS.map(badge => {
            const earned = earnedBadgeIds.includes(badge.name);
            return (
              <div key={badge.name} className={`rounded-xl p-4 text-center border-2 ${earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <span className={`text-3xl ${!earned ? 'grayscale' : ''}`}>{badge.icon}</span>
                <p className="text-xs font-semibold text-gray-800 mt-2">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                {badge.pts > 0 && <p className="text-xs text-blue-600 font-bold mt-1">+{badge.pts} pts</p>}
                {earned && <p className="text-xs text-green-600 font-bold mt-1">✅ Earned</p>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" /> City Leaderboard
        </h2>
        <div className="space-y-3">
          {MOCK_LEADERBOARD.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-4 p-3 rounded-xl ${entry.name === user?.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                entry.rank === 2 ? 'bg-gray-200 text-gray-600' :
                entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                'bg-blue-50 text-blue-600'
              }`}>
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${entry.name === user?.name ? 'text-blue-700' : 'text-gray-900'}`}>
                  {entry.name} {entry.name === user?.name && '(You)'}
                </p>
                <p className="text-xs text-gray-500">{entry.ticketsReported} reports · {entry.badges} badges</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{entry.points.toLocaleString()}</p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* How to earn */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3">💡 How to Earn Points</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { action: 'Submit a complaint', pts: '+50 pts', icon: '📋' },
            { action: 'Complaint resolved', pts: '+100 pts', icon: '✅' },
            { action: 'Report emergency', pts: '+150 pts', icon: '🚨' },
            { action: 'Give feedback', pts: '+50 pts', icon: '⭐' },
            { action: 'Crowd report verified', pts: '+75 pts', icon: '👥' },
            { action: 'Daily login streak', pts: '+10 pts/day', icon: '🔥' },
          ].map(item => (
            <div key={item.action} className="flex items-center gap-2 text-sm">
              <span>{item.icon}</span>
              <span className="text-blue-800 flex-1">{item.action}</span>
              <span className="font-bold text-blue-600">{item.pts}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
