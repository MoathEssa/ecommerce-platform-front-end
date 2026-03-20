import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";

import {
  setPasswordSchema,
  type SetPasswordFormData,
} from "@features/auth/schemas";
import { useSetPasswordMutation } from "@features/auth";
import { AUTH_ROUTES } from "@shared/constants";
import AuthPageLayout from "@features/auth/components/AuthPageLayout";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";

export default function SetPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [setPassword, { isLoading }] = useSetPasswordMutation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { token, email, password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SetPasswordFormData) {
    const result = await setPassword(values);
    if (!result.error) navigate(AUTH_ROUTES.SIGN_IN);
  }

  return (
    <AuthPageLayout>
      <Card className="shadow-xl border-border/50 rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("setPassword.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("setPassword.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("setPassword.passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("setPassword.passwordPlaceholder")}
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("setPassword.confirmPasswordLabel")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t(
                          "setPassword.confirmPasswordPlaceholder",
                        )}
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("setPassword.loadingButton")
                  : t("setPassword.submitButton")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}
