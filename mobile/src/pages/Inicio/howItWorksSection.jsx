import { View, Text, StyleSheet } from "react-native";

const steps = [
  {
    number: "1º",
    title: "Escolha",
    text: ["Navegue pelo ", "APP", " e encontre ", "sacolas surpresas", " ou ", "ofertas", " de estabelecimentos perto de você."],
  },
  {
    number: "2º",
    title: "Reserve",
    text: ["Garanta sua comida pelo ", "APP", " com ", "DESCONTAÇOS"],
  },
  {
    number: "3º",
    title: "Resgate",
    text: ["Vá até o local no ", "horário indicado", " e retire sua refeição deliciosa."],
  },
];

function HowItWorksSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMO FUNCIONA?</Text>
      <View style={styles.cardsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.number}>{step.number}</Text>
              <Text style={styles.stepTitle}> {step.title}</Text>
            </View>
            <Text style={styles.text}>
              {step.text.map((part, i) =>
                i % 2 === 1 ? (
                  <Text key={i} style={styles.highlight}>{part}</Text>
                ) : (
                  <Text key={i}>{part}</Text>
                )
              )}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 24 },
  cardsContainer: { gap: 16 },
  card: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  header: { flexDirection: "row", alignItems: "baseline", marginBottom: 12 },
  number: { fontSize: 40, fontWeight: "bold" },
  stepTitle: { fontSize: 22, fontWeight: "bold" },
  text: { fontSize: 15, color: "#4B5563", lineHeight: 24 },
  highlight: { color: "#F97316", fontWeight: "bold" },
});

export default HowItWorksSection;