// components/CarrinhoFlutuante.jsx
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCarrinho } from "../context/CarrinhoContext";

export default function CarrinhoFlutuante() {
  const { itens } = useCarrinho();

  if (itens.length === 0) return null; // só aparece se tiver itens

  return (
    <TouchableOpacity style={styles.botao} onPress={() => router.push("/carrinho")}>
      <Feather name="shopping-cart" size={22} color="#fff" />
      <View style={styles.badge}>
        <Text style={styles.badgeTexto}>{itens.length}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    position: "absolute",
    bottom: 150,
    right: 24,
    backgroundColor: "#F05A28",
    borderRadius: 999,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 999,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#111",
    borderRadius: 999,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTexto: { color: "#fff", fontSize: 11, fontWeight: "bold" },
});