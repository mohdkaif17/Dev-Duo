import SectionHeading from './SectionHeading';
import Reveal from './Reveal';

const SponsorsStrip = () => {
  const sponsors = [
    "Google", "Microsoft", "Amazon", "IBM", "Intel", "NVIDIA"
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-16">
        <SectionHeading accent="SPONSORS">OUR</SectionHeading>
      </div>
      
      {/* SaaS-Style Clean Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 md:gap-16 items-center justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        {sponsors.map((sponsor, idx) => (
          <Reveal key={idx} delay={idx * 50}>
            <div className="group flex flex-col items-center">
                <span className="text-xl md:text-2xl font-black text-white hover:text-teal transition-colors tracking-tighter uppercase">
                    {sponsor}
                </span>
                <div className="w-8 h-0.5 bg-teal/0 group-hover:bg-teal mt-2 transition-all"></div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default SponsorsStrip;
