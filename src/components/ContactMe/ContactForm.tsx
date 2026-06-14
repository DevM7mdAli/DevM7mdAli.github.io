import { useForm, ValidationError } from "@formspree/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

type ContactFormData = {
  email: string;
  message: string;
};

const CONTACT_LINKS = [
  {
    href: "https://www.linkedin.com/in/mohammed-alajmi-b5a327206/",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
  {
    href: "https://github.com/DevM7mdAli",
    icon: FaGithub,
    label: "GitHub",
  },
  {
    href: "https://twitter.com/DevM7mdAli",
    icon: FaSquareXTwitter,
    label: "X / Twitter",
  },
  {
    href: "mailto:Mohammed-Alajmi@outlook.sa",
    icon: MdEmail,
    label: "Email",
  },
];

export default function ContactForm() {
  const [state, handleSubmit] = useForm<ContactFormData>("mnnavlzy");
  const { t } = useTranslation();

  if (state.succeeded) {
    return (
      <motion.div
        className="flex flex-col items-center gap-5 py-16 text-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <FaCheckCircle size={52} style={{ color: "var(--color-text)" }} />
        <p
          className="text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("contact.received")}
        </p>
        <p style={{ color: "var(--color-muted)" }}>
          I'll get back to you as soon as possible.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.section
      id="contact"
      className="w-full flex flex-col gap-12"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, type: "spring", stiffness: 75 }}
      viewport={{ once: true, margin: "-8%" }}
    >
      {/* Header */}
      <div className="text-center flex flex-col gap-3">
        <span className="section-label block">{t("contact.title")}</span>
        <h2
          className="text-4xl sm:text-5xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("contact.title")}
        </h2>
        <p className="text-base max-w-sm mx-auto mt-1" style={{ color: "var(--color-muted)" }}>
          Have a project in mind? Let's build something great together.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start justify-center w-full max-w-4xl mx-auto">
        {/* Social contact links */}
        <div className="flex flex-col gap-5 lg:min-w-[220px]">
          <p
            className="text-sm font-semibold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Or reach me directly
          </p>
          {CONTACT_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-3 group transition-opacity hover:opacity-70"
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Icon size={17} style={{ color: "var(--color-text)" }} />
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-muted)" }}
              >
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 w-full max-w-lg"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium tracking-widest"
              style={{
                color: "var(--color-muted)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.12em",
              }}
            >
              {t("contact.email").toUpperCase()}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              className="form-input"
            />
            <ValidationError
              prefix="Email"
              field="email"
              errors={state.errors}
              className="text-red-400 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="message"
              className="text-xs font-medium tracking-widest"
              style={{
                color: "var(--color-muted)",
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.12em",
              }}
            >
              {t("contact.message").toUpperCase()}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell me about your project..."
              className="form-input resize-none"
            />
            <ValidationError
              prefix="Message"
              field="message"
              errors={state.errors}
              className="text-red-400 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="btn-primary flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.submitting ? (
              <>
                <div
                  className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "var(--color-bg)" }}
                />
                Sending…
              </>
            ) : (
              <>
                <FaPaperPlane size={13} />
                {t("contact.submit")}
              </>
            )}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
