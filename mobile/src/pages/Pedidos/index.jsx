import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Pedidos() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Pedidos</Text>

      <View style={styles.emptyContainer}>
        <Feather name="shopping-bag" size={64} color="#E5E7EB" />
        <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
        <Text style={styles.emptySubtitle}>
          Você ainda não tem pedidos registrados.{"\n"}Que tal fazer o seu primeiro?
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/lojas")}
        >
          <Text style={styles.buttonText}>Fazer seu primeiro pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 60 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, marginTop: -80 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#111" },
  emptySubtitle: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22 },
  button: { backgroundColor: "#F05A28", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999, marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});