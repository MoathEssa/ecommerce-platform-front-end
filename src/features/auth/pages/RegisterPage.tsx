import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { registerSchema, type RegisterFormData } from "@features/auth/schemas";
import { useRegisterMutation } from "@features/auth";
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

export default function RegisterPage() {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: RegisterFormData) {
    const result = await register(values);
    if (!result.error) navigate("/");
  }

  return (
    <AuthPageLayout>
      <Card className="shadow-xl border-border/50 rounded-2xl">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold">
            {t("register.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("register.description")}
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
                    <FormLabel>{t("register.emailLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("register.emailPlaceholder")}
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
                    <FormLabel>{t("register.passwordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("register.passwordPlaceholder")}
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
                    <FormLabel>{t("register.confirmPasswordLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("register.confirmPasswordPlaceholder")}
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
                  ? t("register.loadingButton")
                  : t("register.submitButton")}
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-muted-foreground">
            {t("register.terms")}{" "}
            <span className="font-medium text-foreground">
              {t("register.termsLink")}
            </span>
          </p>

          <Separator />

          <GoogleAuthButton mode="signup" />

          <p className="text-center text-sm text-muted-foreground">
            {t("register.hasAccount")}{" "}
            <Link
              to={AUTH_ROUTES.SIGN_IN}
              className="font-semibold text-primary hover:text-primary/80 hover:underline"
            >
              {t("register.signInLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthPageLayout>
  );
}
