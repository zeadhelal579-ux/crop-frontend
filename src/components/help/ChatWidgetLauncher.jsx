/**
 * "Chat with Agronomist on Duty" button (ADR-021). The live-chat vendor is an
 * open product decision, so this component is the single integration point:
 * once a vendor SDK is chosen, only startChat() below changes. Until then the
 * button tells the user plainly that live chat is not connected yet instead
 * of pretending to open something.
 */
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CHAT_WIDGET_APP_ID } from "@/lib/env";

const HAS_CHAT_VENDOR = CHAT_WIDGET_APP_ID !== "" && CHAT_WIDGET_APP_ID !== "your_chat_vendor_app_id_here";

/** Render the chat launcher button. */
export function ChatWidgetLauncher() {
  const { t } = useTranslation("help");
  const { user } = useAuth();

  /** Open the vendor chat, identifying the signed-in user (vendor SDK goes here). */
  function startChat() {
    if (!HAS_CHAT_VENDOR) {
      toast({ title: t("contact.chatUnavailable"), description: t("contact.chatUnavailableHint") });
      return;
    }
    // Vendor SDK hook-up: lazy-load the script, then call its boot/open method with
    // { appId: CHAT_WIDGET_APP_ID, name: user.fullName, email: user.email }.
    toast({ title: t("contact.chatOpening", { name: user?.fullName ?? "" }) });
  }

  return (
    <Button className="w-full" onClick={startChat}>
      <MessageCircle className="h-4 w-4" aria-hidden="true" />
      {t("contact.chat")}
    </Button>
  );
}
