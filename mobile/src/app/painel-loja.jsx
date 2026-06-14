import { useState, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Image, Alert
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function PainelLoja() {
  const { user } = useAuth();
  const [loja, setLoja] = useState(null);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarLoja();
  }, []);

  async function buscarLoja() {
    try {
      const res = await fetch("http://10.0.2.2:5500/estabelecimento/perfil", {
        headers: { "x-usuario-id": user?.id }
      });
      if (res.ok) {
        const dados = await res.json();
        setLoja(dados);
        setNome(dados.nome || "");
        setDescricao(dados.descricao || "");
        setEndereco(dados.endereco || "");
      }
    } catch (err) {
      console.error("Erro ao buscar loja:", err);
    } finally {
      setCarregando(false);
    }
  }

  async function salvar() {
    setSalvando(true);
    try {
      const res = await fetch("http://10.0.2.2:5500/estabelecimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-usuario-id": user?.id
        },
        body: JSON.stringify({ nome, descricao, endereco })
      });
      if (res.ok) {
        Alert.alert("Salvo!", "Dados da loja atualizados.");
        buscarLoja();
      } else {
        Alert.alert("Erro", "Não foi possível salvar.");
      }
    } catch (err) {
      Alert.alert("Erro de conexão", "Verifique o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F05A28" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.bemVindo}>Bem-vindo!</Text>
          <Text style={styles.titulo}>Sua Loja</Text>
        </View>
        <TouchableOpacity style={styles.salvarBtn} onPress={salvar} disabled={salvando}>
          {salvando
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.salvarBtnTexto}>SALVAR</Text>
          }
        </TouchableOpacity>
      </View>

      <View style={styles.lojaCard}>
        <View style={styles.lojaImagem}>
          <Feather name="shopping-bag" size={36} color="#F05A28" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.lojaNome}><Text style={{ fontWeight: "bold" }}>Nome: </Text>{loja?.nome || "—"}</Text>
          <Text style={styles.lojaNome}><Text style={{ fontWeight: "bold" }}>Total de Pedidos</Text></Text>
          <Text style={styles.lojaPedidos}>{loja?.totalPedidos || 0}</Text>
        </View>
        <View style={styles.dot} />
      </View>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome cadastrado"
        placeholderTextColor="#aaa"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        placeholder="Coloque sua descrição"
        placeholderTextColor="#aaa"
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o endereço da sua loja"
        placeholderTextColor="#aaa"
        value={endereco}
        onChangeText={setEndereco}
      />

      <TouchableOpacity
        style={styles.menuBtn}
        onPress={() => router.push({ pathname: "/catalogo", params: { lojaId: loja?._id } })}
      >
        <Text style={styles.menuBtnTexto}>Catálogo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuBtn, { marginTop: 12 }]}>
        <Text style={styles.menuBtnTexto}>Sacolas Surpresas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 20 },
  bemVindo: { fontSize: 13, color: "#888" },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111" },
  salvarBtn: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 24 },
  salvarBtnTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  lojaCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#F9F9F9", borderRadius: 16, padding: 16, marginBottom: 24, position: "relative" },
  lojaImagem: { width: 72, height: 72, backgroundColor: "#FFE8DF", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  lojaNome: { fontSize: 14, color: "#111", lineHeight: 22 },
  lojaPedidos: { fontSize: 22, fontWeight: "bold", color: "#111" },
  dot: { position: "absolute", bottom: 16, left: 76, width: 12, height: 12, borderRadius: 6, backgroundColor: "#F05A28" },
  label: { fontSize: 15, fontWeight: "600", color: "#111", marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 14, fontSize: 14, color: "#111" },
  inputMultiline: { height: 100, textAlignVertical: "top" },
  menuBtn: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginTop: 24 },
  menuBtnTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});