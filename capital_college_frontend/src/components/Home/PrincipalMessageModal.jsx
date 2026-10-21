import React, { useState, useEffect } from 'react';
import { X, Award, GraduationCap } from 'lucide-react';

export default function PrincipalMessageModal({ isOpen, onClose }) {
  const defaultData = {
    name: 'Dr. Zokho Venuh',
    designation: 'Principal, Capital College of Higher Education',
    qualification: 'M.A., Ph.D. • Nagaland University',
    imageUrl: 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403-1024x1024.jpg'
  };

  const [principal, setPrincipal] = useState(() => {
    try {
      const saved = localStorage.getItem('cche_principal_settings');
      if (saved) {
        const s = JSON.parse(saved);
        return {
          name: s.name || defaultData.name,
          designation: s.designation || defaultData.designation,
          qualification: s.qualification || defaultData.qualification,
          imageUrl: s.imageUrl || defaultData.imageUrl
        };
      }
      return defaultData;
    } catch {
      return defaultData;
    }
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          const s = data.settings;
          setPrincipal((prev) => ({
            ...prev,
            name: s.principal_name || prev.name,
            designation: s.principal_designation || prev.designation,
            qualification: s.principal_qualification || prev.qualification,
            imageUrl: s.principal_image_url || prev.imageUrl
          }));
        }
      })
      .catch(() => {});

    const handleUpdate = (e) => {
      if (e && e.detail) {
        setPrincipal((prev) => ({
          ...prev,
          name: e.detail.name || prev.name,
          designation: e.detail.designation || prev.designation,
          qualification: e.detail.qualification || prev.qualification,
          imageUrl: e.detail.imageUrl || prev.imageUrl
        }));
      }
    };
    window.addEventListener('principal-settings-updated', handleUpdate);
    return () => window.removeEventListener('principal-settings-updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn my-8">
        <div className="bg-[#002858] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#4a6b28]">
          <div>
            <h3 className="font-bold text-lg md:text-xl">Principal's Address</h3>
            <p className="text-xs text-gray-300">Capital College of Higher Education, Kohima</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-300 hover:text-white p-1 rounded-full cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-4 max-h-[75vh] overflow-y-auto text-gray-700 text-xs md:text-sm leading-relaxed text-justify">
          <div className="flex items-center gap-4 bg-emerald-50/70 p-4 rounded-lg border border-emerald-200">
            <img
              src={principal.imageUrl || 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403-1024x1024.jpg'}
              alt={principal.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#4a6b28] shadow"
              onError={(e) => {
                e.target.src = 'https://capitalcollege.edu.in/wp-content/uploads/2024/06/IMG20240604134403.jpg';
              }}
            />
            <div>
              <h4 className="font-bold text-base text-[#002858]">{principal.name}</h4>
              <p className="text-xs text-[#4a6b28] font-semibold">{principal.designation}</p>
              {principal.qualification && (
                <p className="text-[11px] text-gray-500">{principal.qualification}</p>
              )}
            </div>
          </div>

          <p>
            <strong>The Capital College of Higher Education</strong>, formally known as <strong>Nation Academy of Higher Education</strong>, was established in 2004 on 20th August. The College initially began with 5 regular students and gradually increased year after year because of the constant effort rendered by the faculty to achieve the goal of the college, keeping in mind to help and give opportunities to all students.
          </p>

          <p>
            Capital College of Higher Education is permanently affiliated to Nagaland University and recognized by the University Grants Commission (UGC) under Section 2(f) and 12(B) of the UGC Act of 1956. We maintain two dedicated campuses: the Arts campus in the capital town below the State Library at P.R. Hill, and the scenic Science campus at Thegaba, Phezhu, Jotsoma.
          </p>

          <p>
            In order to provide the most effective and motivating teaching-learning experience to the students, the college maintains an intimate student-teacher ratio of about <strong>10:1</strong>. Our state-of-the-art laboratories in Botany, Zoology, Chemistry, and Physics, coupled with modern seminar libraries and digital learning spaces, ensure total quality education delivered by experienced, qualified, and dedicated teachers.
          </p>

          <p>
            Seventeen batches have now graduated from the college. We take tremendous pride in seeing our alumni serve as civil servants, scholars, educators, entrepreneurs, and community leaders across the country. Our focus extends beyond academic laurels to character development, ethical grounding, and civic responsibility through the NSS, Red Ribbon Club, and student bodies.
          </p>
        </div>

        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#4a6b28] text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#3d5920] transition-colors cursor-pointer"
          >
            Close Address
          </button>
        </div>
      </div>
    </div>
  );
}
