import ListOfSkills from "./ListOfSkills"
import { MotionSection } from '../../utils/motion'
import { useTranslation } from 'react-i18next';

export default function Skills() {
  const { t } = useTranslation();

  return (
    <MotionSection className='flex flex-col gap-y-9 text-center' id='Skills'
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1, type: "spring", stiffness: 80 }}

    >
      <h1 className='text-5xl font-bold'>
        {t('skills.title')}
      </h1>
      <ListOfSkills />
    </MotionSection>
  )
}
