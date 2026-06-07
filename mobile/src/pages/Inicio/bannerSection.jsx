import { View, Image, StyleSheet, Dimensions } from "react-native";
import bannerDesperdicio from "../../../assets/images/bannerDesperdicio.png";

const { width } = Dimensions.get("window");

function BannerSection() {
  return (
    <View style={styles.container}>
      <Image
        source={bannerDesperdicio}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginVertical: 24 },
  image: { width: width, height: 220 },
});

export default BannerSection;