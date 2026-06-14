import { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Feather } from "@expo/vector-icons";

const ETAPAS = [
  { status: "Pendente", label: "Pedido recebido", icone: "clock" },
  { status: "Preparando", label: "Seu pedido está sendo separado", icone: "package" },
  { status: "Pronto", label: "Pronto para retirada", icone: "check-circle" },
];

function statusParaEtapa(status) {
  if (status === "Pendente") return 0;
  if (status === "Preparando") return 1;
  if (status === "Pronto" || status === "Entregue") return 2;
  return 0;
}

export default function PedidoDetalhe() {
  const { id } = useLocalSearchParams();
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (id) buscarPedido();
  }, [id]);

  async function buscarPedido() {
    try {
      const res = await fetch(`http://10.0.2.2:5500/pedidos/${id}`);
      if (res.ok) setPedido(await res.json());
    } catch (err) {
      console.error("Erro ao buscar pedido:", err);
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#F05A28" /></View>;
  }

  if (!pedido) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#555" }}>Pedido não encontrado.</Text>
      </View>
    );
  }

  const etapaAtual = statusParaEtapa(pedido.status);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Detalhes do Pedido</Text>
      <Text style={styles.pedidoId}>#{pedido._id.slice(-6).toUpperCase()}</Text>

      {/* ETAPAS */}
      <View style={styles.etapasCard}>
        {ETAPAS.map((etapa, i) => {
          const concluida = i <= etapaAtual;
          return (
            <View key={i} style={styles.etapaRow}>
              <View style={[styles.etapaIcone, concluida && styles.etapaIconeAtiva]}>
                <Feather name={etapa.icone} size={18} color={concluida ? "#fff" : "#ccc"} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.etapaLabel, concluida && styles.etapaLabelAtiva]}>
                  {etapa.label}
                </Text>
              </View>
              {concluida && <Feather name="check" size={16} color="#F05A28" />}
            </View>
          );
        })}
      </View>

      {/* ESTABELECIMENTO */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Estabelecimento</Text>
        <Text style={styles.secaoTexto}>{pedido.estabelecimentoNome || pedido.estabelecimentoId}</Text>
      </View>

      {/* ITENS */}
      <View style={styles.secao}>
        <Text style={styles.secaoTitulo}>Itens do Pedido</Text>
        {pedido.itens.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.itemIcone}>
              <Feather name="package" size={16} color="#F05A28" />
            </View>
            <Text style={styles.itemNome}>{item.quantidade}x {item.nome}</Text>
            <Text style={styles.itemPreco}>R$ {(item.preco * item.quantidade).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>R$ {pedido.total.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingTop: 80, paddingBottom: 40, gap: 20 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111" },
  pedidoId: { fontSize: 14, color: "#aaa", marginTop: -12 },
  etapasCard: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, gap: 16 },
  etapaRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  etapaIcone: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  etapaIconeAtiva: { backgroundColor: "#F05A28" },
  etapaLabel: { fontSize: 14, color: "#aaa" },
  etapaLabelAtiva: { color: "#111", fontWeight: "600" },
  secao: { gap: 10 },
  secaoTitulo: { fontSize: 16, fontWeight: "700", color: "#111" },
  secaoTexto: { fontSize: 14, color: "#555" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemIcone: { width: 32, height: 32, backgroundColor: "#FFF4F0", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemNome: { flex: 1, fontSize: 14, color: "#374151" },
  itemPreco: { fontSize: 14, fontWeight: "700", color: "#F05A28" },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 4 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#111" },
  totalValor: { fontSize: 18, fontWeight: "900", color: "#F05A28" },
});