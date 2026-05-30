import React from "react";
import { View, Text, FlatList, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useChat } from "@/context/ChatContext";
import { ChatListItem } from "@/components/ChatListItem";
import { useColors } from "@/hooks/useColors";

export default function ChatsScreen() {
  const { chats } = useChat();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const sortedChats = [...chats].sort((a, b) => b.lastMessageTime - a.lastMessageTime);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, paddingTop: Platform.OS === "web" ? 67 : insets.top, backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>MESSAGES</Text>
        <View style={[styles.headerBadge, { backgroundColor: "rgba(168,85,247,0.12)", borderColor: colors.border }]}>
          <Feather name="lock" size={10} color={colors.primary} />
          <Text style={[styles.headerBadgeText, { color: colors.primary }]}>E2E ENCRYPTED</Text>
        </View>
      </View>
      <FlatList
        data={sortedChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem name={item.contactName} lastMessage={item.lastMessage} lastMessageTime={item.lastMessageTime} unreadCount={item.unreadCount} status={item.contactStatus} onPress={() => router.push({ pathname: "/chat/[id]", params: { id: item.id, name: item.contactName } })} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="message-circle" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No active vectors</Text>
          </View>
        }
        contentContainerStyle={sortedChats.length === 0 ? { flex: 1 } : {}}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  headerTitle: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  headerBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, marginBottom: 2 },
  headerBadgeText: { fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, paddingBottom: 60 },
  emptyText: { fontSize: 16, fontWeight: "600", marginTop: 8 },
});
