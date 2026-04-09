import { useState, useEffect, useMemo } from 'react';
import TeamStats from './components/TeamStats';
import TeamFilters from './components/TeamFilters';
import MemberCard from './components/MemberCard';
import MemberModal from './components/MemberModal';
import VideoReels from './components/VideoReels';

// Sample team data
const clubLeads = [
  {
    _id: '1',
    name: 'Alex Johnson',
    designation: 'President',
    role: 'Club President',
    isLead: true,
    batch: '2024',
    skills: ['React', 'Node.js', 'Leadership'],
    github: 'alexj',
    linkedin: 'alexjohnson',
    bio: 'Full-stack developer passionate about building community-driven tech solutions. Leading ClubVerse since 2023.',
    eventsCount: 24,
    challengesCount: 12,
    projectsCount: 8
  },
  {
    _id: '2',
    name: 'Sarah Chen',
    designation: 'Vice President',
    role: 'Vice President',
    isLead: true,
    batch: '2024',
    skills: ['UI/UX', 'Figma', 'Management'],
    github: 'sarahc',
    linkedin: 'sarahchen',
    bio: 'Design enthusiast with a knack for organizing impactful tech events.',
    eventsCount: 18,
    challengesCount: 8,
    projectsCount: 5
  },
  {
    _id: '3',
    name: 'Mike Rodriguez',
    designation: 'Tech Lead',
    role: 'Tech Lead',
    isLead: true,
    batch: '2023',
    skills: ['Python', 'AI/ML', 'DevOps'],
    github: 'miker',
    linkedin: 'mikerodriguez',
    bio: 'AI researcher and backend architect. Building scalable systems for the club.',
    eventsCount: 15,
    challengesCount: 20,
    projectsCount: 6
  }
];

const coreTeam = [
  {
    _id: '4',
    name: 'Emily Davis',
    designation: 'Event Lead',
    batch: '2024',
    skills: ['Event Management', 'Communication'],
    github: 'emilyd',
    linkedin: 'emilydavis',
    eventsCount: 12,
    challengesCount: 3,
    projectsCount: 2
  },
  {
    _id: '5',
    name: 'James Wilson',
    designation: 'Marketing Lead',
    batch: '2024',
    skills: ['Content', 'Social Media', 'Design'],
    github: 'jamesw',
    linkedin: 'jameswilson',
    eventsCount: 10,
    challengesCount: 2,
    projectsCount: 3
  },
  {
    _id: '6',
    name: 'Lisa Park',
    designation: 'Community Lead',
    batch: '2024',
    skills: ['Community', 'Public Speaking'],
    github: 'lisap',
    linkedin: 'lisapark',
    eventsCount: 14,
    challengesCount: 5,
    projectsCount: 2
  },
  {
    _id: '7',
    name: 'David Kim',
    designation: 'DevOps Lead',
    batch: '2023',
    skills: ['Docker', 'AWS', 'CI/CD'],
    github: 'davidk',
    linkedin: 'davidkim',
    eventsCount: 8,
    challengesCount: 4,
    projectsCount: 4
  }
];

