import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function CadastrarLojaMobile() {
  const { user } = useAuth();
  const [nomeLoja, setNomeLoja] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleCadastrar() {
    if (!nomeLoja.trim()) {
      Alert.alert("Campo obrigatório", "Digite o nome da loja.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch("http://10.0.2.2:5500/estabelecimento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-usuario-id": user?.id,
        },
        body: JSON.stringify({ nome: nomeLoja, descricao, endereco }),
      });

      if (res.ok) {
        Alert.alert("Loja criada!", "Seu estabelecimento foi configurado.", [
          { text: "OK", onPress: () => router.replace("/painel-loja") }
        ]);
      } else {
        const erro = await res.json();
        Alert.alert("Erro", erro.error || "Não foi possível cadastrar a loja.");
      }
    } catch (err) {
      Alert.alert("Erro de conexão", "Verifique o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name="shopping-bag" size={48} color="#F05A28" />
        </View>

        <Text style={styles.titulo}>Configure seu Estabelecimento</Text>
        <Text style={styles.subtitulo}>
          Seu perfil de Administrador ainda não possui uma loja ativa vinculada.
        </Text>

        <Text style={styles.label}>Nome da Loja / Franquia</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Padaria do Seu Jorge"
          placeholderTextColor="#aaa"
          value={nomeLoja}
          onChangeText={setNomeLoja}
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
          style={[styles.botao, { opacity: salvando ? 0.6 : 1 }]}
          onPress={handleCadastrar}
          disabled={salvando}
        >
          {salvando
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.botaoTexto}>Concluir e Abrir Painel</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  voltar: { position: "absolute", top: 48, left: 16, zIndex: 10, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4 },
  content: { paddingHorizontal: 28, paddingTop: 100, paddingBottom: 40, gap: 12 },
  iconContainer: { width: 88, height: 88, backgroundColor: "#FFE8DF", borderRadius: 24, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 8 },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#111", textAlign: "center" },
  subtitulo: { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#111" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 16, padding: 16, fontSize: 14, color: "#111" },
  inputMultiline: { height: 100, textAlignVertical: "top" },
  botao: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  botaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});