import { useState, useEffect } from "react"; // Importado hooks para gerenciar o estado e ciclo de vida
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

function Estrelas({ quantidade }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Feather key={i} name="star" size={13} color={i <= quantidade ? "#F05A28" : "#E5E7EB"} />
      ))}
    </View>
  );
}

export default function ListaLojas() {
  // Estados para armazenar as lojas vindas do banco e o controle de carregamento
  const [lojas, setLojas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarLojas() {
      try {
        // IP padrão para acessar o localhost da máquina a partir do emulador Android (10.0.2.2)
        const response = await fetch("http://10.0.2.2:5500/estabelecimento/todos");
        
        if (response.ok) {
          const dados = await response.json();
          setLojas(dados);
        } else {
          console.error("Erro ao buscar a lista de estabelecimentos");
        }
      } catch (error) {
        console.error("Erro de conexão ao buscar lojas:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarLojas();
  }, []);

  // Se o banco ainda estiver respondendo, exibe um indicador de progresso limpo
  if (carregando) {
    return (
      <View style={[styles.container, { paddingVertical: 20, alignItems: "center" }]}>
        <ActivityIndicator size="small" color="#F05A28" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lojas</Text>
      
      {lojas.length === 0 ? (
        <Text style={styles.distancia}>Nenhum estabelecimento encontrado.</Text>
      ) : (
        lojas.map((loja) => (
          <TouchableOpacity
            key={loja._id} // Alterado para _id padrão do MongoDB
            style={styles.item}
            onPress={() => router.push(`/loja/${loja._id}`)} // Navega passando o ID real do banco
          >
            <View style={styles.logo}>
              <Feather name="shopping-bag" size={24} color="#F05A28" />
            </View>
            <View style={styles.info}>
              <Text style={styles.nome}>{loja.nome}</Text>
              
              <View style={styles.avaliacaoRow}>
                {/* Se não houver avaliação cadastrada no banco, assume o fallback padrão de 4 */}
                <Estrelas quantidade={loja.avaliacao || 4} />
                {(loja.reviews > 0 || loja.reviews === 0) && (
                  <Text style={styles.reviews}>({loja.reviews || 0})</Text>
                )}
              </View>
              
              <View style={styles.distanciaRow}>
                <Feather name="map-pin" size={12} color="#F05A28" />
                {/* Se o banco tiver endereço/distância cadastrados, exibe o real, senão o mock padrão */}
                <Text style={styles.distancia}>{loja.distancia || "1.2 km de você"}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  titulo: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 12 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  logo: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FFF0E8", alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: 4 },
  nome: { fontSize: 15, fontWeight: "600", color: "#111" },
  avaliacaoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  reviews: { fontSize: 12, color: "#666" },
  distanciaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  distancia: { fontSize: 12, color: "#666" },
});