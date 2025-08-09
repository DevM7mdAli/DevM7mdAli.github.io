import { Link } from "react-router-dom"
import { MdErrorOutline } from "react-icons/md";
import { motion } from "framer-motion";


const showingAnimation = {
  hidden: {
    x: -100,
    opacity: 0
  },

  show: {
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.1,
      duration: 1.5
    }
  },
}

export default function Error() {
  return (
  <div className="flex flex-col items-center justify-center text-center font-Reddit gap-y-4 h-screen text-app px-4"
    >
      <motion.div
        className="flex flex-col items-center gap-y-2"
        variants={showingAnimation}
        initial="hidden"
        animate="show"
      >
        <div className="flex justify-center">
          <MdErrorOutline />
          <h1 className="text-2xl md:text-4xl">
            404 - Page Not Found
          </h1>
        </div>
        <p className="md:text-lg">
          The page you are looking for does not exist.
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
        >
          <Link to={"/"} className="flex items-center rounded-xl bg-btnBgColor px-2 py-1 text-lg font-bold">
            Go Back to Main Page
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}