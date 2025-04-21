import React from 'react';

const ContactUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto my-10 ">
      <h1 className="text-4xl font-semibold mb-6">Contact Us</h1>
      <p className="mb-4">We're here to support you! Whether you have a question about features, trials, pricing, need a demo, or anything else, our team is ready to assist you.</p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Reach Out Anytime</h2>
      <p>
        We strive to respond to all queries within 24-48 hours. Feel free to reach out to us through the details below:
      </p>

      <ul className="list-disc pl-6">
        <li><strong>Email</strong>: sakharesuraj10@gmail.com</li>
        <li><strong>Address</strong>: Vadgaon Road, Alandi, Pune 412105, India</li>
      </ul>

      <p className="mt-4">Thank you for using Habit Pulse. Your feedback is what drives us forward!</p>
    </div>
  );
};

export default ContactUs;
