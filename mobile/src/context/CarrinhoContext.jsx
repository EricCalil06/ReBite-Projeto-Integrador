import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  const adicionarItem = (item) => {
    setItens((prev) => {
      if (prev.length > 0 && prev[0].estabelecimentoId !== item.estabelecimentoId) {
        Alert.alert(
          "Loja diferente",
          "Seu carrinho já tem itens de outra loja. Deseja limpar e adicionar este item?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Limpar e adicionar",
              style: "destructive",
              onPress: () => setItens([item]),
            },
          ]
        );
        return prev;
      }
      return [...prev, item];
    });
  };

  const removerItem = (index) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const limparCarrinho = () => setItens([]);

  const total = itens.reduce((acc, item) => acc + item.preco, 0);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionarItem, removerItem, limparCarrinho, total }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}