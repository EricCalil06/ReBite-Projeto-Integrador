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
    if (user?.id) buscarPedidos();
  }, [user]);

  async function buscarPedidos() {
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
    return "#9CA3AF";
  };

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F05A28" />
      </View>
    );
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
            <View key={pedido._id} style={styles.card}>
              
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

            </View>
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
});