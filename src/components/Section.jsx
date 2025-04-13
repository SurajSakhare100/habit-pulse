// VideoSection.tsx
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
const sections = [
    {
      type: "video",
      media: "/daily.mp4",
      poster: "/daily.png",
      heading: "Stay Consistent with Daily Tracking",
      subheading: "Daily Habit Tracker",
      description:
        "Track your habits effortlessly every day. Check in with a single tap and watch your streaks grow.",
      cta: "Start tracking now",
      link: "/habits",
    },
    {
      type: "image",
      media: "/bar.png",
      heading: "See Your Growth in Real Time",
      subheading: "Powerful Analytics",
      description:
        "Visualize your progress with detailed graphs and insights. Spot patterns and improve faster with data-driven feedback.",
      cta: "View analytics",
      link: "/analytics",
    },
    {
      type: "image",
      media: "/note.png",
      heading: "Reflect and Grow",
      subheading: "Built-in Journal",
      description:
        "Journaling helps you process your journey. Write freely, stay grounded, and reflect on your wins and challenges.",
      cta: "Open journal",
      link: "/journal",
    },
    // {
    //   type: "image",
    //   media: "/homepage/communitySupport.png",
    //   heading: "Grow Together",
    //   subheading: "Supportive Community",
    //   description:
    //     "Join a tribe of habit builders. Share your progress, get encouragement, and build habits with others.",
    //   cta: "Join now",
    //   link: "/community",
    // },
    {
        type: "video",
        media: "/year.mp4",
        heading: "Look Back at Your Wins",
        subheading: "2024 Year in Review",
        description:
          "Celebrate your consistency. See your yearly stats, biggest streaks, and milestones hit throughout 2024.",
        cta: "View my year",
        link: "/year-review",
      },
  ];
  

export default function Section() {
  return (
    <div className="max-w-6xl mx-auto px-8 py-12 my-6 md:my-20 ">
      <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight mb-4 md:mb-6 text-center">Habits made fun, easy, and automatic</h2>
      <p className="md:text-lg opacity-90 mb-12 md:mb-20 text-center">Exercise more, read daily, and meditate consistently!</p>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } gap-12 items-center`}
        >
          {section.type === "video" ? (
            <video
              poster={section.poster}
              className="rounded-3xl aspect-square w-full sm:w-96 lg:w-[28rem] dark:border-2 border-2 dark:shadow-lg"
              autoPlay
              loop
              playsInline

            >
              <source src={section.media} type="video/mp4" />
            </video>
          ) : (
            <img
              src={section.media}
              alt={section.heading}
              className="rounded-3xl aspect-square w-full sm:w-96 lg:w-[28rem] dark:border-2 border-base-content/20 dark:shadow-lg"
            />
          )}
          <div className="text-left space-y-4 md:space-y-6">
            <p className="font-semibold text-primary md:-mb-2">
              {section.subheading}
            </p>
            <h3 className="font-extrabold text-3xl md:text-4xl tracking-tight">
              {section.heading}
            </h3>
            <p className="text-base-content/80">{section.description}</p>
           <Button className="" >
           <Link className="" href={section.link}>
              {section.cta}
            </Link>
           </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
