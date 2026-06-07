import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import imagemCardCTA1 from "../../../assets/images/ImagemCardCTA1.png";
import imagemCardCTA2 from "../../../assets/images/ImagemCardCTA2.png";

function CardsCTA({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Card 1 */}
      <View style={styles.card}>
        <Image source={imagemCardCTA1} style={styles.image} resizeMode="contain" />
        <Text style={styles.cardTitle}>
          Bateu a fome e a {"\n"}vontade de economizar?
        </Text>
        <Text style={styles.cardText}>
          Junte-se a milhares de pessoas que já estão comendo bem pagando muito menos. Salve refeições incríveis hoje mesmo.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>BAIXAR APP</Text>
        </TouchableOpacity>
      </View>

      {/* Card 2 */}
      <View style={styles.card}>
        <Image source={imagemCardCTA2} style={styles.image} resizeMode="contain" />
        <Text style={styles.cardTitle}>
          Comece a lucrar ainda hoje, ajudando a salvar alimentos
        </Text>
        <Text style={styles.cardText}>
          Junte-se a milhares de pessoas que já estão comendo bem pagando muito menos. Salve refeições incríveis hoje mesmo.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Lojistas")}
        >
          <Text style={styles.buttonText}>CADASTRAR UMA LOJA</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 24, gap: 32 },
  card: { alignItems: "center", gap: 12 },
  image: { width: 280, height: 220 },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#111827", textAlign: "center" },
  cardText: { fontSize: 15, color: "#374151", textAlign: "center", lineHeight: 22 },
  button: { backgroundColor: "#F05A28", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 999, marginTop: 8 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});

export default CardsCTA;