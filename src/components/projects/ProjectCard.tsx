import InfoPart from "./InfoPart";
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { MotionDiv } from "../../utils/motion";
import app from "../../firebase";
import Loading from "../Loading";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

type Project = {
  img: string;
  tag: string;
  arTag: string;
  name: string;
  arName: string;
  stacks: string[];
  arStack: string[];
  about: string;
  arAbout: string;
  object?: boolean;
  link: string;
};

export default function ProjectCard() {
  const { t, i18n } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string>(t("projects.all"));

  //! to insure that language will go back to select to all after changing lang
  useEffect(() => {
    setSelectedTag(t("projects.all"));
  }, [i18n.language]);

  const { data: dataProject = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "Projects"));
      const projects: Project[] = [];
      querySnapshot.forEach((d) => projects.push(d.data() as Project));
      return projects;
    },
  });

  const tags: string[] = [
    t("projects.all"),
    ...Array.from(
      new Set(
        dataProject.map((p) => (i18n.language === "en" ? p.tag : p.arTag)),
      ),
    ),
  ];

  return (
    <section id="projects">
      <div className="flex flex-col gap-y-9 text-center">
        <h1 className="text-5xl font-bold">{t("projects.title")}</h1>

        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 border ${selectedTag === tag ? "bg-gray-300 text-black" : ""}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {!isLoading ? (
          <MotionDiv
            className="flex flex-row justify-center flex-wrap gap-x-12 gap-y-10"
            initial={{ opacity: 0, y: -5 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 2,
              delay: 0.1,
              type: "spring",
              stiffness: 80,
            }}
          >
            {dataProject
              .filter(
                (project) =>
                  selectedTag === t("projects.all") ||
                  (i18n.language === "en"
                    ? project.tag === selectedTag
                    : project.arTag === selectedTag),
              )
              .map((project, index) => (
                <InfoPart
                  key={index}
                  img={project.img}
                  tag={i18n.language === "en" ? project.tag : project.arTag}
                  name={i18n.language === "en" ? project.name : project.arName}
                  stacks={
                    i18n.language === "en" ? project.stacks : project.arStack
                  }
                  info={
                    i18n.language === "en" ? project.about : project.arAbout
                  }
                  object={project.object}
                  link={project.link}
                />
              ))}
          </MotionDiv>
        ) : (
          <div className="flex flex-row justify-center items-center flex-wrap">
            <Loading typeLoad={"balls"} />
          </div>
        )}
      </div>
    </section>
  );
}
