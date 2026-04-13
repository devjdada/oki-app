import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { 
  ChevronLeft, 
  Send, 
  Globe, 
  User,
  Clock,
  MoreVertical
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { format } from 'date-fns/format';

import api from '../../../../lib/api';
import { useAuthStore } from '../../../../store/auth';

export default function MessageDetailScreen() {
  const router = useRouter();
  const { id: threadId } = useLocalSearchParams();
  const user = useAuthStore((state) => state.user);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [thread, setThread] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const fetchThread = async () => {
    try {
      const response = await api.get(`/messages/thread/${threadId}`);
      setThread(response.data.data);
      
      // Mark unseen messages as read
      const unreadMessages = response.data.data.filter(
        (m: any) => m.receiver_id === user?.id && !m.read_at
      );
      
      for (const m of unreadMessages) {
        await api.post(`/messages/${m.id}/read`);
      }
    } catch (error) {
      console.error('Error fetching thread:', error);
      Alert.alert('Error', 'Failed to load message conversation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [threadId]);

  useEffect(() => {
    // Scroll to bottom when thread updates
    if (thread.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 500);
    }
  }, [thread]);

  const handleSendReply = async () => {
    if (!replyBody.trim()) return;

    try {
      setSending(true);
      const parentMessage = thread[thread.length - 1]; // Reply to the last message
      
      await api.post('/messages', {
        target_type: 'reply',
        parent_id: parentMessage.id,
        thread_id: threadId,
        subject: `Re: ${parentMessage.subject}`,
        body: replyBody,
        type: 'message',
        is_public: isPublic
      });

      setReplyBody('');
      fetchThread(); // Refresh thread
    } catch (error) {
      console.error('Error sending reply:', error);
      Alert.alert('Error', 'Failed to send reply.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#003399" />
      </View>
    );
  }

  const mainMessage = thread[0];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-slate-100 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-xl items-center justify-center mr-3 bg-slate-50"
            >
              <ChevronLeft size={20} color="#003399" />
            </TouchableOpacity>
            <View>
              <Text className="text-sm font-black text-slate-900 tracking-tight" numberOfLines={1}>
                {mainMessage?.subject}
              </Text>
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {thread.length} Messages in thread
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-xl items-center justify-center bg-slate-50">
            <MoreVertical size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 bg-slate-50/50 px-6 pt-6"
          showsVerticalScrollIndicator={false}
        >
          {thread.map((msg: any, index: number) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <Animated.View 
                key={msg.id}
                entering={SlideInRight.delay(index * 100)}
                className={`mb-8 ${isMe ? 'items-end' : 'items-start'}`}
              >
                <View className="flex-row items-center mb-2 px-1">
                  {!isMe && (
                    <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mr-2">
                      <User size={12} color="#003399" />
                    </View>
                  )}
                  <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {isMe ? 'You' : msg.sender.name} • {format(new Date(msg.created_at), 'hh:mm aa')}
                  </Text>
                </View>

                <View className={`max-w-[85%] p-5 rounded-[24px] shadow-sm ${
                  isMe 
                    ? 'bg-[#003399] rounded-tr-none' 
                    : 'bg-white rounded-tl-none border border-slate-100'
                }`}>
                  <Text className={`text-sm leading-6 font-medium ${isMe ? 'text-white' : 'text-slate-800'}`}>
                    {msg.body}
                  </Text>
                  
                  {msg.is_public && (
                    <View className={`mt-3 pt-3 flex-row items-center border-t ${isMe ? 'border-white/20' : 'border-slate-50'}`}>
                      <Globe size={10} color={isMe ? 'rgba(255,255,255,0.7)' : '#94a3b8'} className="mr-2" />
                      <Text className={`text-[8px] font-black uppercase tracking-widest ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        Public Reply
                      </Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          })}
          <View className="h-10" />
        </ScrollView>

        {/* Footer: Reply Box */}
        <View className="bg-white px-6 pt-4 pb-8 border-t border-slate-100 shadow-2xl">
          <View className="flex-row items-center justify-between mb-3 px-2">
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</Text>
            <View className="flex-row bg-slate-50 p-1 rounded-full border border-slate-100">
              <TouchableOpacity 
                onPress={() => setIsPublic(false)}
                className={`px-4 py-1.5 rounded-full flex-row items-center ${!isPublic ? 'bg-white shadow-sm border border-slate-100' : ''}`}
              >
                <User size={10} color={!isPublic ? '#003399' : '#94a3b8'} className="mr-1.5" />
                <Text className={`text-[9px] font-black uppercase tracking-widest ${!isPublic ? 'text-[#003399]' : 'text-slate-400'}`}>Private</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIsPublic(true)}
                className={`px-4 py-1.5 rounded-full flex-row items-center ${isPublic ? 'bg-white shadow-sm border border-slate-100' : ''}`}
              >
                <Globe size={10} color={isPublic ? '#003399' : '#94a3b8'} className="mr-1.5" />
                <Text className={`text-[9px] font-black uppercase tracking-widest ${isPublic ? 'text-[#003399]' : 'text-slate-400'}`}>Everyone</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-end bg-slate-50 rounded-[28px] p-2 border border-slate-100">
            <TextInput 
              placeholder="Type your reply..."
              placeholderTextColor="#94a3b8"
              multiline
              className="flex-1 px-4 py-3 text-sm font-bold text-slate-900 max-h-32"
              value={replyBody}
              onChangeText={setReplyBody}
            />
            <TouchableOpacity 
              onPress={handleSendReply}
              disabled={sending || !replyBody.trim()}
              className={`w-12 h-12 rounded-[22px] items-center justify-center ${sending || !replyBody.trim() ? 'bg-slate-200' : 'bg-[#003399]'}`}
            >
              {sending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Send size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
