import NavBar from "./components/NavBar";
import AboutCard from "./components/About/AboutCard";
import Skills from "./components/Skills/Skills";
import ExperienceSection from "./components/Experience/ExperienceSection";
import me from "./data/me.json";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<Error404 />}>
      <Route index element={<HolderElement />} />
    </Route>,
  ),
);

function App() {
  return <RouterProvider router={router} />;
}

function HolderElement() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif", background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <NavBar />

      <main className="w-full">
        <AboutCard
          resumeLink={me.resumeLink}
          linkedLink={me.linkedLink}
          GitHubLink={me.GitHubLink}
          XLink={me.XLink}
          Email={me.Email}
          about="about.body"
        />

        <div className="flex flex-col gap-32 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto pb-20">
          <Skills />
          <ExperienceSection />
          <ProjectCard />
          <ContactForm />
        </div>
      </main>

      <Footer
        linkedLink={me.linkedLink}
        GitHubLink={me.GitHubLink}
        XLink={me.XLink}
        Email={me.Email}
      />
    </div>
  );
}

export default App;
