import { useState, useEffect } from 'react';

// Load jsPDF from CDN
const loadJSPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => resolve(window.jspdf);
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.body.appendChild(script);
  });
};

const sampleCertificates = [
  {
    id: '1',
    eventName: 'DevFest 2024',
    date: 'December 15, 2024',
    type: 'Winner',
    rank: 1
  },
  {
    id: '2',
    eventName: 'Hackathon 2025',
    date: 'January 20, 2025',
    type: 'Runner-up',
    rank: 2
  },
  {
    id: '3',
    eventName: 'React Workshop',
    date: 'November 10, 2024',
    type: 'Participation',
    rank: null
  },
  {
    id: '4',
    eventName: 'AI Challenge',
    date: 'February 5, 2025',
    type: 'Winner',
    rank: 1
  }
];

const getTypeStyles = (type) => {
  switch (type) {
    case 'Winner':
      return { bg: 'rgba(255,193,7,0.15)', color: '#FFC107', border: 'rgba(255,193,7,0.4)' };
    case 'Runner-up':
      return { bg: 'rgba(192,192,192,0.15)', color: '#C0C0C0', border: 'rgba(192,192,192,0.4)' };
    default:
      return { bg: 'rgba(0,205,184,0.15)', color: '#00CDB8', border: 'rgba(0,205,184,0.4)' };
  }
};

const CertificateCard = ({ cert, onClick }) => {
  const styles = getTypeStyles(cert.type);

  return (
    <div
      className="p-5 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(0,205,184,0.1)'
      }}
      onClick={() => onClick(cert)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold">{cert.eventName}</h3>
        <span
          className="px-2 py-1 rounded-full text-[10px] font-medium"
          style={{
            background: styles.bg,
            color: styles.color,
            border: `1px solid ${styles.border}`
          }}
        >
          {cert.type}
        </span>
      </div>
      
      <p className="text-muted text-sm mb-4">{cert.date}</p>
      
      <button
        className="w-full py-2 rounded-lg text-sm font-medium transition-all"
        style={{
          background: 'transparent',
          border: '1px solid rgba(0,205,184,0.4)',
          color: '#00CDB8'
        }}
        onClick={(e) => { e.stopPropagation(); onClick(cert); }}
      >
        Download PDF
      </button>
    </div>
  );
};

const CertificateModal = ({ cert, isOpen, onClose, userName = 'Alex Johnson' }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadJSPDF();
  }, []);

  if (!isOpen || !cert) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      const { jsPDF } = await loadJSPDF();
      const doc = new jsPDF('landscape', 'mm', 'a4');
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Background
      doc.setFillColor(10, 10, 26);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Border
      doc.setDrawColor(0, 205, 184);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      
      // Header - ClubVerse Logo
      doc.setTextColor(0, 205, 184);
      doc.setFontSize(14);
      doc.text('◆ CLUBVERSE', pageWidth / 2, 30, { align: 'center' });
      
      // Certificate Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont(undefined, 'bold');
      doc.text(`Certificate of ${cert.type}`, pageWidth / 2, 55, { align: 'center' });
      
      // Recipient
      doc.setTextColor(0, 205, 184);
      doc.setFontSize(32);
      doc.text(userName, pageWidth / 2, 85, { align: 'center' });
      
      // Description
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      const actionText = cert.type === 'Winner' ? 'winning' : cert.type === 'Runner-up' ? 'placing as runner-up in' : 'participating in';
      doc.text(`for successfully ${actionText}`, pageWidth / 2, 100, { align: 'center' });
      
      // Event Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(cert.eventName, pageWidth / 2, 115, { align: 'center' });
      
      // Date
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Held on ${cert.date}`, pageWidth / 2, 130, { align: 'center' });
      
      // Badge
      doc.setDrawColor(0, 205, 184);
      doc.setLineWidth(2);
      doc.roundedRect(pageWidth / 2 - 20, 145, 40, 40, 10, 10);
      doc.setTextColor(0, 205, 184);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(cert.type === 'Winner' ? '🏆' : cert.type === 'Runner-up' ? '🥈' : '✓', pageWidth / 2, 168, { align: 'center' });
      
      // Signature lines
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(40, pageHeight - 40, 100, pageHeight - 40);
      doc.line(pageWidth - 100, pageHeight - 40, pageWidth - 40, pageHeight - 40);
      
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(10);
      doc.text('Club President', 70, pageHeight - 30, { align: 'center' });
      doc.text('Faculty Advisor', pageWidth - 70, pageHeight - 30, { align: 'center' });
      
      // Save
      doc.save(`ClubVerse_Certificate_${cert.eventName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = getTypeStyles(cert.type);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[680px] rounded-2xl p-8 relative"
        style={{
          background: 'rgba(10,10,26,0.95)',
          border: '1px solid rgba(0,205,184,0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-teal text-sm font-medium mb-2">◆ CLUBVERSE</div>
          <h2 className="text-2xl font-bold text-white">Certificate of {cert.type}</h2>
        </div>

        {/* Recipient Name */}
        <div className="text-center mb-4">
          <div className="text-[32px] font-extrabold text-teal mb-2">{userName}</div>
          <p className="text-muted">
            for successfully {cert.type === 'Winner' ? 'winning' : cert.type === 'Runner-up' ? 'placing as runner-up in' : 'participating in'}
          </p>
        </div>

        {/* Event Name */}
        <div className="text-center mb-6">
          <div className="text-xl font-bold text-white">{cert.eventName}</div>
          <p className="text-muted text-sm mt-1">{cert.date}</p>
        </div>

        {/* Digital Badge */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl"
            style={{
              background: 'rgba(0,205,184,0.1)',
              border: `2px solid ${styles.color}`
            }}
          >
            {cert.type === 'Winner' ? '🏆' : cert.type === 'Runner-up' ? '🥈' : '✓'}
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between mb-8">
          <div className="text-center">
            <div className="w-32 h-px bg-white/30 mb-2"></div>
            <p className="text-muted text-xs">Club President</p>
          </div>
          <div className="text-center">
            <div className="w-32 h-px bg-white/30 mb-2"></div>
            <p className="text-muted text-xs">Faculty Advisor</p>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="w-full py-3 rounded-lg font-medium transition-all disabled:opacity-50"
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,205,184,0.5)',
            color: '#00CDB8'
          }}
        >
          {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
        </button>
      </div>
    </div>
  );
};

const Certificates = ({ userName }) => {
  const [selectedCert, setSelectedCert] = useState(null);

  return (
    <section className="section-spacing border-t border-white/[0.05]">
      <div className="section-container">
        {/* Section Heading */}
        <h2 className="text-[clamp(24px,3vw,36px)] font-bold mb-8">
          <span className="text-teal">YOUR</span>
          <span className="text-white"> CERTIFICATES</span>
        </h2>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {sampleCertificates.map((cert) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              onClick={setSelectedCert}
            />
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        cert={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        userName={userName}
      />
    </section>
  );
};

export default Certificates;
