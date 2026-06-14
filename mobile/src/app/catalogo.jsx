import { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, ActivityIndicator, Alert, Modal,
  TextInput, ScrollView, KeyboardAvoidingView, Platform
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const FORM_VAZIO = {
  nome: "", descricao: "", preco: "", quantidade: "",
  validade: "", alertasAlergicos: "", categoria: "", tipo: "avulso", peso: ""
};

export default function Catalogo() {
  const { lojaId } = useLocalSearchParams();
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionados, setSelecionados] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (lojaId) buscarProdutos();
  }, [lojaId]);

  async function buscarProdutos() {
    try {
      const res = await fetch(`http://10.0.2.2:5500/estabelecimento/${lojaId}`);
      if (res.ok) {
        const dados = await res.json();
        const todosProdutos = (dados.categoriasProdutos || [])
          .flatMap(cat => cat.produtos)
          .concat(dados.sacolas || []);
        setProdutos(todosProdutos);
      }
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    } finally {
      setCarregando(false);
    }
  }

  function toggleSelecionado(id) {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function cadastrarProduto() {
    if (!form.nome || !form.preco || !form.quantidade || !form.validade || !form.categoria) {
      Alert.alert("Campos obrigatórios", "Preencha nome, preço, quantidade, validade e categoria.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch("http://10.0.2.2:5500/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-usuario-id": user?.id,
          "x-estabelecimento-id": lojaId,
        },
        body: JSON.stringify({
          ...form,
          preco: Number(form.preco),
          quantidade: Number(form.quantidade),
          validade: new Date(form.validade).toISOString(),
          peso: Number(form.peso) || 0,
        }),
      });

      if (res.ok) {
        Alert.alert("Sucesso!", "Produto cadastrado.");
        setModalVisivel(false);
        setForm(FORM_VAZIO);
        buscarProdutos();
      } else {
        const erro = await res.json();
        Alert.alert("Erro", erro.error || "Não foi possível cadastrar.");
      }
    } catch (err) {
      Alert.alert("Erro de conexão", "Verifique o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirSelecionados() {
    Alert.alert("Excluir", `Excluir ${selecionados.length} produto(s)?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive", onPress: () => {
          Alert.alert("Em breve", "Rota de exclusão ainda não implementada no backend.");
        }
      }
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#F05A28" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={styles.bemVindo}>Bem-vindo!</Text>
        <Text style={styles.titulo}>Sua Loja</Text>
      </View>

      <View style={styles.abaAtiva}>
        <Text style={styles.abaTexto}>Catálogo</Text>
      </View>

      <View style={styles.cadastroRow}>
        <Text style={styles.cadastroTitulo}>Cadastro de produto</Text>
        <View style={styles.cadastroBtns}>
          <TouchableOpacity style={styles.cadastroBtn} onPress={() => setModalVisivel(true)}>
            <Text style={styles.cadastroBtnTexto}>Manual</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cadastroBtn, styles.cadastroBtnOutline]}>
            <Text style={[styles.cadastroBtnTexto, { color: "#F05A28" }]}>Automático</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item, i) => item.id || item._id || String(i)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const id = item.id || item._id;
          const selecionado = selecionados.includes(id);
          return (
            <View style={styles.produtoRow}>
              <TouchableOpacity onPress={() => toggleSelecionado(id)}>
                <View style={[styles.radio, selecionado && styles.radioSelecionado]} />
              </TouchableOpacity>
              <Text style={styles.produtoNome}>{item.nome || "Produto"}</Text>
              <TouchableOpacity style={styles.iconeBtn}>
                <Feather name="edit-2" size={18} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconeBtn}>
                <Feather name="trash-2" size={18} color="#F05A28" />
              </TouchableOpacity>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
      />

      {/* MODAL CADASTRO MANUAL */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Novo Produto</Text>
              <TouchableOpacity onPress={() => { setModalVisivel(false); setForm(FORM_VAZIO); }}>
                <Feather name="x" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { label: "Nome *", key: "nome", placeholder: "Ex: Pão Francês" },
                { label: "Descrição", key: "descricao", placeholder: "Opcional" },
                { label: "Preço (R$) *", key: "preco", placeholder: "Ex: 4.50", keyboard: "numeric" },
                { label: "Quantidade *", key: "quantidade", placeholder: "Ex: 10", keyboard: "numeric" },
                { label: "Validade * (AAAA-MM-DD)", key: "validade", placeholder: "Ex: 2026-06-30" },
                { label: "Alérgicos", key: "alertasAlergicos", placeholder: "Ex: Glúten, Lactose" },
                { label: "Categoria *", key: "categoria", placeholder: "Ex: Pães, Doces" },
                { label: "Peso (kg)", key: "peso", placeholder: "Ex: 0.5", keyboard: "numeric" },
              ].map(({ label, key, placeholder, keyboard }) => (
                <View key={key} style={styles.campoGroup}>
                  <Text style={styles.campoLabel}>{label}</Text>
                  <TextInput
                    style={styles.campoInput}
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    keyboardType={keyboard || "default"}
                    value={form[key]}
                    onChangeText={v => setForm(prev => ({ ...prev, [key]: v }))}
                  />
                </View>
              ))}

              <View style={styles.campoGroup}>
                <Text style={styles.campoLabel}>Tipo *</Text>
                <View style={styles.tipoRow}>
                  {["avulso", "sacola_surpresa"].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.tipoBtn, form.tipo === t && styles.tipoBtnAtivo]}
                      onPress={() => setForm(prev => ({ ...prev, tipo: t }))}
                    >
                      <Text style={[styles.tipoBtnTexto, form.tipo === t && { color: "#fff" }]}>
                        {t === "avulso" ? "Avulso" : "Sacola Surpresa"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.cadastroBtn, { marginTop: 20, opacity: salvando ? 0.6 : 1 }]}
                onPress={cadastrarProduto}
                disabled={salvando}
              >
                {salvando
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={styles.cadastroBtnTexto}>Cadastrar Produto</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4 },
  headerRow: { paddingHorizontal: 20, paddingTop: 60, marginBottom: 16 },
  bemVindo: { fontSize: 13, color: "#888" },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111" },
  abaAtiva: { backgroundColor: "#FFE8DF", marginHorizontal: 20, borderRadius: 12, paddingVertical: 12, alignItems: "center", marginBottom: 20 },
  abaTexto: { color: "#F05A28", fontWeight: "bold", fontSize: 15 },
  cadastroRow: { paddingHorizontal: 20, marginBottom: 12 },
  cadastroTitulo: { fontSize: 16, fontWeight: "bold", color: "#111", marginBottom: 10 },
  cadastroBtns: { flexDirection: "row", gap: 12 },
  cadastroBtn: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 10, paddingHorizontal: 24, alignItems: "center" },
  cadastroBtnOutline: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#F05A28" },
  cadastroBtnTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  lista: { paddingHorizontal: 20, paddingBottom: 40 },
  produtoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#ccc" },
  radioSelecionado: { borderColor: "#F05A28", backgroundColor: "#F05A28" },
  produtoNome: { flex: 1, fontSize: 15, color: "#111" },
  iconeBtn: { padding: 4 },
  separador: { height: 1, backgroundColor: "#F3F4F6" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "90%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitulo: { fontSize: 20, fontWeight: "bold", color: "#111" },
  campoGroup: { marginBottom: 14 },
  campoLabel: { fontSize: 13, fontWeight: "600", color: "#111", marginBottom: 6 },
  campoInput: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, fontSize: 14, color: "#111" },
  tipoRow: { flexDirection: "row", gap: 12 },
  tipoBtn: { flex: 1, borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 999, paddingVertical: 10, alignItems: "center" },
  tipoBtnAtivo: { backgroundColor: "#F05A28", borderColor: "#F05A28" },
  tipoBtnTexto: { fontWeight: "bold", color: "#555", fontSize: 14 },
});