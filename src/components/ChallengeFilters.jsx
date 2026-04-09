import { useState } from 'react';

const ChallengeFilters = ({ onFilterChange, filters }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const difficulties = [
    { name: 'All', color: 'transparent' },
    { name: 'Easy', color: '#22C55E', borderColor: 'border-[#22C55E]' },
    { name: 'Medium', color: '#F59E0B', borderColor: 'border-[#F59E0B]' },
    { name: 'Hard', color: '#EF4444', borderColor: 'border-[#EF4444]' }
  ];

  const categories = [
    'All', 'UI/UX', 'Full-Stack', 'API Design', 'Open Innovation'
  ];

  const getDifficultyStyle = (diff) => {
    if (diff === 'All') {
      return filters.difficulty === 'All' 
        ? 'bg-white/10 text-white border-white/30' 
        : 'text-muted border-white/10 hover:text-white';
    }
    const colors = {
      Easy: { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]', border: 'border-[#22C55E]' },
      Medium: { bg: 'bg-[#F59E0B]/15', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]' },
      Hard: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]', border: 'border-[#EF4444]' }
    };
    const c = colors[diff];
    return filters.difficulty === diff 
      ? `${c.bg} ${c.text} ${c.border}` 
      : `text-muted ${c.border}/50 hover:${c.text}`;
  };

  const handleClear = () => {
    onFilterChange({ difficulty: 'All', category: 'All' });
    setSearchQuery('');
  };

  return (
    <div className="bg-bg2/40 border-y border-white/[0.05] py-6">
      <div className="section-container">
        {/* Row 1 - Difficulty */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-muted text-sm font-medium mr-2">Difficulty:</span>
          {difficulties.map((diff) => (
            <button
              key={diff.name}
              onClick={() => onFilterChange({ ...filters, difficulty: diff.name })}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 ${getDifficultyStyle(diff.name)}`}
            >
              {diff.name}
            </button>
          ))}
        </div>

        {/* Row 2 - Category + Search */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted text-sm font-medium mr-2">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: cat })}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                  filters.category === cat
                    ? 'bg-teal/15 text-teal border-teal'
                    : 'text-muted border-white/10 hover:text-teal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-muted focus:border-teal focus:outline-none transition-colors"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={handleClear}
              className="text-muted text-sm hover:text-teal transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFilters;
