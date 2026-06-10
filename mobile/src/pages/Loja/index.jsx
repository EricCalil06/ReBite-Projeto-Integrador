import { useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const loja = {
  nome: "Padaria do Seu Jorge",
  descricao: "Lorem ipsum dolor sit amet consectetur adipiscing elit ut et massa mi. Aliquam in hendrerit urna.",
  endereco: "Estr. das Lágrimas, 1666 - Mauá, São Caetano do Sul - SP, 09580-500",
  avaliacao: 4,
  reviews: 21,
  distancia: "1.2 km de você",
};

const produtos = [
  { id: 1, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L" },
  { id: 2, nome: "Bolacha recheada sabor morango", preco: 9.09, precoOriginal: 10.07, unidade: "1un" },
  { id: 3, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L" },
  { id: 4, nome: "Bolacha recheada sabor morango", preco: 9.09, precoOriginal: 10.07, unidade: "1un" },
];

const sacolas = [
  { id: 1, nome: "Sacola Surpresa Vegetariana", preco: 9.09, precoOriginal: 10.07 },
  { id: 2, nome: "Sacola Surpresa Vegana", preco: 9.09, precoOriginal: 10.07 },
  { id: 3, nome: "Sacola Surpresa Sem Gluten", preco: 9.09, precoOriginal: 10.07 },
  { id: 4, nome: "Sacola Surpresa Sem Restrições", preco: 9.09, precoOriginal: 10.07 },
];

function Estrelas({ quantidade }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather key={i} name="star" size={13} color={i <= quantidade ? "#F05A28" : "#E5E7EB"} />
      ))}
    </View>
  );
}

export default function LojaScreen() {
  const [aba, setAba] = useState("catalogo");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.imagemContainer}>
        <View style={styles.imagemPlaceholder}>
          <Feather name="shopping-bag" size={64} color="#F05A28" />
        </View>
        <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.nome}>{loja.nome}</Text>
        <Text style={styles.descricao}>{loja.descricao}</Text>
        <Text style={styles.endereco}>
          <Text style={styles.enderecoLabel}>Endereço: </Text>
          {loja.endereco}
        </Text>
        <View style={styles.avaliacaoRow}>
          <Text style={styles.avaliacaoLabel}>Avaliações: </Text>
          <Estrelas quantidade={loja.avaliacao} />
          <Text style={styles.reviews}>({loja.reviews})</Text>
          <View style={styles.distanciaRow}>
            <Feather name="map-pin" size={12} color="#F05A28" />
            <Text style={styles.distancia}>{loja.distancia}</Text>
          </View>
        </View>
      </View>

      <View style={styles.abas}>
        <TouchableOpacity style={styles.aba} onPress={() => setAba("catalogo")}>
          <Text style={[styles.abaTexto, aba === "catalogo" && styles.abaAtiva]}>Catálogo</Text>
          {aba === "catalogo" && <View style={styles.abaIndicador} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.aba} onPress={() => setAba("sacolas")}>
          <Text style={[styles.abaTexto, aba === "sacolas" && styles.abaAtiva]}>Sacolas Surpresas</Text>
          {aba === "sacolas" && <View style={styles.abaIndicador} />}
        </TouchableOpacity>
      </View>

      {aba === "catalogo" && (
        <View style={styles.grid}>
          {produtos.map((produto) => (
            <TouchableOpacity
              key={produto.id}
              style={styles.produtoCard}
              onPress={() => router.push(`/produto/${produto.id}`)}
            >
              <View style={styles.produtoImagem}>
                <Feather name="plus" size={20} color="#aaa" />
              </View>
              <Text style={styles.produtoPreco}>R$ {produto.preco.toFixed(2)} / {produto.unidade}</Text>
              <Text style={styles.produtoPrecoOriginal}>R$ {produto.precoOriginal.toFixed(2)}</Text>
              <Text style={styles.produtoNome}>{produto.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {aba === "sacolas" && (
        <View style={styles.grid}>
          {sacolas.map((sacola) => (
            <TouchableOpacity
              key={sacola.id}
              style={styles.sacolaCard}
              onPress={() => router.push(`/produto/${sacola.id}`)}
            >
              <View style={styles.sacolaImagem}>
                <Feather name="plus" size={24} color="#aaa" />
              </View>
              <Text style={styles.produtoPreco}>R$ {sacola.preco.toFixed(2)} / 1un</Text>
              <Text style={styles.produtoPrecoOriginal}>R$ {sacola.precoOriginal.toFixed(2)}</Text>
              <Text style={styles.sacolaNome}>{sacola.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 100 },
  imagemContainer: { position: "relative" },
  imagemPlaceholder: { width: "100%", height: 220, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
  voltar: { position: "absolute", top: 48, left: 16, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  info: { padding: 20, gap: 8 },
  nome: { fontSize: 22, fontWeight: "bold", color: "#111" },
  descricao: { fontSize: 13, color: "#555", lineHeight: 20 },
  endereco: { fontSize: 13, color: "#555" },
  enderecoLabel: { fontWeight: "600", color: "#111" },
  avaliacaoRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  avaliacaoLabel: { fontSize: 13, fontWeight: "600", color: "#111" },
  reviews: { fontSize: 12, color: "#666" },
  distanciaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginLeft: "auto" },
  distancia: { fontSize: 12, color: "#F05A28" },
  abas: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", marginHorizontal: 20 },
  aba: { marginRight: 24, paddingBottom: 8 },
  abaTexto: { fontSize: 15, color: "#888", fontWeight: "500" },
  abaAtiva: { color: "#111", fontWeight: "700" },
  abaIndicador: { height: 2, backgroundColor: "#111", borderRadius: 999, marginTop: 4 },
  grid: { flexDirection: "row", flexWrap: "wrap", padding: 16, gap: 12 },
  produtoCard: { width: (width - 44) / 2, gap: 4 },
  produtoImagem: { width: "100%", height: 130, backgroundColor: "#F3F4F6", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  produtoPreco: { fontSize: 14, fontWeight: "700", color: "#111" },
  produtoPrecoOriginal: { fontSize: 12, color: "#aaa", textDecorationLine: "line-through" },
  produtoNome: { fontSize: 12, color: "#555" },
  sacolaCard: { width: (width - 44) / 2, gap: 4 },
  sacolaImagem: { width: "100%", height: 160, backgroundColor: "#F3F4F6", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  sacolaNome: { fontSize: 12, color: "#F05A28", fontWeight: "600" },
});