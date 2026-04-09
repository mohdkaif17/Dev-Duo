import { useState } from 'react';

const domainOptions = ['All', 'Web Dev', 'AI/ML', 'Design', 'DevOps', 'Management'];
const batchOptions = ['All', '2025', '2024', '2023', '2022', '2021'];

const TeamFilters = ({ filters, onFilterChange }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  const handleDomainClick = (domain) => {
    onFilterChange({ ...filters, domain });
  };

  return (
    <section className="border-b border-white/[0.05] bg-bg/80 backdrop-blur-xl sticky top-[72px] z-40">
      <div className="section-container py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Domain Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {domainOptions.map((domain) => {
              const isActive = filters.domain === domain;
              return (
                <button
                  key={domain}
                  onClick={() => handleDomainClick(domain)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150"
                  style={{
                    background: isActive ? 'rgba(0, 205, 184, 0.15)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(0, 205, 184, 0.6)' : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? '#00CDB8' : 'rgba(255,255,255,0.7)'
                  }}
                >
                  {domain}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* Batch Dropdown */}
            <div className="relative">
              <select
                value={filters.batch}
                onChange={(e) => onFilterChange({ ...filters, batch: e.target.value })}
                className="appearance-none px-4 py-2 pr-10 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal/50 cursor-pointer hover:bg-white/[0.08] transition-colors"
              >
                {batchOptions.map(batch => (
                  <option key={batch} value={batch} className="bg-bg text-white">{batch === 'All' ? 'Batch' : batch}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Search Input */}
            <div 
              className="relative"
              style={{
                boxShadow: searchFocused ? '0 0 20px rgba(0, 205, 184, 0.2)' : 'none',
                borderRadius: '8px',
                transition: 'box-shadow 0.3s ease'
              }}
            >
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                style={{ color: searchFocused ? '#00CDB8' : 'rgba(255,255,255,0.5)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search members..."
                value={filters.search}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-10 pr-4 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-teal/50 w-48 md:w-64 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamFilters;
