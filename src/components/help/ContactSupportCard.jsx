/**
 * "Contact Support" card: live chat launcher, the technical field ticket
 * form (dialog) and the response-time / field-desk tiles. The two tiles are
 * static profile content until real ticket history exists to compute them.
 */
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useCreateTicket } from "@/hooks/useSupportTickets";
import { ChatWidgetLauncher } from "./ChatWidgetLauncher";

/** Render the support card. */
export function ContactSupportCard() {
  const { t } = useTranslation("help");
  const createTicket = useCreateTicket();
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setShowErrors(true);
      return;
    }
    createTicket.mutate(
      { subject: subject.trim(), description: description.trim() },
      {
        onSuccess: () => {
          toast({ title: t("ticket.sent") });
          setIsOpen(false);
          setSubject("");
          setDescription("");
          setShowErrors(false);
        },
        onError: () => toast({ title: t("ticket.failed"), variant: "error" }),
      },
    );
  }

  return (
    <section className="glass-card space-y-4 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
          <Send className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-neutral-800">{t("contact.title")}</h3>
          <p className="text-[11px] text-neutral-600">{t("contact.subtitle")}</p>
        </div>
      </div>
      <p className="text-xs text-neutral-600">{t("contact.help")}</p>

      <div className="space-y-2">
        <ChatWidgetLauncher />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outlined" className="w-full bg-white">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {t("contact.ticket")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-lg font-bold">{t("ticket.title")}</DialogTitle>
            <DialogDescription className="mb-4 text-sm text-neutral-600">{t("ticket.description")}</DialogDescription>
            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <div>
                <Label htmlFor="ticket-subject">{t("ticket.subject")}</Label>
                <Input id="ticket-subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
                {showErrors && !subject.trim() ? <p className="mt-1 text-[11px] font-semibold text-risk-high">{t("ticket.required")}</p> : null}
              </div>
              <div>
                <Label htmlFor="ticket-description">{t("ticket.details")}</Label>
                <Textarea id="ticket-description" value={description} onChange={(event) => setDescription(event.target.value)} />
                {showErrors && !description.trim() ? <p className="mt-1 text-[11px] font-semibold text-risk-high">{t("ticket.required")}</p> : null}
              </div>
              <Button type="submit" className="w-full" disabled={createTicket.isPending}>
                {t("ticket.submit")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-white/80 p-2">
          <p className="text-[9px] font-semibold uppercase text-neutral-500">{t("contact.avgResponse")}</p>
          <p className="text-xs font-bold text-neutral-800">{t("contact.avgResponseValue")}</p>
        </div>
        <div className="rounded-xl bg-white/80 p-2">
          <p className="text-[9px] font-semibold uppercase text-neutral-500">{t("contact.fieldDesk")}</p>
          <p className="text-xs font-bold text-neutral-800">{t("contact.fieldDeskValue")}</p>
        </div>
      </div>
    </section>
  );
}
