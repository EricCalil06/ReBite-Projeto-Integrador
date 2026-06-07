import { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const faqData = [
  { question: "Minha entrega não veio certo, o que eu posso fazer?" },
  { question: "Como eu faço para pagar as minhas compras?" },
  { question: "Onde eu vejo os métodos de entrega da loja?" },
  { question: "Perdi a senha da minha conta. O que eu posso fazer?" },
  { question: "Para que serve o código de segurança nas entregas?" },
];

export default function Conta() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <Text style={styles.welcome}>Bem-vindo!</Text>
          <Text style={styles.username}>Usuário</Text>
          <Text style={styles.congrats}>Parabéns! Você economizou até agora:</Text>
          <Text style={styles.kg}>22kg de Alimento</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={styles.avatar}
        />
      </View>

      <TouchableOpacity style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>Acessar painel da loja</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Configurações</Text>

      <View style={styles.configList}>
        <TouchableOpacity style={styles.configItem}>
          <Feather name="shield" size={22} color="#111" />
          <Text style={styles.configText}>Segurança e Privacidade</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.configItem}>
          <Feather name="credit-card" size={22} color="#111" />
          <Text style={styles.configText}>Dados do Perfil</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Precisa de ajuda?</Text>
      <Text style={styles.sectionSubtitle}>
        Confira o nosso FAQ e veja se sua dúvida está aqui
      </Text>

      <View style={styles.faqList}>
        {faqData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleFaq(index)}
          >
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Feather
              name="chevron-down"
              size={20}
              color="#111"
              style={{ transform: [{ rotate: openFaq === index ? "180deg" : "0deg" }] }}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.support}>
        Não encontrou sua dúvida no FAQ?{" "}
        <Text style={styles.supportLink}>Clique aqui</Text>
        {" "}e fale com{"\n"}nosso suporte
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },

  profileCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F9F9F9", borderRadius: 16, padding: 16, marginBottom: 16 },
  profileInfo: { flex: 1, marginRight: 12 },
  welcome: { fontSize: 13, color: "#555" },
  username: { fontSize: 28, fontWeight: "bold", color: "#111" },
  congrats: { fontSize: 13, color: "#555", marginTop: 4 },
  kg: { fontSize: 18, fontWeight: "bold", color: "#F05A28", marginTop: 2 },
  avatar: { width: 72, height: 72, borderRadius: 36 },

  ctaButton: { backgroundColor: "#F05A28", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginBottom: 28 },
  ctaButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, color: "#666", marginBottom: 12 },

  configList: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, marginBottom: 28, overflow: "hidden" },
  configItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  configText: { fontSize: 15, color: "#111" },
  divider: { height: 1, backgroundColor: "#E5E7EB" },

  faqList: { gap: 0, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 20 },
  faqItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  faqQuestion: { fontSize: 14, color: "#111", flex: 1, marginRight: 8 },

  support: { fontSize: 13, color: "#555", textAlign: "center", lineHeight: 20 },
  supportLink: { color: "#F05A28", fontWeight: "600" },
});