// components/PayButton.tsx
'use client'

import { Button } from "@/components/ui/button"

export const PayButton = () => {
  const handlePayment = async () => {
    const res = await fetch("/api/pricing/pay", { method: "POST" });
    const data = await res.json();
    if (data?.approvalUrl) {
      window.location.href = data.approvalUrl;
    }
  };

  return <Button onClick={handlePayment}>Pay with PayPal</Button>;
};
