import { useState, useEffect } from "react"; // Importado hooks para estado e ciclo de vida
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router"; // Importado useLocalSearchParams
import { useCarrinho } from "../../context/CarrinhoContext";

const { width } = Dimensions.get("window");

export default function ProdutoScreen() {
  const { id } = useLocalSearchParams(); // Captura o ID do produto ou sacola clicada
  const { adicionarItem } = useCarrinho();

  // Estados para gerenciar os dados da API
  const [produto, setProduto] = useState(null);
  const [outrosProdutos, setOutrosProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDadosDoProduto() {
      try {
        // Chamada para buscar o produto pelo ID no IP padrão do emulador
        const response = await fetch(`http://10.0.2.2:5500/produto/${id}`);
        
        if (response.ok) {
          const dados = await response.json();
          setProduto(dados.produto);
          setOutrosProdutos(dados.outrosProdutos || []);
        } else {
          console.error("Erro ao buscar dados do produto");
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar produto:", error);
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      buscarDadosDoProduto();
    }
  }, [id]);

  const handleAdicionar = () => {
    if (!produto) return;

    adicionarItem({
      id: produto._id || produto.id,
      nome: produto.nome,
      preco: produto.preco,
      precoOriginal: produto.precoOriginal || (produto.preco * 1.2),
      unidade: produto.unidade || "1un",
      loja: produto.loja || "Estabelecimento",
      estabelecimentoId: produto.estabelecimentoId,
    });
    router.push("/carrinho");
  };

  // Função auxiliar para formatar a validade ISO do banco em algo legível (Ex: 02/02/2026)
  const formatarValidade = (dataIso) => {
    if (!dataIso) return "Não informada";
    try {
      const data = new Date(dataIso);
      return data.toLocaleDateString("pt-BR");
    } catch {
      return dataIso;
    }
  };

  if (carregando) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#F05A28" />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center", padding: 20 }]}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>Produto não encontrado.</Text>
        <TouchableOpacity style={styles.botaoCarrinho} onPress={() => router.back()}>
          <Text style={[styles.botaoCarrinhoTexto, { paddingHorizontal: 20 }]}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
          <Text style={styles.preco}>R$ {produto.preco?.toFixed(2)} / {produto.unidade || "1un"}</Text>
          <Text style={styles.precoOriginal}>
            R$ {(produto.precoOriginal || produto.preco * 1.2).toFixed(2)}
          </Text>
        </View>
        <Text style={styles.descricao}>{produto.descricao || "Sem descrição disponível."}</Text>

        <TouchableOpacity style={styles.botaoCarrinho} onPress={handleAdicionar}>
          <Text style={styles.botaoCarrinhoTexto}>Adicionar ao carrinho</Text>
        </TouchableOpacity>

        <Text style={styles.secaoTitulo}>Alertas</Text>
        <Text style={styles.alerta}>
          Consumir até: <Text style={styles.alertaDestaque}>{formatarValidade(produto.validade)}</Text>
        </Text>
        <Text style={styles.alerta}>Alérgicos: {produto.alertasAlergicos || produto.alergicos || "Nenhum alerta registrado."}</Text>

        {outrosProdutos.length > 0 && (
          <>
            <Text style={styles.secaoTitulo}>Outros do catálogo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outrosScroll}>
              {outrosProdutos.map((p) => (
                <TouchableOpacity
                  key={p._id || p.id}
                  style={styles.outroCard}
                  onPress={() => router.replace(`/produto/${p._id || p.id}`)}
                >
                  <View style={styles.outroImagem}>
                    <Feather name="package" size={24} color="#F05A28" />
                  </View>
                  <Text style={styles.outroPreco}>R$ {p.preco?.toFixed(2)} / {p.unidade || "un"}</Text>
                  <Text style={styles.outroPrecoOriginal}>
                    R$ {(p.precoOriginal || p.preco * 1.2).toFixed(2)}
                  </Text>
                  <Text style={styles.outroNome} numberOfLines={2}>{p.nome}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
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