import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const categorias = ["Sacolas surpresas", "Pães", "Doces", "Salgados"];

const lojas = [
  { id: 1, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 21, distancia: "1.2 km de você" },
  { id: 2, nome: "ATACADAO", avaliacao: 4, reviews: 61, distancia: "1.2 km de você" },
  { id: 3, nome: "Ortifruti doZê", avaliacao: 4, reviews: 0, distancia: "1.2 km de você" },
  { id: 4, nome: "Padaria Bela Vitória", avaliacao: 4, reviews: 21, distancia: "1.2 km de você" },
  { id: 5, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 71, distancia: "1.2 km de você" },
  { id: 6, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 11, distancia: "1.2 km de você" },
  { id: 7, nome: "Pizzaria Best Food", avaliacao: 4, reviews: 11, distancia: "1.2 km de você" },
  { id: 8, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 11, distancia: "1.2 km de você" },
  { id: 9, nome: "Padaria do Seu Jorge", avaliacao: 4, reviews: 11, distancia: "1.2 km de você" },
];

function Estrelas({ quantidade }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather
          key={i}
          name="star"
          size={13}
          color={i <= quantidade ? "#F05A28" : "#E5E7EB"}
        />
      ))}
    </View>
  );
}

export default function Lojas() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#888" />
          <TextInput
            placeholder="Pesquisar por produtos"
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={18} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
        {categorias.map((cat, i) => (
          <TouchableOpacity key={i} style={styles.categoriaChip}>
            <Text style={styles.categoriaText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.banner}>
        <Text style={styles.bannerSmall}>Economize{"\n"}e evite o desperdício!</Text>
        <Text style={styles.bannerBig}>até 70%</Text>
        <TouchableOpacity>
          <Text style={styles.bannerLink}>Confira os detalhes →</Text>
        </TouchableOpacity>
      </View>

      {lojas.slice(0, 3).map((loja) => (
        <TouchableOpacity key={loja.id} style={styles.lojaItem}>
          <View style={styles.lojaAvatar}>
            <Feather name="shopping-bag" size={24} color="#F05A28" />
          </View>
          <View style={styles.lojaInfo}>
            <Text style={styles.lojaNome}>{loja.nome}</Text>
            <Estrelas quantidade={loja.avaliacao} />
            <View style={styles.lojaDistanciaRow}>
              <Feather name="map-pin" size={12} color="#F05A28" />
              <Text style={styles.lojaDistancia}>{loja.distancia}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.secaoTitulo}>Lojas</Text>

      {lojas.slice(3).map((loja) => (
        <TouchableOpacity key={loja.id} style={styles.lojaItem}>
          <View style={styles.lojaAvatar}>
            <Feather name="shopping-bag" size={24} color="#F05A28" />
          </View>
          <View style={styles.lojaInfo}>
            <Text style={styles.lojaNome}>{loja.nome}</Text>
            <Estrelas quantidade={loja.avaliacao} />
            <View style={styles.lojaDistanciaRow}>
              <Feather name="map-pin" size={12} color="#F05A28" />
              <Text style={styles.lojaDistancia}>{loja.distancia}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { paddingTop: 60, paddingBottom: 100, paddingHorizontal: 16 },

  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 12, gap: 8, height: 44 },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  filterButton: { backgroundColor: "#F3F4F6", padding: 12, borderRadius: 12 },

  categoriasScroll: { marginBottom: 16 },
  categoriaChip: { backgroundColor: "#F3F4F6", borderRadius: 999, paddingVertical: 8, paddingHorizontal: 16, marginRight: 8 },
  categoriaText: { fontSize: 13, color: "#333", fontWeight: "500" },

  banner: { backgroundColor: "#1a1a1a", borderRadius: 16, padding: 20, marginBottom: 20, justifyContent: "center" },
  bannerSmall: { color: "#fff", fontSize: 14, lineHeight: 20 },
  bannerBig: { color: "#F05A28", fontSize: 48, fontWeight: "900", lineHeight: 56 },
  bannerLink: { color: "#fff", fontSize: 13, marginTop: 4 },

  lojaItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  lojaAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FFF0E8", alignItems: "center", justifyContent: "center" },
  lojaInfo: { flex: 1, gap: 4 },
  lojaNome: { fontSize: 15, fontWeight: "600", color: "#111" },
  lojaDistanciaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  lojaDistancia: { fontSize: 12, color: "#666" },

  secaoTitulo: { fontSize: 18, fontWeight: "bold", color: "#111", marginTop: 8, marginBottom: 4 },
});