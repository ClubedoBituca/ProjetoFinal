
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PATHS } from "@/routes/paths";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../contexts/AuthContext";
import { toast } from "../hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate(PATHS.DASHBOARD);
    } catch (error) {
      toast({
        title: 'Falha de Acesso!',
        description: error?.message || 'Ocorreu um erro durante o login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link 
            to={PATHS.HOME} 
            className="text-3xl font-bold bg-magic-gradient bg-clip-text text-transparent"
          >
            MTG Deck Builder
          </Link>
          <p className="text-muted-foreground mt-2">Bem vindo, Planeswalker!</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardDescription>
              Insira suas credenciais para acessar seus decks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  {...register('email')}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register('password')}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Encontrando decks...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link 
                  to={PATHS.REGISTER} 
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta 
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Credenciais TESTE</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Email: demo@mail.com</p>
                <p>Senha: 12345678</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue('email', 'demo@mail.com');
                  setValue('password', '12345678');
                  setTimeout(() => handleSubmit(onSubmit)(), 0); // aguarda atualização do state
                }}
              >
               {isLoading ? 'Entrando...' : 'Usar conta de testes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
