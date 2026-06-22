import React from 'react';
import { useLanguage } from '../components/LanguageContext.jsx';
import { Sparkles, Trophy, Leaf } from 'lucide-react';

const About = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Header Banner */}
      <section className="bg-earth text-cream-light py-20 text-center relative border-b-4 border-gold select-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600')` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-gold uppercase tracking-widest text-xs font-bold font-sans">Weaving Generations</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">Our Legacy & Heritage</h1>
          <div className="h-0.5 bg-gold w-16 mx-auto mt-2" />
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-sm leading-relaxed text-gray-600 font-light">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-earth font-bold">The House of Anusree Tex</h3>
          <p>
            {language === 'en'
              ? 'Founded in Kanchipuram, the city of thousand temples, Anusree Tex is dedicated to preserving the fine art of Tamil handloom weaving. For over three generations, our master weavers have crafted the finest veshtis, representing pure elegance and luxury.'
              : 'ஆயிரம் கோவில்களின் நகரமான காஞ்சிபுரத்தில் நிறுவப்பட்ட அனுஸ்ரீ டெக்ஸ், தமிழ் கைத்தறி நெசவு கலையை பாதுகாக்கும் நோக்கில் செயல்படுகிறது. மூன்று தலைமுறைகளுக்கும் மேலாக, எங்கள் நெசவாளர்கள் பிரீமியம் வேஷ்டிகளை வடிவமைக்கிறார்கள்.'}
          </p>
          <p>
            {language === 'en'
              ? 'Our collection is built on the pillars of pure materials, certified gold and silver zari, and meticulous craftsmanship. Every thread tells a story of patience, skill, and heritage.'
              : 'தூய மூலப்பொருட்கள், சோதிக்கப்பட்ட தங்க மற்றும் வெள்ளி ஜரிகைகள் மற்றும் சிறந்த கைவினைத்திறன் ஆகியவற்றின் அடிப்படையில் எங்கள் தயாரிப்புகள் உருவாக்கப்படுகின்றன.'}
          </p>
        </div>
        <div className="border-2 border-gold/25 p-2 rounded-lg bg-cream">
          <img
            src="https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600"
            alt="Tamil Weavers"
            className="rounded object-cover h-72 w-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
            }}
          />
        </div>
      </section>

      {/* Core Values (Three Cards) */}
      <section className="bg-cream/40 border-y border-gold/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl font-bold text-earth uppercase tracking-wide">Our Guiding Pillars</h2>
            <div className="h-0.5 bg-gold w-16 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gold/15 p-8 rounded-lg shadow-sm text-center space-y-3">
              <div className="bg-gold/15 text-gold-dark p-3 rounded-full w-fit mx-auto">
                <Sparkles size={24} />
              </div>
              <h4 className="font-bold text-earth text-sm uppercase tracking-wide">Uncompromised Luxury</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">We source certified 100% pure Mulberry silk and high-twist long staple Giza cotton to provide a texture that looks royal and feels like clouds.</p>
            </div>
            <div className="bg-white border border-gold/15 p-8 rounded-lg shadow-sm text-center space-y-3">
              <div className="bg-gold/15 text-gold-dark p-3 rounded-full w-fit mx-auto">
                <Trophy size={24} />
              </div>
              <h4 className="font-bold text-earth text-sm uppercase tracking-wide">Preserving Artisan Legacies</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Every purchase provides direct fair trade wages and supports handloom co-operatives, helping generational weaving families sustain their heritage craft.</p>
            </div>
            <div className="bg-white border border-gold/15 p-8 rounded-lg shadow-sm text-center space-y-3">
              <div className="bg-gold/15 text-gold-dark p-3 rounded-full w-fit mx-auto">
                <Leaf size={24} />
              </div>
              <h4 className="font-bold text-earth text-sm uppercase tracking-wide">Sustainable Handweaving</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed">Our weaving looms run purely on mechanical handloom drives. We utilize plant-based starches and certified safe organic coloring dyes.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
