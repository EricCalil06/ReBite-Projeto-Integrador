import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

export default function NavbarMobile() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#F05A28",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            index: "home",
            lojas: "grid",
            pedidos: "shopping-bag",
            "caixa-entrada": "inbox",
            conta: "user",
          };

          const iconName = icons[route.name] || "circle";

          return (
            <View style={styles.iconWrapper}>
              <Feather name={iconName} size={24} color={color} />
              {focused && <View style={styles.activeBar} />}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Início" }} />
      <Tabs.Screen name="lojas" options={{ title: "Lojas" }} />
      <Tabs.Screen name="pedidos" options={{ title: "Pedidos" }} />
      <Tabs.Screen name="caixa-entrada" options={{ title: "Recados" }} />
      <Tabs.Screen name="conta" options={{ title: "Conta" }} />

      <Tabs.Screen name="cadastro" options={{ href: null }} />
      <Tabs.Screen name="carrinho" options={{ href: null }} />
      <Tabs.Screen name="loja/[id]" options={{ href: null }} />
      <Tabs.Screen name="produto/[id]" options={{ href: null }} />
      <Tabs.Screen name="painel-loja" options={{ href: null }} />
      <Tabs.Screen name="catalogo" options={{ href: null }} />
      <Tabs.Screen name="cadastrar-loja-mobile" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: "#F5F0EB", borderTopWidth: 0, height: 70, borderRadius: 24, marginHorizontal: 12, marginBottom: 16, position: "absolute", left: 0, right: 0, elevation: 10, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, overflow: "hidden" },
  tabLabel: { fontSize: 12, fontWeight: "500", marginBottom: 6 },
  iconWrapper: { alignItems: "center", gap: 4, marginTop: 8 },
  activeBar: { width: 20, height: 3, backgroundColor: "#F05A28", borderRadius: 999 },
});