import React from 'react';
import SectionTitle from '../Common/SectionTitle';
import { BookOpen, FlaskConical, Award, HeartHandshake, ShieldCheck, Trophy, Sparkles, MapPin, Users, ArrowRight } from 'lucide-react';

export default function CampusFacilities({ onOpenTopic, onOpenAdmission, onNavigate }) {
  const facilities = [
    {
      title: 'Science Laboratories',
      subtitle: 'Thegaba, Phezhu Science Campus',
      desc: 'State-of-the-art laboratories for Botany, Zoology, Chemistry, and Physics featuring precision microscopes, chemical analysis benches, and botanical specimen herbariums.',
      icon: <FlaskConical className="w-5 h-5 text-[#4a6b28]" />,
      image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/Science-Block-1-scaled.jpg',
      tag: 'Experimental Learning'
    },
    {
      title: 'Two Campus Libraries',
      subtitle: 'Kohima Arts & Thegaba Science Branches',
      desc: 'Extensive reading halls, rich textbook collections, peer-reviewed scientific journals, encyclopedia archives, and quiet study workstations with book lending facilities.',
      icon: <BookOpen className="w-5 h-5 text-[#4a6b28]" />,
      image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/27ed87be-98ff-4b5c-ac81-1664e600cfc6.jpg',
      tag: 'Knowledge Hub'
    },
    {
      title: 'National Service Scheme (NSS)',
      subtitle: 'Active Unit at Capital College',
      desc: 'Instilling leadership and civic empathy through annual special camps at Mezo Basa, environmental sanitation drives, tree plantations, and youth social welfare activities.',
      icon: <Users className="w-5 h-5 text-[#4a6b28]" />,
      image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/DSC_0764-scaled.jpg',
      tag: 'Community Service'
    },
    {
      title: 'Red Ribbon Club (RRC)',
      subtitle: 'Youth Health & Social Awareness',
      desc: 'Championing HIV/AIDS awareness, voluntary blood group screening drives, and health symposiums under the guidance of state health authorities and NSS nodal officers.',
      icon: <HeartHandshake className="w-5 h-5 text-[#4a6b28]" />,
      image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/WhatsApp-Image-2024-08-16-at-9.02.36-AM-scaled.jpeg',
      tag: 'Health & Welfare'
    },
    {
      title: 'Trifecta & Cultural Festivals',
      subtitle: 'Annual Intra-College Extravaganza',
      desc: 'A celebrated 2-day annual collegiate festival showcasing indigenous traditions, folk songs, musical concerts, culinary arts, fashion revues, and creative arts.',
      icon: <Sparkles className="w-5 h-5 text-[#4a6b28]" />,
      image: 'https://capitalcollege.edu.in/wp-content/uploads/2024/10/DSC_5192-scaled.jpg',
      tag: 'Cultural Pride'
    },
    {
      title: 'Sports Meets & Athletics',
      subtitle: 'Holistic Physical Fitness',
      desc: 'Annual sports meets promoting camaraderie, athletics, football, badminton, and indigenous Naga traditional games with prestigious championship trophies.',
      icon: <Trophy className="w-5 h-5 text-[#4a6b28]" />,
      image: 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/DSC_3190-scaled.jpg',
      tag: 'Sports Excellence'
    }
  ];

  return (
    <section id="facilities-section" className="py-16 bg-[#fbfbfb] border-b border-gray-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionTitle
          eyebrow="INFRASTRUCTURE & STUDENT LIFE"
          title="Campus Life & Facilities"
          subtitle="World-class academic infrastructure, modern laboratories, and holistic student development environments."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 sm:mt-8">
          {facilities.map((f, idx) => (
            <div
              key={idx}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 card-interactive card-accent-top animate-card-in flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out filter brightness-[0.93]"
                    onError={(e) => {
                      e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2023/05/1a.jpg';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-[#002858]/85 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border border-white/20 group-hover:border-[#4a6b28]/60 transition-colors">
                    {f.tag}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="icon-hover-float p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[#4a6b28]">
                      {f.icon}
                    </div>
                    <h3 className="text-base font-bold text-[#002858] group-hover:text-[#4a6b28] transition-colors">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-[11px] font-semibold text-[#4a6b28] mb-2">
                    {f.subtitle}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">
                    {f.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onOpenTopic(f.title.toLowerCase().includes('library') ? 'library' : 'committees')}
                  className="text-xs font-bold text-[#002858] group-hover:text-[#4a6b28] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Learn More</span>
                  <ArrowRight size={13} className="arrow-hover-slide text-[#4a6b28]" />
                </button>
                <span className="text-[10px] text-gray-400 font-medium">CCHE Kohima</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
