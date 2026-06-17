import { useState, useEffect} from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Pedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (user?.id) {
      buscarPedidos();
    } else {
      setPedidos([]);
      setCarregando(false);
    }
  }, [user]);

  async function buscarPedidos() {
      setCarregando(true);
      setPedidos([]);
    try {
      const res = await fetch(`http://10.0.2.2:5500/pedidos/usuario/${user.id}`);
      if (res.ok) setPedidos(await res.json());
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setCarregando(false);
    }
  }

  const statusCor = (status) => {
    if (status === "Pendente") return "#F59E0B";
    if (status === "Pronto") return "#10B981";
    if (status === "Pronto") return "#10B981";
    if (status === "Retirado") return "#6B7280";
    return "#9CA3AF";
  };

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F05A28" />
      </View>
    );
  }

  async function confirmarRetirada(pedidoId) {
    try {
      const res = await fetch(`http://10.0.2.2:5500/pedidos/${pedidoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Retirado" }),
      });
      if (res.ok) {
        setPedidos(prev =>
          prev.map(p => p._id === pedidoId ? { ...p, status: "Retirado" } : p)
        );
      }
    } catch (err) {
      console.error("Erro ao confirmar retirada:", err);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Meus Pedidos</Text>

      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={64} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
          <Text style={styles.emptySubtitle}>
            Você ainda não tem pedidos registrados.{"\n"}Que tal fazer o seu primeiro?
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/lojas")}>
            <Text style={styles.buttonText}>Fazer seu primeiro pedido</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.lista} showsVerticalScrollIndicator={false}>
          {pedidos.map((pedido) => (
            <TouchableOpacity key={pedido._id} style={styles.card} onPress={() => router.push(`/pedido/${pedido._id}`)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>Pedido #{pedido._id.slice(-6).toUpperCase()}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusCor(pedido.status) + "20" }]}>
                  <Text style={[styles.statusTexto, { color: statusCor(pedido.status) }]}>
                    {pedido.status || "Pendente"}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

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

              <View style={styles.cardFooter}>
                <Text style={styles.data}>
                  {new Date(pedido.createdAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(pedido.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={styles.total}>R$ {pedido.total.toFixed(2)}</Text>
              </View>
              {pedido.status === "Pronto" && (
                <TouchableOpacity>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 60 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 24 },
  lista: { gap: 16, paddingBottom: 120 },
  card: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, gap: 12, backgroundColor: "#fff" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardId: { fontSize: 13, fontWeight: "700", color: "#374151" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusTexto: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemIcone: { width: 32, height: 32, backgroundColor: "#FFF4F0", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemNome: { flex: 1, fontSize: 13, color: "#374151", fontWeight: "500" },
  itemPreco: { fontSize: 13, fontWeight: "700", color: "#F05A28" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  data: { fontSize: 12, color: "#9CA3AF" },
  total: { fontSize: 16, fontWeight: "900", color: "#111" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, marginTop: -80 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#111" },
  emptySubtitle: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22 },
  button: { backgroundColor: "#F05A28", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999, marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  btnRetirada: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  backgroundColor: "#10B981",
  borderRadius: 12,
  paddingVertical: 12,
  marginTop: 12,
},
btnRetiradaTexto: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 14,
},
});