const members = [
  {
    _id: '8',
    name: 'Tom Brown',
    designation: 'Developer',
    batch: '2025',
    skills: ['React', 'JavaScript'],
    github: 'tomb',
    linkedin: 'tombrown'
  },
  {
    _id: '9',
    name: 'Amy Lee',
    designation: 'Designer',
    batch: '2025',
    skills: ['Figma', 'Illustrator'],
    github: 'amyl',
    linkedin: 'amylee'
  },
  {
    _id: '10',
    name: 'Chris Davis',
    designation: 'Developer',
    batch: '2025',
    skills: ['Node.js', 'MongoDB'],
    github: 'chrisd',
    linkedin: 'chrisdavis'
  },
  {
    _id: '11',
    name: 'Ryan Garcia',
    designation: 'ML Engineer',
    batch: '2024',
    skills: ['Python', 'TensorFlow'],
    github: 'ryang',
    linkedin: 'ryangarcia'
  },
  {
    _id: '12',
    name: 'Nina Patel',
    designation: 'Designer',
    batch: '2025',
    skills: ['UI/UX', 'Figma'],
    github: 'ninap',
    linkedin: 'nina-patel'
  },
  {
    _id: '13',
    name: 'Sophie Martin',
    designation: 'Frontend Dev',
    batch: '2024',
    skills: ['Vue.js', 'CSS'],
    github: 'sophiem',
    linkedin: 'sophiemartin'
  },
  {
    _id: '14',
    name: 'Jack White',
    designation: 'Backend Dev',
    batch: '2025',
    skills: ['Java', 'Spring'],
    github: 'jackw',
    linkedin: 'jackwhite'
  },
  {
    _id: '15',
    name: 'Emma Wilson',
    designation: 'Data Analyst',
    batch: '2024',
    skills: ['Python', 'SQL'],
    github: 'emmaw',
    linkedin: 'emmawilson'
  }
];

// Alumni data (hardcoded)
const alumniData = [
  { id: 1, name: 'Priya Sharma', designation: 'Full Stack Developer', batch: '2020-2024', company: 'Google', photo: '', skills: ['React', 'Node.js', 'AWS'], github: '', linkedin: '' },
  { id: 2, name: 'Rohan Mehta', designation: 'ML Engineer', batch: '2019-2023', company: 'Microsoft', photo: '', skills: ['Python', 'TensorFlow', 'PyTorch'], github: '', linkedin: '' },
  { id: 3, name: 'Ananya Iyer', designation: 'UI/UX Designer', batch: '2020-2024', company: 'Figma', photo: '', skills: ['Figma', 'Adobe XD', 'CSS'], github: '', linkedin: '' },
  { id: 4, name: 'Karan Das', designation: 'Backend Developer', batch: '2021-2023', company: 'Flipkart', photo: '', skills: ['Java', 'Spring Boot', 'MySQL'], github: '', linkedin: '' },
];

