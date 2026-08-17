import NavBar from "./components/NavBar";
import AboutCard from "./components/About/AboutCard";
import Skills from "./components/Skills/Skills";
import ExperienceSection from "./components/Experience/ExperienceSection";
import ProjectCard from "./components/projects/ProjectCard";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Error404 from "./components/Error";
import Footer from "./components/Footer";
import ContactForm from "./components/ContactMe/ContactForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import { useProfile } from "./hooks/useProfile";

function SectionDivider() {
  return (
    <div className="flex items-center gap-6 py-16 sm:py-24">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, var(--color-border))" }} />
      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-border)" }} />
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, var(--color-border))" }} />
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<Error404 />}>
      <Route index element={<HolderElement />} />
      <Route path="manage" element={<AdminDashboard />} />
      <Route path="manage/login" element={<AdminLogin />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

function HolderElement() {
  const profile = useProfile();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif", background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <NavBar />

      <main className="w-full">
        <AboutCard
          resumeLink={profile.resumeLink}
          linkedLink={profile.linkedLink}
          GitHubLink={profile.GitHubLink}
          XLink={profile.XLink}
          Email={profile.Email}
          customAboutEn={profile.about_en}
          customAboutAr={profile.about_ar}
          about="about.body"
        />

        <div className="flex flex-col px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto pb-24">
          <SectionDivider />
          <Skills />
          <SectionDivider />
          <ExperienceSection />
          <SectionDivider />
          <ProjectCard />
          <SectionDivider />
          <ContactForm />
        </div>
      </main>

      <Footer
        linkedLink={profile.linkedLink}
        GitHubLink={profile.GitHubLink}
        XLink={profile.XLink}
        Email={profile.Email}
      />
    </div>
  );
}

export default App;
