import {
  SiNextdotjs,
  SiFlask,
  SiMysql,
  SiSqlite,
  SiDart,
  SiTypescript,
  SiPython,
  SiAngular,
  SiNestjs,
  SiStrapi,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { FaReact, FaPhp } from "react-icons/fa";
import { RiFlutterFill } from "react-icons/ri";
import { IoLogoJavascript } from "react-icons/io5";
import { MotionDiv } from "../../utils/motion";
import { useTranslation } from "react-i18next";

export default function ListOfSkills() {
  const { t } = useTranslation();

  const listOfSkills = [
    {
      title: "Languages",
      allSkill: [
        { name: "JavaScript", icon: IoLogoJavascript },
        { name: "TypeScript", icon: SiTypescript },
        { name: "Dart", icon: SiDart },
        { name: "python", icon: SiPython },
        { name: "PHP", icon: FaPhp },
      ],
    },
    {
      title: "Front End",
      allSkill: [
        { name: "React JS", icon: FaReact },
        { name: "Angular", icon: SiAngular },
        { name: "React Native", icon: TbBrandReactNative },
        { name: "NextJS", icon: SiNextdotjs },
        { name: "Fluter", icon: RiFlutterFill },
      ],
    },
    {
      title: "Back End",
      allSkill: [
        { name: "FastAPI", icon: SiFastapi },
        { name: "Express JS", icon: SiExpress },
        { name: "NestJS", icon: SiNestjs },
        { name: "Strapi", icon: SiStrapi },
        { name: "Flask", icon: SiFlask },
      ],
    },
    {
      title: "DataBase",
      allSkill: [
        { name: "FireStore", icon: SiFirebase },
        { name: "mySQL", icon: SiMysql },
        { name: "SQLite", icon: SiSqlite },
        { name: "MongoDB", icon: SiMongodb },
        { name: "PostgreSQL", icon: SiPostgresql },
      ],
    },
  ];

  return (
    <MotionDiv
      className="grid grid-cols-2 md:grid md:grid-cols-4  justify-center flex-wrap gap-x-12 text-center"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 1 }}
    >
      {listOfSkills.map(({ title, allSkill }) => (
        <div
          className="flex flex-col gap-y-9 p-4 gradient-card rounded-lg transition-all scale-95 hover:scale-100"
          key={title}
        >
          <h1>{t(`skills.groups.${title}`)}</h1>
          {allSkill.map((skill, index) => {
            return (
              <div key={index}>
                <h2>{skill.name}</h2>
                <div className="flex justify-center">
                  {<skill.icon size={80} />}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </MotionDiv>
  );
}
