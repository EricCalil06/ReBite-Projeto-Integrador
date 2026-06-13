import { useEffect, useState, React } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext.jsx';

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    console.log("Token recuperado:", token);
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('http://10.0.2.2:5500/produtos/minha-loja', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setProdutos(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Catálogo</Text>
      
      <FlatList
        data={produtos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemProduto}>
            <Text>{item.nome}</Text>
            <View style={styles.acoes}>
              <Feather name="edit" size={20} />
              <Feather name="trash" size={20} color="red" />
            </View>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});