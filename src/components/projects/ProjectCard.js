import InfoPart from "./InfoPart";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { motion } from "framer-motion";
import app from '../../firebase'
import Loading from "../Loading";

export default function ProjectCard() {
  const [dataProject, setDataProject] = useState([]);
  const [finishLoad, setFinishLoad] = useState(false);
  const [selectedTag, setSelectedTag] = useState('All');

  const fetchData = async () => {
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "Projects"));
    const projects = []
    querySnapshot.forEach((doc) => {
      projects.push(doc.data());
    });
    setDataProject(projects);
    setFinishLoad(true)
  };

  useEffect(() => {
    fetchData();
  }, []);


  const tags = ['All', ...new Set(dataProject.map((p) => p.tag))];


  return (
    <section id="projects">
      <div className='flex flex-col gap-y-9 text-center'>
        <h1 className="text-5xl font-bold">Projects I worked on</h1>

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

        {finishLoad ? (
          <motion.div className='flex flex-row justify-center flex-wrap gap-x-12 gap-y-10'
            initial={{ opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.1, type: "spring", stiffness: 80 }}
          >
            {dataProject.filter((project) => selectedTag === 'All' || project.tag === selectedTag)
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