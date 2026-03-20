import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Mail } from "lucide-react";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@features/auth/schemas";
import { useForgotPasswordMutation } from "@features/auth";
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

export default function ForgotPasswordPage() {
  const { t } = useTranslation("auth");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormData) {
    const result = await forgotPassword(values);
    if (!result.error) form.reset();
  }

  return (
    <AuthPageLayout>
      <Card className="shadow-xl border-border/50 rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("forgotPassword.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("forgotPassword.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("forgotPassword.emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("forgotPassword.emailPlaceholder")}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("forgotPassword.loadingButton")
                  : t("forgotPassword.submitButton")}
              </Button>
            </form>
          </Form>

          <Link
            to={AUTH_ROUTES.SIGN_IN}
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("forgotPassword.backToSignIn")}
          </Link>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}
