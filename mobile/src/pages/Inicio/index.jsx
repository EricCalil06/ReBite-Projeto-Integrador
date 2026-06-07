import { ScrollView, StyleSheet } from "react-native";
import MainSection from "./mainSection";
import CardsSection from "./cardsSection";
import BannerSection from "./bannerSection";
import CardsCTA from "./cardsCTA";
import HowItWorksSection from "./howItWorksSection";
import FaqSection from "./faqSection";

function Inicio({ navigation }) {
  return (
    <ScrollView style={styles.screen}>
      <MainSection />
      <CardsSection />
      <BannerSection />
      <CardsCTA navigation={navigation} />
      <HowItWorksSection />
      <FaqSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
});

export default Inicio;