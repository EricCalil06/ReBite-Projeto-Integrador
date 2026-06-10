import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const lojas = [
  { id: 1, nome: "Padaria do Seu Jorge", avaliacao: 4 },
  { id: 2, nome: "ATACADAO", avaliacao: 4 },
  { id: 3, nome: "Ortifruti", avaliacao: 4 },
];

function Estrelas({ quantidade }) {
  return (
    <View style={{ flexDirection: "row", gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather key={i} name="star" size={11} color={i <= quantidade ? "#F05A28" : "#E5E7EB"} />
      ))}
    </View>
  );
}

export default function PecaNovamente() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Peça novamente</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lojas.map((loja) => (
          <TouchableOpacity
            key={loja.id}
            style={styles.card}
            onPress={() => router.push(`/loja/${loja.id}`)}
          >
            <View style={styles.logo}>
              <Feather name="shopping-bag" size={24} color="#F05A28" />
            </View>
            <Text style={styles.nome} numberOfLines={2}>{loja.nome}</Text>
            <Estrelas quantidade={loja.avaliacao} />
            <View style={styles.distanciaRow}>
              <Feather name="map-pin" size={11} color="#F05A28" />
              <Text style={styles.distancia}>1.2 km de você</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 20, marginBottom: 24 },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 12 },
  card: { width: 110, marginRight: 12, alignItems: "center", gap: 6 },
  logo: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#FFF0E8", alignItems: "center", justifyContent: "center" },
  nome: { fontSize: 12, fontWeight: "600", color: "#111", textAlign: "center" },
  distanciaRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  distancia: { fontSize: 11, color: "#666" },
});