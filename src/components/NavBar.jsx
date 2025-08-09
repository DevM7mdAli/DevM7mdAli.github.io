import { Navbar, Collapse, Typography, IconButton, Switch } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import DMA from '../assets/DMA.png'
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../stores/uiStore';

export default function NavBar() {
  const [openNav, setOpenNav] = useState(false);
  const { t, i18n } = useTranslation();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const navList = (
    <ul className="mt-6 mb-1 flex flex-col gap-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6 text-app">
      <Typography
        as="li"
        className="p-1 text-app"
      >
        <a href="#AboutMe" className="flex items-center text-app hover:opacity-80">
          {t('nav.about')}
        </a>
      </Typography>
      <Typography
        as="li"
        className="p-1 text-app"
      >
        <a href="#Skills" className="flex items-center text-app hover:opacity-80">
          {t('nav.skills')}
        </a>
      </Typography>
      <Typography
        as="li"
        className="p-1 text-app"
      >
        <a href="#projects" className="flex items-center text-app hover:opacity-80">
          {t('nav.projects')}
        </a>
      </Typography>
      <Typography
        as="li"
        className="p-1 text-app"
      >
        <a href="#contact" className="flex items-center text-app hover:opacity-80">
          {t('nav.contact')}
        </a>
      </Typography>
      <div className="flex items-center gap-3 px-2">
        <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
        <Switch
          id="theme-switch"
          color="blue"
          checked={theme === 'dark'}
          onChange={() => toggleTheme()}
        />
        <button
          className="text-sm border px-2 py-1 rounded"
          onClick={() => {
            const next = lang === 'en' ? 'ar' : 'en';
            setLang(next);
            i18n.changeLanguage(next);
            document.dir = next === 'ar' ? 'rtl' : 'ltr';
          }}
        >
          {lang.toUpperCase()}
        </button>
      </div>
    </ul>
  );

  return (
    <div className="sticky top-0 max-h-[768px] w-full z-30 text-app">
      <Navbar className="h-max max-w-full rounded-none border-none px-4 py-2 lg:px-8 lg:py-4 bg-app-surface text-app">
        <div className="flex items-center justify-between">
          <a className="sm:w-24 w-16 flex justify-center items-center" href="/">
            <img src={DMA} alt="Logo" className="logo-themable" />
          </a>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
        </Collapse>
      </Navbar>
    </div>
  );
}
