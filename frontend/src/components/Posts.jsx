import { formatDate } from "../utils/utils";
import { Link } from "react-router-dom";

import { useState, useRef } from "react";
import { motion, } from "framer-motion";

const hiddenMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 30px, rgba(0,0,0,1) 30px, rgba(0,0,0,1) 30px)`;
const visibleMask = `repeating-linear-gradient(to right, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 30px)`;

export default function Posts({
  _id,
  title,
  summary,
  file,
  content,
  createdAt,
  author,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();


  return (
    <div className="grid grid-cols-1 bg-dark/75 gap-4 md:grid-cols-2 border p-8 my-4">
      <motion.div
        initial={false}
        animate={
          isLoaded && isInView
            ? { WebkitMaskImage: visibleMask, maskImage: visibleMask }
            : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
        }
        transition={{ duration: 1, delay: 1 }}
        viewport={{ once: true }}
        onViewportEnter={() => setIsInView(true)}
        className="w-full h-full"
      >
        <Link to={`/post/${_id}`}>
          <img
            className="object-cover mx-auto h-64 md:h-[500px] border"
            src={`http://localhost:4000/${file}`}
            alt="blog-pic"
            width={500}
            onLoad={() => setIsLoaded(true)}
          />
        </Link>
      </motion.div>
      <div ref={ref}>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 75 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          animate={
            isLoaded && isInView
              && "visible"
              
          }
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          onViewportEnter={() => setIsInView(true)}
          
        >
          <Link to={`/post/${_id}`} className="space-y-2">
            <h2
              className="text-4xl font-semibold text-white
              } hover:text-gray"
            >
              {title}
            </h2>
          </Link>
          <div className="flex justify-between mt-4 mb-2">
            <p className="text-white/75">@{author.username}</p>
            <time className="text-white/75">{formatDate(createdAt)}</time>
          </div>
          <hr className="w-full border border-gray-300 my-4" />
          <p className="text-lg font-normal text-gray/60 mb-4">{summary}</p>
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="text-white/75 text-justify "
          />
        </motion.div>
      </div>
    </div>
  );
}
