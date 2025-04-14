import Image from "next/image";
import Boss from "../../../public/images/boss.jpg";
import Link from "next/link";

export default function LargeTestimonial() {
  return (
    <section className="py-12 md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <div className="relative inline-flex mb-6">
          <svg
            className="absolute -left-6 -top-2 -z-10"
            width={40}
            height={49}
            viewBox="0 0 40 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
              fill="#D1D5DB"
            />
          </svg>
          <Image
            className="rounded-full"
            src={Boss}
            width={64}
            height={64}
            alt="Suraj"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-1">Hey, it's Suraj 👋</h2>
        <p className="text-sm text-gray-500 mb-4">
          Maker of <Link href={'https://x.com/habitpulse'} className="font-semibold text-primary">Habit Pulse</Link>
        </p>
        <p className="text-base text-gray-700 mb-4">
          Fascinated by habits' power to shape our lives, I found existing trackers either too complex or lacking insight. So, I created Habit Pulse—a tool that's:
        </p>
        <div className="flex justify-center">
          <ul className="list-disc list-inside text-left text-base text-gray-700 mb-4">
            <li className="mb-2"><strong>Simple and intuitive</strong>: Log habits with a single tap.</li>
            <li className="mb-2"><strong>Visually engaging</strong>: Real-time progress through dynamic graphs.</li>
            <li className="mb-2"><strong>Reflective</strong>: Built-in journal for tracking thoughts and milestones.</li>
          </ul>
        </div>
        <p className="text-base text-gray-700">
          <Link href={'https://x.com/habitpulse'} className="font-bold text-primary">Habit Pulse</Link> isn't just a tracker; it's your companion in self-improvement, designed to help you build lasting habits and become the person you aspire to be.
        </p>
      
      </div>
    </section>
  );
}
