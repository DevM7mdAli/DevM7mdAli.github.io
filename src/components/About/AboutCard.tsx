import { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MotionDiv, MotionSection } from "../../utils/motion";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useTranslation } from "react-i18next";

type AboutCardProps = {
  about: string; //? translation key
  resumeLink: string;
  linkedLink: string;
  GitHubLink: string;
  XLink: string;
  Email: string;
};

export default function AboutCard({
  about,
  resumeLink,
  linkedLink,
  GitHubLink,
  XLink,
  Email,
}: AboutCardProps) {
  const viewRef = useRef<HTMLDivElement>(null)
  const inView = useInView(viewRef, { margin: "-10% 0px" })
  const images = ['/1.png', '/2.png', '/3.png', '/4.png', '/5.png']
  const [image, setImage] = useState(images[0])
  const { t, i18n } = useTranslation();
  const titles = t("about.titleCycle", { returnObjects: true }) as string[];
  const sequence = titles.flatMap((s, i) => [s, i === 0 ? 2500 : 2000]);

  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setImage(images[Math.floor(Math.random() * images.length)])
    }, 3000)

    return () => clearInterval(interval)
  }, [inView])

  return (
    <MotionSection
      className="flex flex-col items-center"
      id="AboutMe"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}
      viewport={{ once: true }}
    >
      <TypeAnimation
        key={i18n.language}
        sequence={sequence}
        wrapper="div"
        cursor={true}
        repeat={Infinity}
        className="text-3xl mb-9"
      />

      <div className="flex flex-col lg:flex-row p-9 gap-x-12 max-w-7xl h-auto border-blue-200 gradient-card rounded-lg transition-all scale-95 hover:scale-100">
        <div ref={viewRef} className="flex justify-center items-center bg-opacity-5 bg-white w-full min-h-[370px] lg:min-h-[200px] lg:w-1/6 flex-shrink-0 rounded-lg">
          <AnimatePresence mode="wait">
            <motion.img
              initial={{ opacity: 0, scale: 0, rotate: -15, y: -10 }}
              animate={{ opacity: 1, scale: 1.1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 15, y: 10 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 50,
                duration: 1,
              }}
              src={image}
              key={image}
              className={`w-auto h-auto  rounded-lg transition-transform scale-100`}
              alt="Random picture"
            />
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-center gap-y-7">
          <div className="text-sm xl:text-lg">{t(about)}</div>

          <hr />

          <div className="flex flex-col items-center gap-y-8 sm:flex-row gap-x-8">
            <MotionDiv className="flex" whileHover={{ scale: 1.1 }}>
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl btn-primary px-3 py-2 text-lg font-bold"
              >
                {t("about.download")}
              </a>
            </MotionDiv>
            <div className="flex gap-x-8">
              <a href={XLink} target="_blank" rel="noopener noreferrer">
                <FaSquareXTwitter size={32} />
              </a>
              <a href={GitHubLink} target="_blank" rel="noopener noreferrer">
                <FaGithub size={32} />
              </a>
              <a href={linkedLink} target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={32} />
              </a>
              <a href={Email}>
                <MdEmail size={32} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
