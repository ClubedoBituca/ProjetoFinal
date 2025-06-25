import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted text-center p-6">
      <img 
        src="/SeuMadruga.jpeg" 
        alt="Seu Madruga bravo" 
        className="max-w-xs w-full rounded-lg shadow-lg mb-6"
      />

      <h1 className="text-5xl font-extrabold text-destructive mb-4">404 – Tá me devendo 14 meses de aluguel!</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Essa página não existe... assim como o pagamento do aluguel!
      </p>

      <Button asChild>
        <a href="/">Voltar para o Início</a>
      </Button>
    </div>
  );
};

export default NotFound;