const Team = () => {
  const [filters, setFilters] = useState({ domain: 'All', batch: 'All', search: '' });
  const [showAlumni, setShowAlumni] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
  }, []);

  // Filter function
  const filterMembers = (membersList) => {
    return membersList.filter(member => {
      if (filters.domain !== 'All') {
        const domainMatch = member.skills?.some(skill => {
          const domainMap = {
            'Web Dev': ['React', 'Node.js', 'Vue.js', 'JavaScript', 'CSS', 'HTML'],
            'AI/ML': ['Python', 'TensorFlow', 'ML', 'AI', 'Data'],
            'Design': ['UI/UX', 'Figma', 'Design', 'Illustrator'],
            'DevOps': ['Docker', 'AWS', 'CI/CD', 'Cloud', 'DevOps'],
            'Management': ['Leadership', 'Management', 'Strategy']
          };
          return domainMap[filters.domain]?.includes(skill);
        });
        if (!domainMatch) return false;
      }
      
      if (filters.batch !== 'All' && member.batch !== filters.batch) return false;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = member.name.toLowerCase().includes(searchLower);
        const roleMatch = (member.designation || member.role).toLowerCase().includes(searchLower);
        const skillMatch = member.skills?.some(s => s.toLowerCase().includes(searchLower));
        if (!nameMatch && !roleMatch && !skillMatch) return false;
      }
      
      return true;
    });
  };

  const filteredLeads = useMemo(() => filterMembers(clubLeads), [filters]);
  const filteredCore = useMemo(() => filterMembers(coreTeam), [filters]);
  const filteredMembers = useMemo(() => filterMembers(members), [filters]);
  const filteredAlumni = useMemo(() => filterMembers(alumniData), [filters]);

  const handleEdit = (member) => {
    console.log('Edit member:', member);
  };

  const handleDelete = (member) => {
    if (confirm(`Remove "${member.name}" from the team?`)) {
      console.log('Delete member:', member);
    }
  };

  const allMembers = [...clubLeads, ...coreTeam, ...members];

  // Alumni Card Component
  const AlumniCard = ({ alumni }) => {
    const [isHovered, setIsHovered] = useState(false);
    const initials = alumni.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
      <div
        className="relative rounded-xl p-5 transition-all duration-300 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,205,184,0.1)',
          opacity: isHovered ? 1 : 0.75,
          filter: isHovered ? 'none' : 'saturate(0.65)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Photo Circle with Alumni Badge */}
        <div className="relative mx-auto mb-4">
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl"
            style={{
              background: 'linear-gradient(135deg, #00CDB8 0%, #0A2540 100%)',
              border: '2px solid rgba(0,205,184,0.3)',
            }}
          >
            {initials}
          </div>
          {/* Alumni Badge */}
          <span
            className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500 text-white border border-white/10"
            style={{ right: 'calc(50% - 40px + 10px)' }}
          >
            Alumni
          </span>
        </div>

        {/* Name */}
        <h3 className="text-white font-bold text-center mb-1">{alumni.name}</h3>

        {/* Designation */}
        <p className="text-teal text-sm text-center mb-2">{alumni.designation}</p>

        {/* Batch & Company */}
        <p className="text-muted text-xs text-center mb-1">Batch {alumni.batch}</p>
        <p className="text-white/70 text-xs text-center font-medium">{alumni.company}</p>

        {/* Tooltip on hover */}
        {isHovered && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-bg border border-teal/30 text-xs whitespace-nowrap z-10 shadow-lg">
            <p className="text-white font-medium">Graduated: {alumni.batch}</p>
            <p className="text-teal">Works at: {alumni.company}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-teal/30" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-content min-h-screen bg-bg">
      {/* Hero Stats with Alumni Toggle */}
      <TeamStats showAlumni={showAlumni} onToggleAlumni={() => setShowAlumni(!showAlumni)} />

      {/* Filters */}
      <TeamFilters filters={filters} onFilterChange={setFilters} />

      {/* Admin FAB */}
      {isAdmin && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-teal text-bg rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,205,184,0.4)] hover:scale-110 transition-all duration-300 z-50"
          title="Add Member"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      <div className="section-container py-12 space-y-16">
        {/* Section 1 - Club Leads */}
        {filteredLeads.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-teal uppercase tracking-wider mb-6">Club Leads</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {filteredLeads.map((member, index) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  index={index}
                  size="large"
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={() => setSelectedMember({ ...member, index })}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 2 - Core Team */}
        {filteredCore.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-teal uppercase tracking-wider mb-6">Core Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCore.map((member, index) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  index={index + 3}
                  size="medium"
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={() => setSelectedMember({ ...member, index: index + 3 })}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section 3 - Members */}
        {filteredMembers.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-teal uppercase tracking-wider mb-6">Members</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMembers.map((member, index) => (
                <MemberCard
                  key={member._id}
                  member={member}
                  index={index + 7}
                  size="compact"
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={() => setSelectedMember({ ...member, index: index + 7 })}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Video Reels Section */}
      <section className="py-16 border-t border-white/[0.05]">
        <div className="section-container text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Behind the Scenes</h2>
          <p className="text-muted mb-8">Quick glimpses of our events and activities</p>
          <VideoReels />
        </div>
      </section>

      {/* Alumni Section */}
      {showAlumni && (
        <section className="py-16 border-t border-white/[0.05]">
          <div className="section-container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">Our Alumni</h2>
              <p className="text-muted">Former members who have moved on to great things</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {alumniData.map((alumni) => (
                <AlumniCard key={alumni.id} alumni={alumni} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Member Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="max-w-lg w-full p-8 rounded-2xl bg-bg2 border border-white/10 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Add Member</h2>
            <p className="text-muted mb-6">Member management form coming soon!</p>
            <button 
              onClick={() => setShowAddModal(false)}
              className="px-6 py-2 bg-teal text-bg font-medium rounded-lg hover:shadow-[0_0_20px_rgba(0,205,184,0.4)] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
