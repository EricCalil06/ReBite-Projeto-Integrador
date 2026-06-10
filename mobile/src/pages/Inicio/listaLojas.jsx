import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const lojas = [
  { id: 1, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 21 },
  { id: 2, nome: "ATACADAO", avaliacao: 4, reviews: 61 },
  { id: 3, nome: "Ortifruti doZê", avaliacao: 4, reviews: 0 },
  { id: 4, nome: "Padaria Bela Vitória", avaliacao: 4, reviews: 21 },
  { id: 5, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 71 },
  { id: 6, nome: "Pizzaria Best Food", avaliacao: 4, reviews: 11 },
  { id: 7, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 11 },
  { id: 8, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 11 },
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

export default function ListaLojas() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lojas</Text>
      {lojas.map((loja) => (
        <TouchableOpacity
          key={loja.id}
          style={styles.item}
          onPress={() => router.push(`/loja/${loja.id}`)}
        >
          <View style={styles.logo}>
            <Feather name="shopping-bag" size={24} color="#F05A28" />
          </View>
          <View style={styles.info}>
            <Text style={styles.nome}>{loja.nome}</Text>
            <View style={styles.avaliacaoRow}>
              <Estrelas quantidade={loja.avaliacao} />
              {loja.reviews > 0 && (
                <Text style={styles.reviews}>({loja.reviews})</Text>
              )}
            </View>
            <View style={styles.distanciaRow}>
              <Feather name="map-pin" size={12} color="#F05A28" />
              <Text style={styles.distancia}>1.2 km de você</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 12 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  logo: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FFF0E8", alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: 4 },
  nome: { fontSize: 15, fontWeight: "600", color: "#111" },
  avaliacaoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  reviews: { fontSize: 12, color: "#666" },
  distanciaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  distancia: { fontSize: 12, color: "#666" },
});