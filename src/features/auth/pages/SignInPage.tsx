import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { signInSchema, type SignInFormData } from "@features/auth/schemas";
import { useLoginMutation } from "@features/auth";
import { AUTH_ROUTES } from "@shared/constants";
import AuthPageLayout from "@features/auth/components/AuthPageLayout";
import GoogleAuthButton from "@features/auth/components/GoogleAuthButton";

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
import { Separator } from "@shared/ui/separator";

export default function SignInPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "moathhaimmour2003@gmail.com",
      password: "Moath2003",
    },
  });

  async function onSubmit(values: SignInFormData) {
    const result = await login(values);
    if (!result.error) navigate("/");
  }

  return (
    <AuthPageLayout>
      <Card className="shadow-xl border-border/50 rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold">
            {t("signIn.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("signIn.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Cold-start notice */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            <span className="font-semibold">Demo note:</span> The database runs
            on a serverless plan and may be sleeping. If the first login attempt
            fails, please wait a few seconds and try again.
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("signIn.emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("signIn.emailPlaceholder")}
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("signIn.passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("signIn.passwordPlaceholder")}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="flex items-center justify-between">
                      <Link
                        to={AUTH_ROUTES.FORGOT_PASSWORD}
                        className="text-xs text-primary hover:text-primary/80 hover:underline"
                        tabIndex={-1}
                      >
                        {t("signIn.forgotPassword")}
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? t("signIn.loadingButton")
                  : t("signIn.submitButton")}
              </Button>
            </form>
          </Form>

          <Separator />

          <GoogleAuthButton mode="signin" />

          <p className="text-center text-sm text-muted-foreground">
            {t("signIn.noAccount")}{" "}
            <Link
              to={AUTH_ROUTES.REGISTER}
              className="font-semibold text-primary hover:text-primary/80 hover:underline"
            >
              {t("signIn.registerLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}
