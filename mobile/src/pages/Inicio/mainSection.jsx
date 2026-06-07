import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import imagemPosterInicio from "../../../assets/images/imagemPosterInicio.png";

function MainSection() {
  return (
    <View style={styles.container}>
      <Image
        source={imagemPosterInicio}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Descubra novas possibilidades.{"\n"}
          Economize e evite o desperdício ao mesmo tempo!
        </Text>
        <Text style={styles.subtitle}>
          Comprar comida boa não significa pagar caro...{"\n"}
          Ajude a não desperdiçar comida pagando bem menos.
        </Text>
        <Text style={styles.cta}>Comece a economizar agora!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>BAIXAR APP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 40, alignItems: "center", gap: 24 },
  image: { width: "100%", height: 250 },
  textContainer: { width: "100%", gap: 12 },
  title: { fontSize: 28, fontWeight: "bold", lineHeight: 36, color: "#111827" },
  subtitle: { fontSize: 16, color: "#4B5563", lineHeight: 24 },
  cta: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  button: { backgroundColor: "#F97316", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, alignSelf: "flex-start" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});

export default MainSection;