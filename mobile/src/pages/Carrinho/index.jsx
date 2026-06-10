import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCarrinho } from "../../context/CarrinhoContext";

export default function CarrinhoScreen() {
  const { itens, removerItem, total } = useCarrinho();

  const kgSalvos = (itens.length * 0.5).toFixed(1);
  const data = new Date().toLocaleDateString("pt-BR");

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Feather name="shopping-cart" size={22} color="#111" />
          <Text style={styles.titulo}>Carrinho</Text>
        </View>

        {itens.length === 0 ? (
          <View style={styles.vazio}>
            <Feather name="shopping-cart" size={48} color="#E5E7EB" />
            <Text style={styles.vazioTexto}>Seu carrinho está vazio</Text>
          </View>
        ) : (
          <View style={styles.lojaCard}>
            <View style={styles.lojaHeader}>
              <View>
                <Text style={styles.lojaNome}>{itens[0]?.loja}</Text>
                <Text style={styles.lojaData}>{data} - Nº de pedido: 190823</Text>
              </View>
              <TouchableOpacity style={styles.visitarBtn}>
                <Text style={styles.visitarBtnTexto}>Visitar loja</Text>
              </TouchableOpacity>
            </View>

            {itens.map((item, index) => (
              <TouchableOpacity key={index} onLongPress={() => removerItem(index)}>
                <View style={styles.itemRow}>
                  <View style={styles.itemImagem}>
                    <Feather name="package" size={20} color="#F05A28" />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNome}>{item.nome}</Text>
                    <Text style={styles.itemQtd}>1 Unidade</Text>
                  </View>
                  <View style={styles.itemPrecos}>
                    <Text style={styles.itemPreco}>R$ {item.preco.toFixed(2)} / {item.unidade}</Text>
                    <Text style={styles.itemPrecoOriginal}>R$ {item.precoOriginal.toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.entregaCard}>
          <Text style={styles.entregaTitulo}>Entrega:</Text>
          <Text style={styles.entregaTipo}>Retirar no estabelecimento</Text>
          <Text style={styles.entregaEndereco}>
            Estr. das Lágrimas, 1666 - Mauá, São Caetano do Sul - SP, 09580-500
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalTitulo}>Total do carrinho:</Text>
          <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
          <Text style={styles.totalEconomia}>
            Nessa compra você salva {kgSalvos}kg de alimento
          </Text>
        </View>

        <TouchableOpacity style={styles.botaoFinalizar}>
          <Text style={styles.botaoFinalizarTexto}>Finalizar o carrinho</Text>
        </TouchableOpacity>

        <Text style={styles.termos}>
          Ao finalizar o carrinho você aceita todos os nossos termos e condições.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4 },
  content: { paddingTop: 96, paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111" },
  vazio: { alignItems: "center", justifyContent: "center", gap: 12, paddingVertical: 60 },
  vazioTexto: { fontSize: 16, color: "#aaa" },
  lojaCard: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, gap: 12 },
  lojaHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  lojaNome: { fontSize: 15, fontWeight: "700", color: "#111" },
  lojaData: { fontSize: 12, color: "#888", marginTop: 2 },
  visitarBtn: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14 },
  visitarBtnTexto: { color: "#fff", fontWeight: "600", fontSize: 13 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  itemImagem: { width: 44, height: 44, backgroundColor: "#F3F4F6", borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 13, fontWeight: "600", color: "#111" },
  itemQtd: { fontSize: 12, color: "#888" },
  itemPrecos: { alignItems: "flex-end" },
  itemPreco: { fontSize: 13, fontWeight: "700", color: "#F05A28" },
  itemPrecoOriginal: { fontSize: 11, color: "#aaa", textDecorationLine: "line-through" },
  entregaCard: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, gap: 4 },
  entregaTitulo: { fontSize: 15, fontWeight: "700", color: "#111" },
  entregaTipo: { fontSize: 14, color: "#F05A28", fontWeight: "600" },
  entregaEndereco: { fontSize: 13, color: "#555" },
  totalCard: { gap: 4 },
  totalTitulo: { fontSize: 15, fontWeight: "700", color: "#111" },
  totalValor: { fontSize: 22, fontWeight: "900", color: "#F05A28" },
  totalEconomia: { fontSize: 13, color: "#F05A28" },
  botaoFinalizar: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  botaoFinalizarTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  termos: { fontSize: 11, color: "#aaa", textAlign: "center" },
});