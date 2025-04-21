import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto my-10">
      <h1 className="text-4xl font-semibold mb-6">About Habit Pulse</h1>
      <p className="mb-4">Hey, it's <strong>Suraj 👋</strong><br />Maker of Habit Pulse</p>

      <p className="mb-4">
        I've always been fascinated by the power of habits—how small, consistent actions can lead to massive transformation over time. But every habit tracker I tried felt either too complicated or lacked the reflection and insight I wanted. So I decided to build my own.
      </p>

      <p className="mb-4">
        <strong>Habit Pulse</strong> was born from a simple idea: self-improvement should feel natural, intuitive, and rewarding.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Why I Built It</h2>
      <ul className="list-disc pl-6">
        <li><strong>Simple & Intuitive</strong>: Quickly log habits with a single tap—no clutter, no complexity.</li>
        <li><strong>Visually Engaging</strong>: Stay motivated with real-time progress tracking through beautiful, dynamic graphs.</li>
        <li><strong>Reflective</strong>: Use the built-in journal to capture thoughts, insights, and milestones along your journey.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Our Mission</h2>
      <p>
        Habit Pulse isn't just a tracker—it's your personal accountability partner. Our goal is to help you build meaningful habits, develop self-awareness, and become the best version of yourself—one day at a time.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Let's Build Better Habits Together</h2>
      <p>
        Whether you're starting small or chasing big goals, Habit Pulse is here to support your journey. Your progress is your story—and we're proud to be a part of it.
      </p>

      <p className="mt-6">
        <strong>Suraj Sakhare</strong><br />
        Founder, Habit Pulse<br />
        <strong>Email</strong>: sakharesuraj10@gmail.com<br />
        <strong>Location</strong>: Vadgaon Road, Alandi, Pune 412105
      </p>
    </div>
  );
};

export default AboutUs;
