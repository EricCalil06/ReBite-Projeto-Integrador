import { Tabs } from "expo-router";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

// Este componente substituirá a barra padrão do Expo
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        // Oculta abas com href: null (como o seu catalogo)
        if (options.href === null) return null;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.iconWrapper}>
            <Feather name={options.tabBarIcon} size={24} color={isFocused ? "#F05A28" : "#888"} />
            <Text style={{ color: isFocused ? "#F05A28" : "#888", fontSize: 12 }}>{options.title}</Text>
            {isFocused && <View style={styles.activeBar} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Início", tabBarIcon: "home" }} />
      <Tabs.Screen name="lojas" options={{ title: "Lojas", tabBarIcon: "grid" }} />
      <Tabs.Screen name="pedidos" options={{ title: "Pedidos", tabBarIcon: "shopping-bag" }} />
      <Tabs.Screen name="conta" options={{ title: "Conta", tabBarIcon: "user" }} />
      {/* As ocultas funcionam normalmente */}
      <Tabs.Screen name="catalogo" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { 
    flexDirection: 'row', backgroundColor: "#F5F0EB", height: 70, 
    borderRadius: 24, marginHorizontal: 12, marginBottom: 16, 
    position: "absolute", elevation: 10 
  },
  iconWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  activeBar: { width: 20, height: 3, backgroundColor: "#F05A28", marginTop: 4, borderRadius: 99 }
});