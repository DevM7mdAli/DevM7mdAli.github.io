import { CiLink } from "react-icons/ci";
import { useEffect, useState } from 'react'
import app from '../../firebase'
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import Loading from "../Loading";
import { useTranslation } from 'react-i18next';
import { MotionA } from '../../utils/motion';


type InfoPartProps = {
  tag: string;
  img: string;
  name: string;
  info: string;
  object?: boolean;
  link: string;
  stacks: string[];
}

export default function InfoPart({ tag, img, name, info, object, link, stacks }: InfoPartProps) {
  const [image, setImage] = useState('')
  const [imgFinishLoad, setImgFinishLoad] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const storage = getStorage(app);
  getDownloadURL(ref(storage, img))
      .then((url) => {
    setImage(url);
    setImgFinishLoad(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [img]);

  return (
    <div className='flex flex-col max-w-80 shadow-2xl rounded transition-all scale-95 hover:scale-100 gap-y-2 bg-app-surface'>
      <div>
        <h1 className='mt-1 ml-1 absolute text-black p-2 bg-opacity-40 bg-white rounded-lg'>
          {tag}
        </h1>
        {imgFinishLoad ?
          <img src={image} className={`w-full max-h-48 ${object ? "object-contain" : "object-cover"}`} alt={name} />

          :
          <div className="flex justify-center items-center">
            <Loading typeLoad={'spinningBubbles'} />
          </div>
        }
      </div>

      <div className='px-5'>
        <h1 className='text-lg mb-2'>
          {name}
        </h1>
        <h2 className='text-start text-sm'>
          {info}
        </h2>
      </div>

      <div className="flex flex-col justify-end items-end h-full gap-y-6 px-5 pb-2 pt-1">
        <MotionA className="flex items-center rounded-xl btn-primary px-3 py-2 text-lg font-bold hover:underline hover:scale-105 transition-transform" href={link} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1 }}>
          {t('projects.view')} {<CiLink />}
        </MotionA>
        <div className="flex justify-start w-full flex-wrap gap-3">
          {
            stacks.map((value: string, index: number) => (
              <div
                key={index}
                className="p-2 bg-white/30 rounded-full"
              >
                {value}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
