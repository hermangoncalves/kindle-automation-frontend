import { createContext, useContext, useEffect, useState } from "react";
import { KINDLE_EMAIL_KEY } from "../constants";
import { useSearchParams } from "react-router-dom";

// Define o tipo de propriedades aceitas pelo Provider
type KindleProviderProps = {
  children: React.ReactNode;
};

// Define o tipo do contexto
type KindleContextType = {
  kindleEmail: string | null;
  registerEmail: (email: string) => void;
  removeEmail: () => void;
};

// Cria o contexto
const KindleProviderContext = createContext<KindleContextType | undefined>(undefined);

// Implementa o Provider
export const KindleProvider = ({ children }: KindleProviderProps) => {
  const [kindleEmail, setKindleEmail] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStep = parseInt(searchParams.get("step") || "0", 10);
  let nextStep = currentStep;

  // Verifica o localStorage ao carregar
  useEffect(() => {
    const storedEmail = localStorage.getItem(KINDLE_EMAIL_KEY);
    if (storedEmail) {
      setKindleEmail(storedEmail);
      nextStep = 2
      setSearchParams({ step: nextStep.toString() });
    }
  });

  // Função para registrar um e-mail no localStorage
  const registerEmail = (email: string) => {
    localStorage.setItem(KINDLE_EMAIL_KEY, email);
    setKindleEmail(email);
    nextStep = 2
    setSearchParams({ step: nextStep.toString() });
  };

  // Função para remover o e-mail do localStorage
  const removeEmail = () => {
    localStorage.removeItem(KINDLE_EMAIL_KEY);
    setKindleEmail(null);
    nextStep = 1
    setSearchParams({ step: nextStep.toString() });
  };

  // Prove os valores do contexto
  return (
    <KindleProviderContext.Provider value={{ kindleEmail, registerEmail, removeEmail }}>
      {children}
    </KindleProviderContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useKindle = (): KindleContextType => {
  const context = useContext(KindleProviderContext);
  if (!context) {
    throw new Error("useKindle must be used within a KindleProvider");
  }
  return context;
};
