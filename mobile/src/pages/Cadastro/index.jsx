import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  LogBox,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from "../../context/AuthContext";
import { router } from "expo-router";
import CustomNotification, { Notification } from "../../components/customNotification.jsx";

LogBox.ignoreLogs(["DateTimePicker: `onChange` is deprecated"]);

const logo = require("../../../assets/images/logoReBiteH.png");

// ─── Máscaras ────────────────────────────────────────────────────────────────

function mascaraTelefone(valor) {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 10) {
    return nums
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return nums
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function mascaraCpfCnpj(valor) {
  const nums = valor.replace(/\D/g, "").slice(0, 14);
  if (nums.length <= 11) {
    return nums
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return nums
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

// ─── Componente ──────────────────────────────────────────────────────────────

export default function Cadastro() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState(null);
  const [mostrarData, setMostrarData] = useState(false);
  const [apelido, setApelido] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [manterConectado, setManterConectado] = useState(false);
  const [termos, setTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [erros, setErros] = useState({});
  const [notificacao, setNotificacao] = useState({ visivel: false, mensagem: "", tipo: "erro" });

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const exibirNotificacao = (mensagem, tipo = "erro") => {
    setNotificacao({ visivel: true, mensagem, tipo });
  };

  const handleConfirmarData = (data) => {
    setDataNascimento(data);
    setMostrarData(false);
    setErros((prev) => ({ ...prev, dataNascimento: null }));
  };

  const formatarData = (data) => {
    if (!data) return "Selecione sua data de nascimento";
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // ─── Validação local ───────────────────────────────────────────────────────

  const validar = () => {
    const novosErros = {};

    if (!apelido.trim()) novosErros.apelido = "Informe seu nome/apelido.";
    if (!email.trim()) novosErros.email = "Informe o e-mail.";
    if (!senha) novosErros.senha = "Crie uma senha.";
    if (!confirmarSenha) novosErros.confirmarSenha = "Confirme sua senha.";
    if (senha && confirmarSenha && senha !== confirmarSenha)
      novosErros.confirmarSenha = "As senhas não coincidem.";
    if (!telefone.trim()) novosErros.telefone = "Informe o telefone.";
    if (!cpfCnpj.trim()) novosErros.cpfCnpj = "Informe o CPF ou CNPJ.";
    if (!termos) novosErros.termos = "Aceite os termos para continuar.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // ─── Cadastro + login automático ───────────────────────────────────────────

  const handleCadastro = async () => {
    if (!validar()) return;

    setCarregando(true);
    try {
      // 1. Cadastrar
      const resCadastro = await fetch("http://10.0.2.2:5500/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: apelido.trim(),
          email: email.trim(),
          senha,
          telefone,
          cpfCnpj,
          dataNascimento: dataNascimento ? dataNascimento.toISOString() : undefined,
        }),
      });

      const dadosCadastro = await resCadastro.json();

      if (!resCadastro.ok) {
        Notification.show({ type: "error", text1: "Não foi possível cadastrar.", text2: dadosCadastro.error });
        return;
      }

      const resLogin = await fetch("http://10.0.2.2:5500/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha }),
      });

      const dadosLogin = await resLogin.json();

      if (!resLogin.ok) {
        Notification.show({ type: "success", text1: "Cadastro realizado!", text2: "Faça login para continuar." });
        router.replace("/login");
        return;
      }

      login(dadosLogin);
      router.replace("/");
    } catch (err) {
      Notification.show({ type: "error", text1: "Sem conexão", text2: "Verifique sua internet e tente novamente." });
    } finally {
      setCarregando(false);
    }
  };

  // ─── Campo helper ──────────────────────────────────────────────────────────

  const limparErro = (campo) =>
    setErros((prev) => ({ ...prev, [campo]: null }));

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <CustomNotification
        visivel={notificacao.visivel}
        mensagem={notificacao.mensagem}
        tipo={notificacao.tipo}
        onClose={() => setNotificacao((prev) => ({ ...prev, visivel: false }))}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        {/* Nome / Apelido */}
        <Text style={styles.label}>Como você deseja ser chamado?</Text>
        <TextInput
          style={[styles.input, erros.apelido && styles.inputErro]}
          placeholder="Insira seu nome ou apelido"
          placeholderTextColor="#aaa"
          value={apelido}
          onChangeText={(v) => { setApelido(v); limparErro("apelido"); }}
        />
        {erros.apelido && <Text style={styles.textoErro}>{erros.apelido}</Text>}

        {/* E-mail */}
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, erros.email && styles.inputErro]}
          placeholder="Coloque o e-mail de sua preferência"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(v) => { setEmail(v); limparErro("email"); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {erros.email && <Text style={styles.textoErro}>{erros.email}</Text>}

        {/* Telefone */}
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={[styles.input, erros.telefone && styles.inputErro]}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#aaa"
          value={telefone}
          onChangeText={(v) => { setTelefone(mascaraTelefone(v)); limparErro("telefone"); }}
          keyboardType="phone-pad"
        />
        {erros.telefone && <Text style={styles.textoErro}>{erros.telefone}</Text>}

        {/* CPF / CNPJ */}
        <Text style={styles.label}>CPF ou CNPJ</Text>
        <TextInput
          style={[styles.input, erros.cpfCnpj && styles.inputErro]}
          placeholder="000.000.000-00"
          placeholderTextColor="#aaa"
          value={cpfCnpj}
          onChangeText={(v) => { setCpfCnpj(mascaraCpfCnpj(v)); limparErro("cpfCnpj"); }}
          keyboardType="numeric"
        />
        {erros.cpfCnpj && <Text style={styles.textoErro}>{erros.cpfCnpj}</Text>}

        {/* Senha */}
        <Text style={styles.label}>Crie sua senha</Text>
        <TextInput
          style={[styles.input, erros.senha && styles.inputErro]}
          placeholder="Crie uma senha"
          placeholderTextColor="#aaa"
          value={senha}
          onChangeText={(v) => { setSenha(v); limparErro("senha"); }}
          secureTextEntry
        />
        {erros.senha && <Text style={styles.textoErro}>{erros.senha}</Text>}

        {/* Confirmar senha */}
        <Text style={styles.label}>Confirme sua senha</Text>
        <TextInput
          style={[styles.input, erros.confirmarSenha && styles.inputErro]}
          placeholder="Confirme sua senha"
          placeholderTextColor="#aaa"
          value={confirmarSenha}
          onChangeText={(v) => { setConfirmarSenha(v); limparErro("confirmarSenha"); }}
          secureTextEntry
        />
        {erros.confirmarSenha && <Text style={styles.textoErro}>{erros.confirmarSenha}</Text>}

        {/* Data de nascimento */}
        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity
          style={[styles.datePicker, erros.dataNascimento && styles.inputErro]}
          onPress={() => setMostrarData(true)}
        >
          <Text style={[styles.dateText, !dataNascimento && styles.placeholder]}>
            {formatarData(dataNascimento)}
          </Text>
        </TouchableOpacity>
        {erros.dataNascimento && (
          <Text style={styles.textoErro}>{erros.dataNascimento}</Text>
        )}

        <DateTimePickerModal
          isVisible={mostrarData}
          mode="date"
          onConfirm={handleConfirmarData}
          onCancel={() => setMostrarData(false)}
          maximumDate={new Date()}
          locale="pt-BR"
        />

        {/* Manter conectado */}
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setManterConectado(!manterConectado)}
        >
          <View style={[styles.checkbox, manterConectado && styles.checkboxAtivo]} />
          <Text style={styles.checkLabel}>Manter Conectado</Text>
        </TouchableOpacity>

        {/* Termos */}
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => { setTermos(!termos); limparErro("termos"); }}
        >
          <View style={[
            styles.checkbox,
            termos && styles.checkboxAtivo,
            erros.termos && styles.checkboxErro,
          ]} />
          <Text style={styles.checkLabel}>
            Clicando aqui você concorda com todos os nossos{" "}
            <Text style={styles.link}>Termos e Condições</Text>
          </Text>
        </TouchableOpacity>
        {erros.termos && <Text style={styles.textoErro}>{erros.termos}</Text>}

        {/* Botão */}
        <TouchableOpacity
          style={[styles.buttonPrimary, carregando && styles.buttonDesabilitado]}
          onPress={handleCadastro}
          disabled={carregando}
        >
          <Text style={styles.buttonPrimaryText}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logo: { width: 160, height: 80, alignSelf: "center", marginBottom: 40 },
  label: { fontSize: 15, fontWeight: "600", color: "#111", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
    marginBottom: 4,
  },
  inputErro: {
    borderColor: "#EF4444",
    marginBottom: 2,
  },
  textoErro: {
    fontSize: 12,
    color: "#EF4444",
    marginBottom: 12,
    marginLeft: 4,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 4,
  },
  dateText: { fontSize: 15, color: "#111" },
  placeholder: { color: "#aaa" },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: "#aaa",
    borderRadius: 4,
    marginTop: 2,
  },
  checkboxAtivo: { backgroundColor: "#F05A28", borderColor: "#F05A28" },
  checkboxErro: { borderColor: "#EF4444" },
  checkLabel: { fontSize: 14, color: "#444", flex: 1 },
  link: { color: "#F05A28", fontWeight: "600" },
  buttonPrimary: {
    backgroundColor: "#F05A28",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDesabilitado: { opacity: 0.6 },
  buttonPrimaryText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
