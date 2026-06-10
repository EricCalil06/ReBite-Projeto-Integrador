import { ScrollView, StyleSheet } from "react-native";
import Header from "./header";
import BannerHome from "./bannerHome";
import PecaNovamente from "./pecaNovamente";
import ListaLojas from "./listaLojas";

export default function Inicio() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Header />
      <BannerHome />
      <PecaNovamente />
      <ListaLojas />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { paddingBottom: 100 },
});