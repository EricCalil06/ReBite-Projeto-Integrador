import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

function CardsSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore novas opções:</Text>
      <View style={styles.cardsRow}>

        <TouchableOpacity style={styles.card}>
          <View style={styles.iconBox}>
            <Feather name="shopping-bag" size={36} color="#F97316" />
          </View>
          <Text style={styles.cardText}>
            Sacolas surpresas com{"\n"}categorias específicas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <View style={styles.iconBox}>
            <Feather name="book-open" size={36} color="#F97316" />
          </View>
          <Text style={styles.cardText}>
            Monte sua Sacola via{"\n"}catálogo do lojista
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 16, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", color: "#030712", marginBottom: 16 },
  cardsRow: { flexDirection: "column", gap: 12, width: "100%" },
  card: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16 },
  iconBox: { backgroundColor: "#FFF7ED", padding: 10, borderRadius: 12 },
  cardText: { fontSize: 15, fontWeight: "500", color: "#374151", lineHeight: 22 },
});

export default CardsSection;