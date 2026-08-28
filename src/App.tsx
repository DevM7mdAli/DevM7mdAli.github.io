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
import { lazy, Suspense } from "react";

/**
 * The admin is auth-gated and visited by exactly one person, but it was being
 * bundled into the entry chunk every public visitor downloads — five manager
 * screens, their modals, and now a drag-and-drop library. Splitting it out
 * means that code is fetched only when /manage is actually opened.
 */
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

function AdminChunk({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen w-full flex items-center justify-center"
          style={{ background: "var(--color-bg)" }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--color-muted)" }}
          />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
import ExperienceIndex from "./pages/ExperienceIndex";
import ExperienceDetail from "./pages/ExperienceDetail";
import ProjectIndex from "./pages/ProjectIndex";
import ProjectDetail from "./pages/ProjectDetail";
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
      <Route path="experience" element={<ExperienceIndex />} />
      <Route path="experience/:slug" element={<ExperienceDetail />} />
      <Route path="projects" element={<ProjectIndex />} />
      <Route path="projects/:slug" element={<ProjectDetail />} />
      <Route path="manage" element={<AdminChunk><AdminDashboard /></AdminChunk>} />
      <Route path="manage/login" element={<AdminChunk><AdminLogin /></AdminChunk>} />
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
      style={{ fontFamily: "var(--font-body)", background: "var(--color-bg)", color: "var(--color-text)" }}
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
