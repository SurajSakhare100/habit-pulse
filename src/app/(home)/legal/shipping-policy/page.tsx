"use client";

import React from "react";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-semibold mb-6">Shipping Policy</h1>
      <p className="mb-4">Effective Date: April 21, 2025</p>

      <p className="mb-6">
        At <strong>Habit Pulse</strong>, we offer a fully digital product. As such, there is no physical shipping required for any of our services or offerings.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Digital Delivery</h2>
      <p className="mb-4">
        Once your account is created and payment is confirmed, you will gain instant access to our app and features. All content, features, and updates are delivered digitally via your registered email address and accessible through your account.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Shipping Time</h2>
      <p className="mb-4">
        Since there is no physical shipment involved, there is no shipping time. Access to the Habit Pulse platform is typically available immediately after signup and successful payment processing.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Contact Us</h2>
      <p className="mb-4">
        If you have any questions about our shipping (digital delivery) process or need support accessing your account, feel free to reach out.
      </p>
      <ul className="list-disc pl-6">
        <li><strong>Email:</strong> <a href="mailto:sakharesuraj15@gmail.com" className="underline">sakharesuraj15@gmail.com</a></li>
        <li><strong>Support Contact:</strong> +91 87670 82606</li>
        <li><strong>Office Address:</strong> Vadgaon Road, Alandi, Pune 412105</li>
      </ul>
    </div>
  );
};

export default ShippingPolicy;
