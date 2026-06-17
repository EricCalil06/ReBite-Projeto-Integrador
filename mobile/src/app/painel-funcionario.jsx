// painel-funcionario.jsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function PainelFuncionario() {
  const { user } = useAuth();

  const lojaId = user?.estabelecimentoId;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Feather name="shopping-bag" size={28} color="#F05A28" />
        <Text style={styles.titulo}>Painel do Funcionário</Text>
      </View>

      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => router.push({ pathname: "/catalogo", params: { lojaId } })}
      >
        <Feather name="grid" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.menuBtnTexto}>Catálogo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuBtn, { marginTop: 12 }]}>
        <Feather name="package" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.menuBtnTexto}>Sacolas Surpresas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F9F9F9" },
  content: { padding: 24, paddingTop: 60 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 32 },
  titulo: { fontSize: 22, fontWeight: "800", color: "#111" },
  menuBtn: {
    backgroundColor: "#F05A28",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  menuBtnTexto: { color: "#fff", fontWeight: "700", fontSize: 16 },
});