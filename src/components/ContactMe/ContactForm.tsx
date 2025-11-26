import { useForm, ValidationError } from "@formspree/react";
import { motion, type MotionProps } from "framer-motion";
import { useTranslation } from "react-i18next";
import Loading from "../Loading";

type ContactFormData = {
  email: string;
  message: string;
};

export default function ContactForm() {
  const [state, handleSubmit] = useForm<ContactFormData>("mnnavlzy");
  const { t } = useTranslation();

  if (state.succeeded) {
    return (
      <motion.p
        className="text-lg sm:text-4xl font-bold text-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}
      >
        {t("contact.received")}
      </motion.p>
    );
  }

  return (
    <motion.div
      id="contact"
      className="flex flex-col items-center gap-y-8"
      initial={{ y: 40, opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}
    >
      <h2 className="text-5xl font-bold">{t("contact.title")}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-8"
      >
        <div>
          <label htmlFor="email" className="text-xl">
            {t("contact.email")}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full rounded-sm text-lg text-white"
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="text-red-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="text-xl">
            {t("contact.message")}
          </label>
          <textarea
            id="message"
            name="message"
            className="w-full rounded-sm text-lg text-white"
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-600"
          />
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="flex items-center justify-center rounded-lg btn-primary px-3 py-2 text-xl font-bold"
        >
          {state.submitting ? (
            <Loading typeLoad={"spinningBubbles"} />
          ) : (
            t("contact.submit")
          )}
        </button>
      </form>
    </motion.div>
  );
}
