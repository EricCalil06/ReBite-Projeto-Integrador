import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const faqData = [
  { question: "Minha entrega não veio certo, o que eu posso fazer?", answer: "Entre em contato pelo chat do aplicativo ou acesse a área de reports para relatar o problema. O lojista será notificado." },
  { question: "Como eu faço para pagar as minhas compras?", answer: "Aceitamos PIX, cartões de crédito e débito diretamente pelo aplicativo com total segurança." },
  { question: "Onde eu vejo os métodos de entrega da loja?", answer: "Na página de cada estabelecimento, antes de finalizar a compra, você verá se eles oferecem delivery ou apenas retirada no local." },
  { question: "Perdi a senha da minha conta. O que eu posso fazer?", answer: "Na tela de login, clique em 'Esqueci minha senha' e enviaremos um link de recuperação para o seu e-mail." },
  { question: "Para que serve o código de segurança nas entregas?", answer: "É a garantia de que você (ou o entregador) retirou a sacola correta. Basta informar os 4 números ao atendente." },
];

function FaqSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Precisa de ajuda?</Text>
      <Text style={styles.subtitle}>Confira o nosso FAQ e veja se sua dúvida está aqui</Text>

      <View style={styles.faqList}>
        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity style={styles.faqButton} onPress={() => toggleFaq(index)}>
              <Text style={[styles.question, openFaq === index && styles.questionActive]}>
                {item.question}
              </Text>
              <Feather
                name="chevron-down"
                size={22}
                color={openFaq === index ? "#F97316" : "#6B7280"}
                style={{ transform: [{ rotate: openFaq === index ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>
            {openFaq === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 40 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#4B5563", marginBottom: 24 },
  faqList: { gap: 12 },
  faqItem: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#F3F4F6", elevation: 1 },
  faqButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  question: { fontSize: 15, fontWeight: "500", color: "#1F2937", flex: 1, marginRight: 12 },
  questionActive: { color: "#F97316" },
  answer: { paddingHorizontal: 20, paddingBottom: 20, fontSize: 15, color: "#4B5563", lineHeight: 22 },
});

export default FaqSection;