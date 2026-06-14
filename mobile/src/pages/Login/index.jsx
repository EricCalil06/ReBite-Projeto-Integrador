import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import { Notification } from "../../components/customNotification.jsx";

const logo = require("../../../assets/images/logoReBiteH.png");

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [manterConectado, setManterConectado] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Notification.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Preencha e-mail e senha para continuar.',
        position: 'top'
      });
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5500/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        login({ id: data.id, nome: data.nome, cargo: data.cargo, token: data.token });

        Notification.show({
          type: 'success',
          text1: 'Bem-vindo(a)!',
          text2: 'Login realizado com sucesso.',
          position: 'top'
        });

        router.replace("/");
      } else {
        Notification.show({
          type: 'error',
          text1: 'Erro',
          text2: data.mensagem || "Credenciais inválidas.",
          position: 'top'
        });
      }
    } catch (err) {
      Notification.show({
        type: 'error',
        text1: 'Erro de conexão',
        text2: 'Verifique se o servidor está ligado.',
        position: 'top'
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o e-mail cadastrado"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setManterConectado(!manterConectado)}
      >
        <View style={[styles.checkbox, manterConectado && styles.checkboxAtivo]} />
        <Text style={styles.checkLabel}>Manter Conectado</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonPrimaryText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.ou}>OU</Text>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push("/cadastro")}
      >
        <Text style={styles.buttonSecondaryText}>Cadastre-se</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  logo: { width: 160, height: 80, alignSelf: "center", marginBottom: 40 },
  label: { fontSize: 15, fontWeight: "600", color: "#111", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111", marginBottom: 16 },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 24 },
  checkbox: { width: 18, height: 18, borderWidth: 1.5, borderColor: "#aaa", borderRadius: 4 },
  checkboxAtivo: { backgroundColor: "#F05A28", borderColor: "#F05A28" },
  checkLabel: { fontSize: 14, color: "#444" },
  buttonPrimary: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginBottom: 16 },
  buttonPrimaryText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  ou: { textAlign: "center", color: "#888", marginBottom: 16, fontSize: 15 },
  buttonSecondary: { backgroundColor: "#F3F4F6", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  buttonSecondaryText: { color: "#111", fontWeight: "bold", fontSize: 16 },
});