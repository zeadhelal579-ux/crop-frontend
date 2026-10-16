/**
 * Trash button for a field parcel card. It opens a confirmation dialog and,
 * once confirmed, deletes the field (soft delete on the backend) and refreshes
 * the farm. It sits above the card's stretched link, so clicking it never
 * opens the field page.
 */
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useDeleteField } from "@/hooks/useFields";

/** Render the delete action for one field. */
export function DeleteFieldButton({ field }) {
  const { t } = useTranslation("farm");
  const [open, setOpen] = useState(false);
  const deleteField = useDeleteField(field.farmId);

  /** Delete the field, then close the dialog and confirm with a toast. */
  function confirmDelete() {
    deleteField.mutate(field.id, {
      onSuccess: () => {
        setOpen(false);
        toast({ title: t("delete.done", { name: field.name }) });
      },
      onError: () => toast({ title: t("delete.failed"), variant: "error" }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative z-10 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-risk-highBg hover:text-risk-high"
          aria-label={t("delete.action", { name: field.name })}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="pe-8 text-lg font-bold text-neutral-800">{t("delete.title", { name: field.name })}</DialogTitle>
        <DialogDescription className="mt-2 text-sm text-neutral-600">{t("delete.body")}</DialogDescription>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outlined" onClick={() => setOpen(false)}>
            {t("delete.cancel")}
          </Button>
          <Button variant="danger" disabled={deleteField.isPending} onClick={confirmDelete}>
            {deleteField.isPending ? t("delete.deleting") : t("delete.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
