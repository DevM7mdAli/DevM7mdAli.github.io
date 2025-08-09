import InfoPart from "./InfoPart.jsx";
import { useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { motion } from "framer-motion";
import app from '../../firebase'
import Loading from "../Loading";
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export default function ProjectCard() {
  const [selectedTag, setSelectedTag] = useState('All');
  const { t } = useTranslation();

  const { data: dataProject = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, 'Projects'));
      const projects = [];
      querySnapshot.forEach((d) => projects.push(d.data()));
      return projects;
    },
  });

  const tags = [t('projects.all'), ...new Set(dataProject.map((p) => p.tag))];


  return (
    <section id="projects">
      <div className='flex flex-col gap-y-9 text-center'>
        <h1 className="text-5xl font-bold">{t('projects.title')}</h1>

        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 border ${selectedTag === tag ? 'bg-gray-300 text-black' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {!isLoading ? (
          <motion.div className='flex flex-row justify-center flex-wrap gap-x-12 gap-y-10'
            initial={{ opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.1, type: "spring", stiffness: 80 }}
          >
            {dataProject.filter((project) => selectedTag === t('projects.all') || project.tag === selectedTag)
              .map((project, index) => (
                <InfoPart
                  key={index}
                  img={project.img}
                  tag={project.tag}
                  name={project.name}
                  stacks={project.stacks}
                  info={project.about}
                  object={project.object}
                  link={project.link}
                />
              ))}
          </motion.div>
        ) : (
          <div className="flex flex-row justify-center items-center flex-wrap">
            <Loading typeLoad={'balls'} />
          </div>
        )}
      </div>
    </section>
  )
}
