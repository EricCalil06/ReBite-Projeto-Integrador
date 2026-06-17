import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function AlterarSenha() {
  const { user } = useAuth();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar() {
    if (!senhaAtual || !novaSenha || !confirmar) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (novaSenha !== confirmar) {
      Alert.alert("Atenção", "A nova senha e a confirmação não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      Alert.alert("Atenção", "A nova senha deve ter ao menos 6 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      const res = await fetch(`http://10.0.2.2:5500/usuario/${user.id}/senha`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      const dados = await res.json();
      if (res.ok) {
        Alert.alert("Sucesso!", "Senha alterada com sucesso.", [
          { text: "OK", onPress: () => router.back() }
        ]);
      } else {
        Alert.alert("Erro", dados.mensagem || "Não foi possível alterar a senha.");
      }
    } catch {
      Alert.alert("Erro de conexão", "Verifique o servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color="#111" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Segurança e Privacidade</Text>
      <Text style={styles.subtitulo}>Alterar senha</Text>

      <Text style={styles.label}>Senha atual</Text>
      <TextInput style={styles.input} secureTextEntry placeholder="Digite sua senha atual" placeholderTextColor="#aaa" value={senhaAtual} onChangeText={setSenhaAtual} />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput style={styles.input} secureTextEntry placeholder="Mínimo 6 caracteres" placeholderTextColor="#aaa" value={novaSenha} onChangeText={setNovaSenha} />

      <Text style={styles.label}>Confirmar nova senha</Text>
      <TextInput style={styles.input} secureTextEntry placeholder="Repita a nova senha" placeholderTextColor="#aaa" value={confirmar} onChangeText={setConfirmar} />

      <TouchableOpacity style={[styles.btn, { opacity: salvando ? 0.6 : 1 }]} onPress={handleSalvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnTexto}>Salvar nova senha</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 80 },
  voltar: { position: "absolute", top: 48, left: 16, backgroundColor: "#fff", borderRadius: 999, padding: 8, elevation: 4 },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#111", marginBottom: 4 },
  subtitulo: { fontSize: 14, color: "#888", marginBottom: 32 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111", marginBottom: 16 },
  btn: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  btnTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});