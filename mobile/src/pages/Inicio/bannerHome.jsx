import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BannerHome() {
  return (
    <View style={styles.banner}>
      <View>
        <Text style={styles.bannerSmall}>Economize{"\n"}e evite o desperdício!</Text>
        <Text style={styles.bannerBig}>até 70%</Text>
        <TouchableOpacity>
          <Text style={styles.bannerLink}>Confira os detalhes →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: "#1a1a1a", borderRadius: 20, marginHorizontal: 20, padding: 24, marginBottom: 24 },
  bannerSmall: { color: "#fff", fontSize: 14, lineHeight: 20 },
  bannerBig: { color: "#F05A28", fontSize: 52, fontWeight: "900", lineHeight: 60 },
  bannerLink: { color: "#fff", fontSize: 13, marginTop: 4 },
});