import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCarrinho } from "../../context/CarrinhoContext";

const { width } = Dimensions.get("window");

const produto = {
  id: 1,
  nome: "Leite Desnatado - Italac 1L",
  preco: 9.09,
  precoOriginal: 10.07,
  unidade: "1L",
  descricao: "Lorem ipsum dolor sit amet consectetur adipiscing elit ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla.",
  validade: "6 dias",
  alergicos: "Contém traços de Lactose, Glúten",
  loja: "Padaria do Seu Jorge",
};

const outrosProdutos = [
  { id: 1, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L" },
  { id: 2, nome: "Bolacha recheada sabor morango", preco: 9.09, precoOriginal: 10.07, unidade: "1un" },
  { id: 3, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L" },
];

export default function ProdutoScreen() {
  const { adicionarItem } = useCarrinho();

  const handleAdicionar = () => {
    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      precoOriginal: produto.precoOriginal,
      unidade: produto.unidade,
      loja: produto.loja,
    });
    router.push("/carrinho");
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <View style={styles.imagemPlaceholder}>
        <Feather name="package" size={80} color="#F05A28" />
      </View>

      <View style={styles.info}>
        <Text style={styles.nome}>{produto.nome}</Text>
        <View style={styles.precoRow}>
          <Text style={styles.preco}>R$ {produto.preco.toFixed(2)} / {produto.unidade}</Text>
          <Text style={styles.precoOriginal}>R$ {produto.precoOriginal.toFixed(2)}</Text>
        </View>
        <Text style={styles.descricao}>{produto.descricao}</Text>

        <TouchableOpacity style={styles.botaoCarrinho} onPress={handleAdicionar}>
          <Text style={styles.botaoCarrinhoTexto}>Adicionar ao carrinho</Text>
        </TouchableOpacity>

        <Text style={styles.secaoTitulo}>Alertas</Text>
        <Text style={styles.alerta}>
          Consumir até: <Text style={styles.alertaDestaque}>{produto.validade}</Text>
        </Text>
        <Text style={styles.alerta}>Alérgicos: {produto.alergicos}</Text>

        <Text style={styles.secaoTitulo}>Outros do catálogo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outrosScroll}>
          {outrosProdutos.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.outroCard}
              onPress={() => router.replace(`/produto/${p.id}`)}
            >
              <View style={styles.outroImagem}>
                <Feather name="package" size={24} color="#F05A28" />
              </View>
              <Text style={styles.outroPreco}>R$ {p.preco.toFixed(2)} / {p.unidade}</Text>
              <Text style={styles.outroPrecoOriginal}>R$ {p.precoOriginal.toFixed(2)}</Text>
              <Text style={styles.outroNome} numberOfLines={2}>{p.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 100 },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  imagemPlaceholder: { width: "100%", height: 280, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  info: { padding: 20, gap: 12 },
  nome: { fontSize: 22, fontWeight: "bold", color: "#111" },
  precoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  preco: { fontSize: 18, fontWeight: "700", color: "#F05A28" },
  precoOriginal: { fontSize: 14, color: "#aaa", textDecorationLine: "line-through" },
  descricao: { fontSize: 14, color: "#555", lineHeight: 22 },
  botaoCarrinho: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  botaoCarrinhoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secaoTitulo: { fontSize: 16, fontWeight: "700", color: "#111", marginTop: 4 },
  alerta: { fontSize: 14, color: "#555" },
  alertaDestaque: { color: "#F05A28", fontWeight: "600" },
  outrosScroll: { marginTop: 4 },
  outroCard: { width: 130, marginRight: 12, gap: 4 },
  outroImagem: { width: 130, height: 110, backgroundColor: "#F3F4F6", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  outroPreco: { fontSize: 13, fontWeight: "700", color: "#111" },
  outroPrecoOriginal: { fontSize: 11, color: "#aaa", textDecorationLine: "line-through" },
  outroNome: { fontSize: 11, color: "#555" },
});