import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "919876543200"; // placeholder — replace with real trainer number
const PRE_FILLED_MESSAGE = encodeURIComponent(
  "Hi! I'd like to know more about your supplements."
);

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${PRE_FILLED_MESSAGE}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
    >
      <MessageCircle className="w-5 h-5 fill-white" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
