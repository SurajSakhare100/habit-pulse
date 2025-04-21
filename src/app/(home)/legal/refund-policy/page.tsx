import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto my-10">
      <h1 className="text-4xl font-semibold mb-6">Refund Policy</h1>
      <p className="mb-4">Effective Date: April 20, 2025</p>

      <p>
        At <strong>Habit Pulse</strong>, customer satisfaction is our top priority. We believe in delivering exceptional value through our platform. However, if our services do not meet your expectations, you may be eligible for a refund as outlined in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">1. Eligibility Criteria</h2>
      <p>
        We offer a 7-day money-back guarantee for first-time users. To qualify for a refund:
      </p>
      <ul className="list-disc pl-6">
        <li>You must submit your refund request within 7 days of your initial purchase.</li>
        <li>Only first-time subscriptions are eligible. Renewals and repeat payments are non-refundable.</li>
        <li>There must be a valid reason tied to dissatisfaction with the service.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">2. Non-Refundable Conditions</h2>
      <ul className="list-disc pl-6">
        <li>Refunds are not provided for partial use of service or unused features.</li>
        <li>No refund will be issued for promotional or discounted pricing after purchase.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">3. How to Request a Refund</h2>
      <p>
        If you believe you are eligible, please email us at <strong>sakharesuraj10@gmail.com</strong> with your name, registered email, and payment details. We aim to process all valid requests within 7–10 business days.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">4. Contact Information</h2>
      <p>
        <strong>Email</strong>: sakharesuraj10@gmail.com<br />
        <strong>Address</strong>: Vadgaon Road, Alandi, Pune 412105, India
      </p>
    </div>
  );
};

export default RefundPolicy;
