import { View, Text, Image, StyleSheet } from "react-native";

export default function Header() {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.saudacao}>{saudacao},</Text>
        <Text style={styles.nome}>Usuário</Text>
      </View>
      <Image
        source={{ uri: "https://i.pravatar.cc/100" }}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  saudacao: { fontSize: 14, color: "#666" },
  nome: { fontSize: 22, fontWeight: "bold", color: "#111" },
  avatar: { width: 44, height: 44, borderRadius: 22 },
});