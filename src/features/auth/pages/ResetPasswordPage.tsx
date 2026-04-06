import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@features/auth/schemas";
import { useResetPasswordMutation } from "@features/auth";
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

export default function ResetPasswordPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [succeeded, setSucceeded] = useState(false);

  const userIdParam = searchParams.get("userId");
  const token = searchParams.get("token") ?? "";
  const isValid = !!userIdParam && !!token;
  const userId = isValid ? Number(userIdParam) : 0;

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordFormData) {
    const result = await resetPassword({
      userId,
      token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
    if (!result.error) setSucceeded(true);
  }

  return (
    <AuthPageLayout>
      <Card className="shadow-xl border-border/50 rounded-2xl">
        {succeeded ? (
          <CardContent className="flex flex-col items-center text-center gap-5 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
              <CheckCircle2 className="h-7 w-7 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {t("resetPassword.successTitle")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("resetPassword.successDescription")}
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => navigate(AUTH_ROUTES.SIGN_IN)}
            >
              {t("resetPassword.signInButton")}
            </Button>
          </CardContent>
        ) : (
          <>
            <CardHeader className="space-y-1 pb-4">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <KeyRound className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {t("resetPassword.title")}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {t("resetPassword.description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {!isValid ? (
                <div className="flex flex-col items-center gap-4 py-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <p className="text-sm text-destructive leading-relaxed">
                    {t("resetPassword.invalidLink")}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(AUTH_ROUTES.FORGOT_PASSWORD)}
                  >
                    {t("resetPassword.requestNewLink")}
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("resetPassword.passwordLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t(
                                "resetPassword.passwordPlaceholder",
                              )}
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
                            {t("resetPassword.confirmPasswordLabel")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t(
                                "resetPassword.confirmPasswordPlaceholder",
                              )}
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t("resetPassword.loadingButton")
                        : t("resetPassword.submitButton")}
                    </Button>
                  </form>
                </Form>
              )}

              <Link
                to={AUTH_ROUTES.SIGN_IN}
                className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("resetPassword.backToSignIn")}
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </AuthPageLayout>
  );
}
