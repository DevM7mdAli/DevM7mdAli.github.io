import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MotionFooter } from "../utils/motion";
import { useTranslation } from "react-i18next";

type FooterProps = {
  linkedLink: string;
  GitHubLink: string;
  XLink: string;
  Email: string;
};
export default function Footer({
  linkedLink,
  GitHubLink,
  XLink,
  Email,
}: FooterProps) {
  const { t } = useTranslation();
  return (
    <MotionFooter
      className="w-full p-8 mt-20 bg-app-surface"
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12  text-center md:justify-between">
        <a href="/" className="flex justify-center items-center md:w-24 w-16">
          <img src={'/DMA.png'} alt="logo" className="logo-themable" />
        </a>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
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
      <hr className="my-8 border-white-50" />
      <p className="text-app text-center font-normal">
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </p>
    </MotionFooter>
  );
}
