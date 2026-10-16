/**
 * Settings screen: profile form (name, language) and, for OrgAdmins only,
 * the team invitation form. Hiding the
 * invite form is a UX convenience; the backend enforces the real rule.
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { SUPPORTED_LANGUAGES } from "@/i18n/i18n";
import { patchData, postData } from "@/services/apiClient";
import { useAuthStore } from "@/stores/authStore";

const INVITE_ROLES = ["Farmer", "Agronomist"];

/** Profile section. */
function ProfileCard() {
  const { t, i18n } = useTranslation("common");
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [language, setLanguage] = useState(user?.preferredLanguage ?? i18n.language);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const updated = await patchData("/api/v1/users/me", { fullName, preferredLanguage: language });
      setUser(updated);
      await i18n.changeLanguage(updated.preferredLanguage);
      toast({ title: t("settings.saved") });
    } catch {
      toast({ title: t("settings.failed"), variant: "error" });
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("settings.profile")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="settings-name">{t("settings.fullName")}</Label>
            <Input id="settings-name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="settings-language">{t("auth.language")}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="settings-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {t(`language.names.${code}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {t("settings.save")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/** Team invitation section (OrgAdmin only). */
function InviteCard() {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(INVITE_ROLES[0]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim()) return;
    try {
      await postData("/api/v1/users/invite", { email: email.trim(), role });
      toast({ title: t("settings.invited", { email: email.trim() }) });
      setEmail("");
    } catch {
      toast({ title: t("settings.failed"), variant: "error" });
    }
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>{t("settings.team")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="invite-email">{t("auth.email")}</Label>
            <Input id="invite-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="invite-role">{t("settings.role")}</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INVITE_ROLES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {t(`roles.${item}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {t("settings.invite")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/** Render the Settings screen. */
export default function SettingsPage() {
  const { t } = useTranslation("common");
  const role = useAuthStore((state) => state.user?.role);

  return (
    <>
      <PageHero title={t("settings.title")} />
      <PageContainer className="grid gap-5 lg:grid-cols-2">
        <ProfileCard />
        {role === "OrgAdmin" ? <InviteCard /> : null}
      </PageContainer>
    </>
  );
}
