import { useState } from "react"; // Importado useState
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator // Importado Alert e ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCarrinho } from "../../context/CarrinhoContext";
import { useAuth } from "../../context/AuthContext";


export default function CarrinhoScreen() {
  // ATENÇÃO: Adicione a função de limpar o carrinho no seu CarrinhoContext caso tenha criado (ex: limparCarrinho)
  const { itens, removerItem, total, limparCarrinho } = useCarrinho();
  const [enviando, setEnviando] = useState(false);
  const { user } = useAuth();

  const kgSalvos = (itens.length * 0.5).toFixed(1);
  const data = new Date().toLocaleDateString("pt-BR");

  // Pega o endereço e dados da loja do primeiro item do carrinho de forma dinâmica
  const enderecoLoja = itens[0]?.endereco || "Retirar no estabelecimento parceiro";
  const nomeLoja = itens[0]?.loja || "Estabelecimento Parceiro";

  const handleFinalizar = async () => {
  if (itens.length === 0) {
    Alert.alert("Carrinho Vazio", "Adicione produtos antes de finalizar.");
    return;
  }

  setEnviando(true);

  const itensFormatados = itens.map(item => ({
    produtoId: item.id || item._id || "6a24a100c7eb1b3b5a1f71b9", 
    nome: item.nome,
    preco: Number(item.preco),
    quantidade: Number(item.quantidade) || 1
  }));

  const pedidoData = {
    estabelecimentoId: itens[0].estabelecimentoId, 
    usuarioId: user?.id || user?._id,
    itens: itensFormatados,
    total: Number(total)
  };

  // Esse log vai te mostrar no terminal se o objeto foi montado certinho!
  console.log("Enviando Pedido Completo para a API:", JSON.stringify(pedidoData, null, 2));

  try {
    const response = await fetch("http://10.0.2.2:5500/pedido/novo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedidoData),
    });

    const dadosResultado = await response.json();

    if (response.ok) {
      Alert.alert(
        "Pedido Confirmado!",
        `Seu pedido foi enviado com sucesso!`,
        [
          { 
            text: "OK", 
            onPress: () => {
              if (typeof limparCarrinho === "function") limparCarrinho();
              router.replace("/");
            } 
          }
        ]
      );
    } else {
      // Se o backend rejeitar, exibe o motivo real retornado
      Alert.alert("Erro no pedido", dadosResultado.message || "Não foi possível processar seu carrinho.");
    }
  } catch (error) {
    console.error("Erro ao enviar pedido:", error);
    Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor.");
  } finally {
    setEnviando(false);
  }
};

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Feather name="shopping-cart" size={22} color="#111" />
          <Text style={styles.titulo}>Carrinho</Text>
        </View>

        {itens.length === 0 ? (
          <View style={styles.vazio}>
            <Feather name="shopping-cart" size={48} color="#E5E7EB" />
            <Text style={styles.vazioTexto}>Seu carrinho está vazio</Text>
          </View>
        ) : (
          <View style={styles.lojaCard}>
            <View style={styles.lojaHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                {/* Tornando o nome da loja dinâmico baseado no item adicionado */}
                <Text style={styles.lojaNome}>{nomeLoja}</Text>
                <Text style={styles.lojaData}>{data} - Pronto para retirada</Text>
              </View>
              <TouchableOpacity style={styles.visitarBtn}>
                <Text style={styles.visitarBtnTexto}>Visitar loja</Text>
              </TouchableOpacity>
            </View>

            {itens.map((item, index) => (
              <TouchableOpacity key={index} onLongPress={() => removerItem(index)}>
                <View style={styles.itemRow}>
                  <View style={styles.itemImagem}>
                    <Feather name="package" size={20} color="#F05A28" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNome}>{item.nome}</Text>
                    <Text style={styles.itemQtd}>1 Unidade</Text>
                  </View>
                  <View style={styles.itemPrecos}>
                    <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)} / {item.unidade}</Text>
                    <Text style={styles.itemPrecoOriginal}>R$ {(item.precoOriginal || item.preco * 1.2).toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.entregaCard}>
          <Text style={styles.entregaTitulo}>Entrega:</Text>
          <Text style={styles.entregaTipo}>Retirar no estabelecimento</Text>
          {/* Exibindo o endereço dinâmico da loja associada */}
          <Text style={styles.entregaEndereco}>{enderecoLoja}</Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalTitulo}>Total do carrinho:</Text>
          <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
          <Text style={styles.totalEconomia}>
            Nessa compra você salva {kgSalvos}kg de alimento
          </Text>
        </View>

        {/* Adicionado o handler e o estado de loading no botão */}
        <TouchableOpacity 
          style={[styles.botaoFinalizar, { opacity: enviando ? 0.6 : 1 }]} 
          onPress={handleFinalizar}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.botaoFinalizarTexto}>Finalizar o carrinho</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.termos}>
          Ao finalizar o carrinho você aceita todos os nossos termos e condições.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  content: { paddingTop: 96, paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111" },
  vazio: { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 60 },
  vazioTexto: { fontSize: 16, color: "#aaa" },
  lojaCard: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, gap: 12 },
  lojaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  lojaNome: { fontSize: 15, fontWeight: "700", color: "#111" },
  lojaData: { fontSize: 12, color: "#888", marginTop: 2 },
  visitarBtn: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  visitarBtnTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  itemImagem: { width: 44, height: 44, backgroundColor: "#F3F4F6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 13, fontWeight: "600", color: "#111" },
  itemQtd: { fontSize: 12, color: "#888" },
  itemPrecos: { alignItems: "flex-end" },
  itemPreco: { fontSize: 13, fontWeight: "700", color: "#F05A28" },
  itemPrecoOriginal: { fontSize: 11, color: "#aaa", textDecorationLine: "line-through" },
  entregaCard: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, gap: 4 },
  entregaTitulo: { fontSize: 15, fontWeight: "700", color: "#111" },
  entregaTipo: { fontSize: 14, color: "#F05A28", fontWeight: "600" },
  entregaEndereco: { fontSize: 13, color: "#555" },
  totalCard: { gap: 4 },
  totalTitulo: { fontSize: 15, fontWeight: "700", color: "#111" },
  totalValor: { fontSize: 22, fontWeight: "900", color: "#F05A28" },
  totalEconomia: { fontSize: 13, color: "#F05A28" },
  botaoFinalizar: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  botaoFinalizarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  termos: { fontSize: 11, color: "#aaa", textAlign: "center" },
});