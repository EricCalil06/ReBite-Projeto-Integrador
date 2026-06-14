import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from 'expo-router';

export default function CaixaEntrada() {
  const [convites, setConvites] = useState([]);
  const [atualizando, setAtualizando] = useState(false);
  const { user } = useAuth();

  const carregarConvites = async () => {
    if (!user || !user.id) return;

    try {
      const res = await fetch("http://10.0.2.2:5500/convites/meus-convites", {
        headers: { "x-usuario-id": user.id }
      });
      if (res.ok) {
        const data = await res.json();
        setConvites(data);
      }
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarConvites();
    }, [user])
  );

  const aoPuxarParaBaixo = async () => {
    setAtualizando(true);
    await carregarConvites();
    setAtualizando(false);
  };

  const responderConvite = async (id, resposta) => {
    try {
      const res = await fetch(`http://10.0.2.2:5500/convites/${id}/responder`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          "x-usuario-id": user.id 
        },
        body: JSON.stringify({ resposta })
      });
      
      if (res.ok) {
        Alert.alert("Sucesso", `Convite ${resposta} com sucesso!`);
        carregarConvites();
      } else {
        Alert.alert("Erro", "Não foi possível responder ao convite.");
      }
    } catch (error) {
      console.error("Erro ao responder convite:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.lojaNome}>{item.nomeLoja}</Text>
        <Text style={styles.mensagem}>Convidou você para fazer parte da equipe.</Text>
      </View>
      <View style={styles.botoes}>
        <TouchableOpacity 
          style={[styles.botao, styles.botaoRecusar]} 
          onPress={() => responderConvite(item._id, 'recusado')}
        >
          <Text style={styles.textoBotaoRecusar}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.botao, styles.botaoAceitar]} 
          onPress={() => responderConvite(item._id, 'aceito')}
        >
          <Text style={styles.textoBotaoAceitar}>Aceitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Caixa de Entrada</Text>
      
      <FlatList
        data={convites}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={convites.length === 0 ? styles.listaVazia : styles.lista}
        ListEmptyComponent={<Text style={styles.vazio}>Você não tem novos convites.</Text>}
        refreshControl={
          <RefreshControl 
            refreshing={atualizando} 
            onRefresh={aoPuxarParaBaixo} 
            colors={["#F05A28"]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#111", marginBottom: 20, marginTop: 40 },
  vazio: { fontSize: 16, color: "#666", textAlign: "center", marginTop: 50 },
  lista: { paddingBottom: 20 },
  listaVazia: { flexGrow: 1, justifyContent: 'flex-start' },
  card: { backgroundColor: "#f9f9f9", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
  info: { marginBottom: 16 },
  lojaNome: { fontSize: 18, fontWeight: "bold", color: "#F05A28", marginBottom: 4 },
  mensagem: { fontSize: 14, color: "#444" },
  botoes: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  botao: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, minWidth: 90, alignItems: "center" },
  botaoRecusar: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc" },
  textoBotaoRecusar: { color: "#666", fontWeight: "bold" },
  botaoAceitar: { backgroundColor: "#F05A28" },
  textoBotaoAceitar: { color: "#fff", fontWeight: "bold" },
});