import { useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const imagemLoja = require("../../../assets/imagemLojas/PadariaSeuJorge.png");
const imagemLeite = require("../../../assets/imagemProdutos/LeiteDesnatadoItalac1L.png");

const loja = {
  nome: "Padaria do Seu Jorge",
  descricao: "Lorem ipsum dolor sit amet consectetur adipiscing elit ut et massa mi. Aliquam in hendrerit urna.",
  endereco: "Estr. das Lágrimas, 1666 - Mauá, São Caetano do Sul - SP, 09580-500",
  avaliacao: 4,
  reviews: 21,
  distancia: "1.2 km de você",
};

const categoriasProdutos = [
  {
    categoria: "Laticínios",
    produtos: [
      { id: 1, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: imagemLeite },
      { id: 2, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: imagemLeite },
      { id: 3, nome: "Leite Desnatado Italac 1L", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: imagemLeite },
    ]
  },
  {
    categoria: "Biscoitos",
    produtos: [
      { id: 4, nome: "Bolacha recheada sabor morango", preco: 9.09, precoOriginal: 10.07, unidade: "1un", imagem: null },
      { id: 5, nome: "Bolacha recheada sabor morango", preco: 9.09, precoOriginal: 10.07, unidade: "1un", imagem: null },
    ]
  }
];

const sacolas = [
  { id: 1, nome: "Sacola Surpresa", categoria: "Vegetariana", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: null },
  { id: 2, nome: "Sacola Surpresa", categoria: "Vegana", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: null },
  { id: 3, nome: "Sacola Surpresa", categoria: "Sem Gluten", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: null },
  { id: 4, nome: "Sacola Surpresa", categoria: "Sem Restrições", preco: 9.09, precoOriginal: 10.07, unidade: "1L", imagem: null },
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

function calcularDesconto(preco, precoOriginal) {
  return Math.round(((precoOriginal - preco) / precoOriginal) * 100);
}

export default function LojaScreen() {
  const [aba, setAba] = useState("catalogo");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.imagemContainer}>
        <Image source={imagemLoja} style={styles.imagemLoja} resizeMode="cover" />
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
        <View style={styles.catalogoContainer}>
          {categoriasProdutos.map((cat, index) => (
            <View key={index} style={styles.categoriaSection}>
              <Text style={styles.categoriaTitulo}>{cat.categoria}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.scrollHorizontal}
              >
                {cat.produtos.map((produto) => (
                  <TouchableOpacity
                    key={produto.id}
                    style={styles.produtoCardHorizontal}
                    onPress={() => router.push(`/produto/${produto.id}`)}
                  >
                    <View style={styles.produtoImagemHorizontal}>
                      {produto.imagem && (
                        <Image source={produto.imagem} style={styles.imagemProdutoHorizontal} resizeMode="contain" />
                      )}
                      <TouchableOpacity style={styles.botaoAdicionarHorizontal}>
                        <Text style={styles.plusSign}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.produtoPrecoVerde}>R$ {produto.preco.toFixed(2)} / {produto.unidade}</Text>
                    <View style={styles.descontoRow}>
                      <Text style={styles.produtoPrecoRiscado}>R$ {produto.precoOriginal.toFixed(2)}</Text>
                      <View style={styles.badgeLaranja}>
                        <Text style={styles.textoBadgeLaranja}>-{calcularDesconto(produto.preco, produto.precoOriginal)}%</Text>
                      </View>
                    </View>
                    <Text style={styles.produtoNomeFino} numberOfLines={2}>{produto.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>
      )}

      {aba === "sacolas" && (
        <View style={styles.grid}>
          {sacolas.map((sacola) => (
            <TouchableOpacity
              key={sacola.id}
              style={styles.produtoCard}
              onPress={() => router.push(`/produto/${sacola.id}`)}
            >
              <View style={styles.produtoImagem}>
                {sacola.imagem && (
                  <Image source={sacola.imagem} style={styles.imagemProduto} resizeMode="contain" />
                )}
                <TouchableOpacity style={styles.botaoAdicionar}>
                  <Feather name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.precoRow}>
                <Text style={styles.produtoPreco}>R$ {sacola.preco.toFixed(2)} / {sacola.unidade}</Text>
                <View style={styles.descontoBadge}>
                  <Text style={styles.descontoTexto}>-{calcularDesconto(sacola.preco, sacola.precoOriginal)}%</Text>
                </View>
              </View>
              <Text style={styles.produtoPrecoOriginal}>R$ {sacola.precoOriginal.toFixed(2)}</Text>
              <Text style={styles.produtoNome}>{sacola.nome}</Text>
              <Text style={styles.sacolaCategoria}>{sacola.categoria}</Text>
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
  imagemLoja: { width: "100%", height: 220 },
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
  abas: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#E5E7EB", marginHorizontal: 20, marginBottom: 20 },
  aba: { marginRight: 24, paddingBottom: 8 },
  abaTexto: { fontSize: 16, color: "#525252", fontWeight: "500" },
  abaAtiva: { color: "#171717", fontWeight: "bold" },
  abaIndicador: { height: 2, backgroundColor: "#EA580C", borderRadius: 999, marginTop: 4, position: 'absolute', bottom: -1, left: 0, right: 0 },
  
  catalogoContainer: { paddingTop: 10 },
  categoriaSection: { marginBottom: 32 },
  categoriaTitulo: { fontSize: 18, fontWeight: "bold", color: "#171717", marginLeft: 20, marginBottom: 16 },
  scrollHorizontal: { paddingHorizontal: 20, gap: 16 },
  produtoCardHorizontal: { width: 140 },
  produtoImagemHorizontal: { width: 140, height: 140, backgroundColor: "#E5E5E5", borderRadius: 16, marginBottom: 12, position: "relative", alignItems: "center", justifyContent: "center" },
  imagemProdutoHorizontal: { width: "80%", height: "80%" },
  botaoAdicionarHorizontal: { position: "absolute", bottom: 12, right: 12, width: 28, height: 28, backgroundColor: "#FFFFFF", borderRadius: 14, justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  plusSign: { color: "#EA580C", fontSize: 20, fontWeight: "600", lineHeight: 22 },
  produtoPrecoVerde: { fontSize: 15, fontWeight: "bold", color: "#16A34A", marginBottom: 4 },
  descontoRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  produtoPrecoRiscado: { fontSize: 10, color: "#A3A3A3", textDecorationLine: "line-through" },
  badgeLaranja: { backgroundColor: "#EA580C", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12 },
  textoBadgeLaranja: { color: "#FFFFFF", fontSize: 8, fontWeight: "bold" },
  produtoNomeFino: { fontSize: 13, color: "#171717", lineHeight: 18, fontWeight: "400" },

  grid: { flexDirection: "row", flexWrap: "wrap", padding: 16, gap: 12 },
  produtoCard: { width: (width - 44) / 2, gap: 4 },
  produtoImagem: { width: "100%", height: 130, backgroundColor: "#F3F4F6", borderRadius: 16, marginBottom: 8, position: "relative", alignItems: "center", justifyContent: "center" },
  imagemProduto: { width: "80%", height: "80%" },
  botaoAdicionar: { position: "absolute", bottom: 8, right: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: "#F05A28", alignItems: "center", justifyContent: "center" },
  precoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  produtoPreco: { fontSize: 14, fontWeight: "700", color: "#111" },
  descontoBadge: { backgroundColor: "#FFEDE5", borderRadius: 999, paddingHorizontal: 6, paddingVertical: 2 },
  descontoTexto: { fontSize: 10, fontWeight: "700", color: "#F05A28" },
  produtoPrecoOriginal: { fontSize: 12, color: "#aaa", textDecorationLine: "line-through" },
  produtoNome: { fontSize: 12, color: "#555" },
  sacolaCategoria: { fontSize: 12, color: "#F05A28", fontWeight: "700" },
});