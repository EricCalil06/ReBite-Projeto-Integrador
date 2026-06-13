import { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, imageContainer } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function PaginaLoja() {
  const router = useRouter();
  const [loja, setLoja] = useState({ nome: '', descricao: '', endereco: '', totalPedidos: 0 });

  useEffect(() => {
    const carregarDadosLoja = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 
        
        if (!token) return;
        const response = await fetch('http://10.0.2.2:5500/estabelecimento/painel', {
          headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' }
        });
        const data = await response.json();
        setLoja(data);
      } catch (error) {
        console.error("Erro ao buscar dados da loja:", error);
      }
    };
    carregarDadosLoja();
  }, []);

return (
  <View style={styles.container}>
    {/* Cabeçalho com o botão Salvar */}
    <View style={styles.header}>
      <View>
        <Text style={styles.subtitulo}>Bem-vindo!</Text>
        <Text style={styles.titulo}>Sua Loja</Text>
      </View>
      <TouchableOpacity style={styles.btnSalvar}>
        <Text style={styles.txtSalvar}>SALVAR</Text>
      </TouchableOpacity>
    </View>

    {/* Card da Loja */}
    <View style={styles.card}>
      <Image source={require('../../assets/imagemLojas/PadariaSeuJorge.png')} style={styles.avatar} />
      <View style={styles.infoLoja}>
        <Text style={styles.labelBold}>Nome: Padaria do Seu Jorge</Text>
        <Text>Total de Pedidos: 95</Text>
      </View>
    </View>

    {/* Inputs */}
    <Text style={styles.inputLabel}>Nome</Text>
    <TextInput style={styles.input} placeholder="Digite o nome cadastrado" />
    
    <Text style={styles.inputLabel}>Descrição</Text>
    <TextInput style={[styles.input, styles.textArea]} placeholder="Coloque sua descrição" multiline />

    {/* Botões Finais */}
    <TouchableOpacity
      style={styles.btnAcao}
      onPress={() => router.push('/catalogo')}
    >
      <Text>Catálogo</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.btnAcao}><Text style={styles.txtBtn}>Sacolas Surpresas</Text></TouchableOpacity>
  </View>
);
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F9F7F6', 
    borderRadius: 20, 
    padding: 15 
  },
  avatar: { width: 80, height: 80, borderRadius: 20, marginRight: 15 },
  input: { 
    borderWidth: 1, 
    borderColor: '#E8E8E8', 
    borderRadius: 15, 
    padding: 15, 
    marginTop: 5, 
    marginBottom: 15 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  btnSalvar: { backgroundColor: '#F05A28', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  btnAcao: { backgroundColor: '#F05A28', padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 10 },
  txtBtn: { color: '#FFF', fontWeight: 'bold' },

  imageContainer: {
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
    width: 50,                // Defina um tamanho fixo
    height: 50,
    // borderRadius: 40,         // Se quiser redonda
    // overflow: 'hidden',       // Garante que a imagem respeite o arredondamento
    backgroundColor: '#eee'
  },
});