import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index"><Icon sf={{ default: "house", selected: "house.fill" }} /><Label>Home</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="chats"><Icon sf={{ default: "message", selected: "message.fill" }} /><Label>Chats</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="groups"><Icon sf={{ default: "person.2", selected: "person.2.fill" }} /><Label>Groups</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="public"><Icon sf={{ default: "globe" }} /><Label>Public</Label></NativeTabs.Trigger>
      <NativeTabs.Trigger name="account"><Icon sf={{ default: "person", selected: "person.fill" }} /><Label>Account</Label></NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.mutedForeground,
      headerShown: false,
      tabBarStyle: { position: "absolute", backgroundColor: isIOS ? "transparent" : colors.card, borderTopWidth: 1, borderTopColor: colors.border, elevation: 0, ...(isWeb ? { height: 84 } : {}) },
      tabBarBackground: () => isIOS ? <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} /> : isWeb ? <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]} /> : null,
      tabBarLabelStyle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3 },
    }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="house" tintColor={color} size={22} /> : <Feather name="home" size={21} color={color} /> }} />
      <Tabs.Screen name="chats" options={{ title: "Chats", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="message" tintColor={color} size={22} /> : <Feather name="message-circle" size={21} color={color} /> }} />
      <Tabs.Screen name="groups" options={{ title: "Groups", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="person.2" tintColor={color} size={22} /> : <Feather name="users" size={21} color={color} /> }} />
      <Tabs.Screen name="public" options={{ title: "Public", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="globe" tintColor={color} size={22} /> : <Feather name="globe" size={21} color={color} /> }} />
      <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: ({ color }) => isIOS ? <SymbolView name="person" tintColor={color} size={22} /> : <Feather name="user" size={21} color={color} /> }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}
