import { motion, useInView } from "framer-motion";
import React from "react";
import { Spotlight } from "../ui/spotlight";
import { Cover } from "../ui/cover";
import { Link } from "react-router";
import HackyButton from "../hacky-button";
import { Button } from "../ui/button";
import { Github } from "lucide-react";

export default function Hero() {
  const ref = React.useRef(null);
  const isInView = useInView(ref);

  const FADE_DOWN_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };
  return (
    <div className="mx-auto max-w-6xl mt-24 px-6 lg:px-8 bg-transparent relative pt-24 pb-10 ">
      <div className="max-w-4xl absolute">
        <Spotlight fill="#9284D4" />
      </div>
      <div className="mx-auto max-w-6xl text-center mb-24">
        <motion.div
          initial="hidden"
          ref={ref}
          animate={isInView ? "show" : "hidden"}
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <div className="absolute -top-4 -z-10 flex w-full justify-center">
            <div className="h-[310px] w-[310px] max-w-full animate-pulse-slow rounded-full bg-[#8678F9] opacity-20 blur-[100px]" />
          </div>
          <div className="absolute -top-4 -z-10 flex w-full justify-center">
            <div className="h-[310px] w-[310px] max-w-full animate-pulse-slow rounded-full bg-[#8678F9] opacity-20 blur-[100px]" />
          </div>

          <motion.h1
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className=" text-4xl font-bold  bg-gradient-to-tr  from-purple-300/80 to-white/90 bg-clip-text text-transparent tracking-normal sm:text-7xl  md:text-9xl "
          >
            <div className="alt-heading text-4xl sm:text-7xl  md:text-9xl w-full sm:h-[9.2rem] h-[2.8rem]  ">
              Your Digital{" "}
              <span>
                <Cover className=" text-purple-700 ">
                  <motion.h1 className=" text-4xl font-bold  bg-gradient-to-tr  from-purple-300/80 to-white/90 bg-clip-text text-transparent tracking-normal sm:text-7xl  md:text-9xl ">
                    <div className="alt-heading text-4xl sm:text-7xl  md:text-9xl w-full">
                      Mind
                    </div>
                  </motion.h1>
                </Cover>
              </span>
            </div>
          </motion.h1>

          <motion.p
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="mt-6 text-lg leading-8"
          >
            All your ideas, your thoughts, one step away
          </motion.p>
          <motion.p
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="mt-6 text-lg leading-8"
          >
            Think it. Save it. Find it.
          </motion.p>

          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link to="/login">
              <HackyButton text="Get Started" />
            </Link>
            <Link to={"https://github.com/kanakk365"}>
              <Button variant="link">
                <span><Github/></span>
                Github &rarr;
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className=" mt-52 px-6"></div>
    </div>
  );
}
