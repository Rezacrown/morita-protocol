"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  PaymentLoadingView,
  PaymentPaidView,
  InvoicePaymentCard,
  type InvoicePaymentData,
} from "@/components/modules/pay";

function PayInvoiceContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "unpaid" | "paid">(
    "loading",
  );
  const [isPaying, setIsPaying] = useState(false);

  // Mock invoice data
  const [invoiceData, setInvoiceData] = useState<InvoicePaymentData>({
    clientName: "Acme Corp",
    description: "Frontend Development for Q3",
    amount: "1,250.00",
    payee: "0x049d...8f2a",
  });

  useEffect(() => {
    const checkStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("unpaid");
    };

    checkStatus();
  }, []);

  const handlePay = async () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setStatus("paid");
    }, 2500);
  };

  if (status === "loading") {
    return <PaymentLoadingView message="Decrypting..." />;
  }

  if (status === "paid") {
    return <PaymentPaidView />;
  }

  return (
    <InvoicePaymentCard
      invoice={invoiceData}
      isPaying={isPaying}
      onPay={handlePay}
    />
  );
}

export default function PayInvoice() {
  return (
    <Suspense fallback={<PaymentLoadingView message="Loading..." />}>
      <PayInvoiceContent />
    </Suspense>
  );
}
