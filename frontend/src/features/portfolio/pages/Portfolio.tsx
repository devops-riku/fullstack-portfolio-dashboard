import { useEffect, useState } from 'react';
import { getProjects, type Project } from '../../projects/api';
import { getExperiences, type Experience as Exp } from '../../experience/api';
import { getSkills, type Skill } from '../../skills/api';
import { getProfile, type Profile } from '../profileApi';
import { Hero } from '../components/Hero';
import { TechStack } from '../components/TechStack';
import { Projects } from '../components/Projects';
import { Experience } from '../components/Experience';
import { Contact } from '../components/Contact';
import { ProjectModal } from '../components/ProjectModal';

export const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Exp[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      getProjects().then((d) => active && setProjects(d)),
      getExperiences().then((d) => active && setExperiences(d)),
      getSkills().then((d) => active && setSkills(d)),
      getProfile().then((d) => active && setProfile(d)),
    ]).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-paper font-sans selection:bg-sky-100 dark:selection:bg-sky-900/30">
      <div className="mx-auto max-w-5xl space-y-24 px-6 pb-12">
        <Hero profile={profile} />
        <TechStack skills={skills} />
        <Projects projects={projects} loading={loading} onOpen={setSelected} />
        <Experience experiences={experiences} loading={loading} />
        <Contact profile={profile} />
        <footer className="pb-12 text-center font-mono text-[10px] uppercase tracking-[0.4em] text-gray-400 opacity-50">
          &copy; {new Date().getFullYear()} {profile?.full_name || 'RIKU'} &bull; DESIGNED FOR PERFORMANCE
        </footer>
      </div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
