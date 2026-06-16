import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View, StyleSheet, Text, TouchableOpacity, Animated } from "react-native";

function CustomTabBar({ state, descriptors, navigation }) {
  const [barWidth, setBarWidth] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const allowedRoutes = ["index", "lojas", "pedidos", "caixa-entrada", "conta"];
  const visibleRoutes = state.routes.filter(route => allowedRoutes.includes(route.name));

  const activeIndex = visibleRoutes.findIndex(
    (r) => r.name === state.routes[state.index].name
  );

  const tabWidth = barWidth > 0 ? barWidth / visibleRoutes.length : 0;

  useEffect(() => {
    if (tabWidth > 0 && activeIndex !== -1) {
      Animated.spring(slideAnim, {
        toValue: activeIndex * tabWidth + tabWidth / 2 - 8,
        useNativeDriver: true,
        speed: 12,
        bounciness: 4,
      }).start();
    }
  }, [activeIndex, tabWidth]);

  return (
    <View
      style={styles.tabBar}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width - 32)}
    >
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.activeBar,
            { transform: [{ translateX: slideAnim }] },
          ]}
        />
      )}

      {visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = activeIndex === index;
        const color = isFocused ? "#F05A28" : "#888";

        const icons = {
          index: "home",
          lojas: "grid",
          pedidos: "shopping-bag",
          "caixa-entrada": "inbox",
          conta: "user",
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabItem}
            activeOpacity={1}
          >
            <View style={styles.iconWrapper}>
              <Feather name={icons[route.name] || "circle"} size={24} color={color} />
            </View>
            <Text style={[styles.tabLabel, { color }]}>{options.title}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function NavbarMobile() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
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
      <Tabs.Screen name="pedido/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F5F0EB",
    height: 80,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  activeBar: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 16,
    height: 4,
    backgroundColor: "#F05A28",
    borderRadius: 999,
  },
});