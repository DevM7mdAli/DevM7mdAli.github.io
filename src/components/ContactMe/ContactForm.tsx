import { useForm, ValidationError } from "@formspree/react"
import { motion, type MotionProps } from "framer-motion";
import { useTranslation } from 'react-i18next';

type ContactFormData = {
  email: string;
  message: string;
};

type MotionPProps = MotionProps & React.HTMLAttributes<HTMLParagraphElement>;
const MotionP: React.FC<MotionPProps> = (props) => <motion.p {...props} />;
type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>;
const MotionDiv: React.FC<MotionDivProps> = (props) => <motion.div {...props} />;


export default function ContactForm() {
  const [state, handleSubmit] = useForm<ContactFormData>('mnnavlzy')
  const { t } = useTranslation();

  if (state.succeeded) {
    return <MotionP className="text-lg sm:text-4xl font-bold text-center"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}
    >{t('contact.received')}</MotionP>;
  }

  return (
    <MotionDiv
      id="contact"
      className="flex flex-col items-center gap-y-8"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}
    >

      <h2 className="text-5xl font-bold">{t('contact.title')}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-8">
        <div>
          <label htmlFor="email" className="text-xl">
            {t('contact.email')}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="text-black w-full rounded-sm text-lg"
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
            {t('contact.message')}
          </label>
          <textarea
            id="message"
            name="message"
            className="text-black w-full rounded-sm text-lg"
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="text-red-600"
          />
        </div>

  <button type="submit" disabled={state.submitting} className="flex items-center justify-center rounded-lg btn-primary px-3 py-2 text-xl font-bold">
          {t('contact.submit')}
        </button>
      </form>
  </MotionDiv>
  )
}