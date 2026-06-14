import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Header() {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.saudacao}>{saudacao},</Text>
        <Text style={styles.nome}>Usuário</Text>
      </View>
      
      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => router.push("/caixa-entrada")} 
        >
          <Ionicons name="notifications-outline" size={24} color="#111" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push("/conta")}>
          <Ionicons name="person-circle-outline" size={46} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  saudacao: { fontSize: 14, color: "#666" },
  nome: { fontSize: 22, fontWeight: "bold", color: "#111" },
  rightContainer: { flexDirection: "row", alignItems: "center" },
  iconButton: { marginRight: 16 },
});