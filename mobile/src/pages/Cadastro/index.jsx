import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";

const logo = require("../../../assets/images/logoReBiteH.png");

export default function Cadastro() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [mostrarData, setMostrarData] = useState(false);
  const [apelido, setApelido] = useState("");
  const [manterConectado, setManterConectado] = useState(false);
  const [termos, setTermos] = useState(false);

  const handleConfirmarData = (data) => {
    setDataNascimento(data);
    setMostrarData(false);
  };

  const formatarData = (data) => {
    if (!data) return "Selecione sua data de nascimento";
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleCadastro = () => {
    login();
    router.replace("/");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Coloque o e-mail de sua preferência"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Crie sua senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Crie uma senha"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Confirme sua senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        placeholderTextColor="#aaa"
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setMostrarData(true)}
      >
        <Text style={[styles.dateText, !dataNascimento && styles.placeholder]}>
          {formatarData(dataNascimento)}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={mostrarData}
        mode="date"
        onConfirm={handleConfirmarData}
        onCancel={() => setMostrarData(false)}
        maximumDate={new Date()}
        locale="pt-BR"
      />

      <Text style={styles.label}>Como você deseja ser chamado?</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira seu apelido"
        placeholderTextColor="#aaa"
        value={apelido}
        onChangeText={setApelido}
      />

      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setManterConectado(!manterConectado)}
      >
        <View style={[styles.checkbox, manterConectado && styles.checkboxAtivo]} />
        <Text style={styles.checkLabel}>Manter Conectado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setTermos(!termos)}
      >
        <View style={[styles.checkbox, termos && styles.checkboxAtivo]} />
        <Text style={styles.checkLabel}>
          Clicando aqui você concorda com todos os nossos{" "}
          <Text style={styles.link}>Termos e Condições</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleCadastro}>
        <Text style={styles.buttonPrimaryText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  logo: { width: 160, height: 80, alignSelf: "center", marginBottom: 40 },
  label: { fontSize: 15, fontWeight: "600", color: "#111", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#111", marginBottom: 16 },
  datePicker: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16 },
  dateText: { fontSize: 15, color: "#111" },
  placeholder: { color: "#aaa" },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 16 },
  checkbox: { width: 18, height: 18, borderWidth: 1.5, borderColor: "#aaa", borderRadius: 4, marginTop: 2 },
  checkboxAtivo: { backgroundColor: "#F05A28", borderColor: "#F05A28" },
  checkLabel: { fontSize: 14, color: "#444", flex: 1 },
  link: { color: "#F05A28", fontWeight: "600" },
  buttonPrimary: { backgroundColor: "#F05A28", borderRadius: 999, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  buttonPrimaryText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});