import { format } from 'date-fns/format';
import { useRouter } from 'expo-router';
import { 
  Mail, 
  Search, 
  Plus, 
  Inbox, 
  Send, 
  MessageSquare,
  ChevronRight,
  Circle
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import api from '../../../../lib/api';
import { useAuthStore } from '../../../../store/auth';

export default function MessagesScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMessages();
  };

  const inboxMessages = messages.filter((m: any) => m.receiver_id === user?.id);
  const sentMessages = messages.filter((m: any) => m.sender_id === user?.id);

  const currentMessages = activeTab === 'inbox' ? inboxMessages : sentMessages;

  const filteredMessages = currentMessages.filter((m: any) => 
    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.receiver && m.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderMessageItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity 
        onPress={() => router.push(`/(protected)/(staff)/messages/${item.thread_id}`)}
        className="bg-white dark:bg-slate-900 px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex-row items-center justify-between"
      >
        <View className="flex-1 mr-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {activeTab === 'sent' ? `To: ${item.receiver?.name || 'Unknown'}` : item.sender.name}
            </Text>
            <Text className="text-[10px] font-bold text-slate-300 dark:text-slate-600">
              {format(new Date(item.created_at), 'MMM dd, yyyy')}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            {activeTab === 'inbox' && !item.read_at && (
              <Circle size={8} color="#003399" fill="#003399" className="mr-2" />
            )}
            <Text 
              numberOfLines={1} 
              className={`text-sm ${!item.read_at && activeTab === 'inbox' ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-600 dark:text-slate-400'}`}
            >
              {item.subject}
            </Text>
          </View>
          
          <Text numberOfLines={1} className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {item.body}
          </Text>
        </View>
        <ChevronRight size={16} color={isDark ? '#334155' : '#cbd5e1'} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <View className="bg-white dark:bg-slate-900 px-8 pt-8 pb-6 border-b border-slate-100 dark:border-slate-800 rounded-b-[40px] shadow-sm z-10">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-2xl items-center justify-center mr-3 border border-blue-100 dark:border-blue-900/30">
              <MessageSquare size={20} color={isDark ? '#60a5fa' : '#003399'} />
            </View>
            <Text className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Messages</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(protected)/(staff)/messages/compose')}
            className="w-10 h-10 bg-[#003399] rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} color="white" strokeWidth={3} />
          </TouchableOpacity>
        </View>

        <View className="flex-row bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[20px] mb-6">
          <TouchableOpacity 
            onPress={() => setActiveTab('inbox')}
            className={`flex-1 py-3 rounded-[16px] flex-row items-center justify-center ${activeTab === 'inbox' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
          >
            <Inbox size={14} color={activeTab === 'inbox' ? (isDark ? '#60a5fa' : '#003399') : '#94a3b8'} className="mr-2" />
            <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'inbox' ? 'text-[#003399] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
              Inbox {inboxMessages.filter(m => !m.read_at).length > 0 && `(${inboxMessages.filter(m => !m.read_at).length})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('sent')}
            className={`flex-1 py-3 rounded-[16px] flex-row items-center justify-center ${activeTab === 'sent' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
          >
            <Send size={14} color={activeTab === 'sent' ? (isDark ? '#60a5fa' : '#003399') : '#94a3b8'} className="mr-2" />
            <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'sent' ? 'text-[#003399] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
              Sent
            </Text>
          </TouchableOpacity>
        </View>

        <View className="relative">
          <Search size={18} color="#94a3b8" className="absolute left-4 top-4 z-10" />
          <TextInput 
            placeholder="Search conversations..."
            placeholderTextColor="#94a3b8"
            className="bg-slate-50 dark:bg-slate-800 py-4 pl-12 pr-6 rounded-2xl border border-slate-100 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
          <ActivityIndicator color={isDark ? '#60a5fa' : '#003399'} />
        </View>
      ) : (
        <FlatList 
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={isDark ? '#fff' : '#003399'} />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-12">
              <View className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[32px] items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <Mail size={32} color={isDark ? '#334155' : '#cbd5e1'} />
              </View>
              <Text className="text-lg font-black text-slate-900 dark:text-white text-center">No messages yet</Text>
              <Text className="text-slate-400 dark:text-slate-500 text-center mt-2 font-medium leading-5">
                Your conversations with the administration and other staff members will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
