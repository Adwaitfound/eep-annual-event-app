import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import { Loading } from '../../components/common/Loading'
import { ChevronLeft, Send, Plus, Search } from '../../components/icons/SimpleIcons'
import {
  subscribeToUserThreads,
  subscribeToThreadMessages,
  sendThreadMessage,
  getOrCreateThread
} from '../../services/firebase/firestore'
import { requestNotificationPermission } from '../../services/firebase/messaging'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase/config'

export const ChatListScreen = () => {
  const user = useAuthStore((state) => state.user)
  const participants = useAppStore((state) => state.participants) || []
  const loadParticipants = useAppStore((state) => state.loadParticipants)
  
  const [threads, setThreads] = useState([])
  const [threadsWithInfo, setThreadsWithInfo] = useState([])
  const [selectedThreadId, setSelectedThreadId] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [participantSearch, setParticipantSearch] = useState('')
  const [creatingThread, setCreatingThread] = useState(false)
  const [notificationsRequested, setNotificationsRequested] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)

  useEffect(() => {
    loadParticipants()
  }, [loadParticipants])

  // Ask for notification permission once when entering chat
  useEffect(() => {
    if (notificationsRequested) return
    const notificationsSupported = typeof Notification !== 'undefined'
    if (!notificationsSupported) {
      setNotificationsRequested(true)
      return
    }
    requestNotificationPermission()
    setNotificationsRequested(true)
  }, [notificationsRequested])

  // Subscribe to all threads for current user
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      setThreads([])
      setThreadsWithInfo([])
      return
    }

    const unsubscribe = subscribeToUserThreads(user.uid, (threadList) => {
      setThreads(threadList)
      setLoading(false)
      
      // Auto-select first thread if available
      if (threadList.length > 0 && !selectedThreadId) {
        setSelectedThreadId(threadList[0].id)
      }
    })

    return () => unsubscribe()
  }, [user?.uid])

  // Fetch participant info for all threads
  useEffect(() => {
    const fetchThreadInfo = async () => {
      const infos = await Promise.all(
        threads.map(async (thread) => {
          if (!thread.otherUserId) return thread
          
          try {
            const userDoc = await getDoc(doc(db, 'users', thread.otherUserId))
            if (userDoc.exists()) {
              const userData = userDoc.data()
              return {
                ...thread,
                otherUserName: userData.displayName || userData.email || 'Unknown',
                otherUserCompany: userData.company || '',
                otherUserAvatar: userData.profileImage
              }
            }
          } catch (error) {
            console.error('Error fetching user info:', error)
          }
          
          return {
            ...thread,
            otherUserName: 'Unknown',
            otherUserCompany: '',
            otherUserAvatar: null
          }
        })
      )
      setThreadsWithInfo(infos)
    }

    if (threads.length > 0) {
      fetchThreadInfo()
    } else {
      setThreadsWithInfo([])
    }
  }, [threads])

  // Subscribe to messages in selected thread
  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([])
      return
    }

    const unsubscribe = subscribeToThreadMessages(selectedThreadId, (messageList) => {
      setMessages(messageList)
      // Auto-scroll to bottom
      setTimeout(() => {
        const messagesContainer = document.getElementById('messages-container')
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight
        }
      }, 0)
    })

    return () => unsubscribe()
  }, [selectedThreadId])

  // Notify on new incoming messages in the open thread
  useEffect(() => {
    if (!messages.length || !selectedThread) return
    
    const last = messages[messages.length - 1]
    if (!last || last.from === user?.uid) return

    if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && selectedThread?.otherUserName) {
      const title = selectedThread.otherUserName || 'New message'
      const body = last.text || 'New message'
      try {
        new Notification(title, { body })
      } catch (err) {
        console.warn('Notification error', err)
      }
    }
  }, [messages, selectedThread, user?.uid])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedThreadId || !user?.uid) return

    try {
      const selectedThread = threads.find(t => t.id === selectedThreadId)
      if (!selectedThread) return

      setSending(true)
      await sendThreadMessage(selectedThreadId, {
        from: user.uid,
        to: selectedThread.otherUserId,
        text: newMessage.trim(),
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleStartNewChat = async (participant) => {
    if (!user || participant.id === user.uid) return
    
    setCreatingThread(true)
    try {
      const threadId = await getOrCreateThread(user.uid, participant.id)
      
      // Create thread object with participant info immediately
      const newThread = {
        id: threadId,
        participants: [user.uid, participant.id],
        otherUserId: participant.id,
        otherUserName: participant.displayName || 'Unknown',
        otherUserCompany: participant.company || '',
        otherUserAvatar: participant.profileImage
      }
      
      // Add to threads list immediately for UX
      setThreads(prev => {
        const exists = prev.find(t => t.id === threadId)
        return exists ? prev : [newThread, ...prev]
      })
      
      setThreadsWithInfo(prev => {
        const exists = prev.find(t => t.id === threadId)
        return exists ? prev : [newThread, ...prev]
      })
      
      setSelectedThreadId(threadId)
      setShowNewChatModal(false)
      setParticipantSearch('')
    } catch (error) {
      console.error('Error creating thread:', error)
      alert('Failed to start conversation. Please try again.')
    } finally {
      setCreatingThread(false)
    }
  }

  const filteredParticipants = participants.filter((p) => {
    if (p.id === user?.uid) return false // Don't show yourself
    const existingThread = threads.find(t => t.otherUserId === p.id)
    if (existingThread) return false // Don't show if already have a conversation
    const term = participantSearch.toLowerCase().trim()
    if (!term) return true
    return (p.displayName || '').toLowerCase().includes(term) ||
           (p.company || '').toLowerCase().includes(term)
  })

  const selectedThread = threadsWithInfo.find(t => t.id === selectedThreadId)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--brand-bg)]">
        <Loading message="Loading conversations..." />
      </div>
    )
  }

  if (threadsWithInfo.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-center flex-col gap-4 bg-[var(--brand-surface)]">
        <div>
          <p className="text-[var(--brand-muted)] text-lg">No conversations yet</p>
          <p className="text-[var(--brand-secondary)] text-sm mt-2">Go to Networking to start chatting!</p>
        </div>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-primary)] hover:opacity-90 text-black rounded-full font-bold transition"
        >
          <Plus size={18} /> Start a conversation
        </button>
        
        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--brand-surface)] rounded-lg shadow-lg w-96 max-h-[80vh] flex flex-col">
              <div className="p-4 border-b border-[var(--brand-border)] flex items-center justify-between">
                <h3 className="font-bold text-lg text-[var(--brand-text)]">Start a conversation</h3>
                <button onClick={() => {
                  setShowNewChatModal(false)
                  setParticipantSearch('')
                }} className="text-[var(--brand-muted)] hover:text-[var(--brand-text)] text-2xl leading-none">
                  ×
                </button>
              </div>
              
              <div className="p-4 border-b border-[var(--brand-border)]">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-[var(--brand-muted)]" />
                  <input
                    type="text"
                    placeholder="Search participants..."
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {filteredParticipants.length === 0 ? (
                  <div className="p-4 text-center text-[var(--brand-muted)]">
                    {participantSearch ? 'No participants found' : 'No available participants'}
                  </div>
                ) : (
                  filteredParticipants.map((participant) => (
                    <button
                      key={participant.id}
                      onClick={() => handleStartNewChat(participant)}
                      disabled={creatingThread}
                      className="w-full px-4 py-3 text-left hover:bg-[var(--brand-primary)] hover:bg-opacity-20 border-b border-[var(--brand-border)] transition disabled:opacity-60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-purple-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                          {participant.displayName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--brand-text)] truncate">
                            {participant.displayName || 'Anonymous'}
                          </p>
                          {participant.company && (
                            <p className="text-sm text-[var(--brand-muted)] truncate">
                              {participant.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex min-h-[calc(100vh-80px)] bg-[var(--brand-bg)] pb-24 ${isMobile && selectedThreadId ? 'flex-col' : ''}`}>
      {/* Thread List Sidebar */}
      <div
        className={`${isMobile && selectedThreadId ? 'hidden' : 'flex'} ${!isMobile ? 'md:w-80' : 'w-full'} flex-col border-r border-[var(--brand-border)] overflow-hidden`}
      >
        <div className="p-4 border-b border-[var(--brand-border)] flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--brand-text)]">Messages</h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-2 hover:bg-[var(--brand-surface)] rounded-lg transition text-[var(--brand-muted)] hover:text-[var(--brand-text)]"
            title="Start a new conversation"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {threadsWithInfo.map((thread) => (
            <button
              key={thread.id}
              onClick={() => {
                setSelectedThreadId(thread.id)
                if (isMobile) setSelectedThreadId(thread.id)
              }}
              className={`w-full px-4 py-3 text-left border-b border-[var(--brand-border)] hover:bg-[var(--brand-surface)] transition ${
                selectedThreadId === thread.id ? 'bg-[var(--brand-primary)] bg-opacity-20 border-l-4 border-l-[var(--brand-primary)]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {thread.otherUserAvatar ? (
                  <img
                    src={thread.otherUserAvatar}
                    alt={thread.otherUserName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-purple-500 flex items-center justify-center flex-shrink-0 text-black font-bold">
                    {thread.otherUserName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--brand-text)] truncate">
                    {thread.otherUserName}
                  </h3>
                  {thread.otherUserCompany && (
                    <p className="text-sm text-[var(--brand-muted)] truncate">
                      {thread.otherUserCompany}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      {selectedThreadId && selectedThread && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'} flex flex-col overflow-hidden bg-[var(--brand-bg)]`}>
          {/* Header */}
          <div className="p-4 border-b border-[var(--brand-border)] flex items-center gap-3 bg-[var(--brand-surface)]">
            {isMobile && (
              <button
                onClick={() => setSelectedThreadId(null)}
                className="text-[var(--brand-muted)] hover:text-[var(--brand-text)]"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {selectedThread.otherUserAvatar ? (
              <img
                src={selectedThread.otherUserAvatar}
                alt={selectedThread.otherUserName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-purple-500 flex items-center justify-center text-black font-bold text-sm">
                {selectedThread.otherUserName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-[var(--brand-text)]">
                {selectedThread.otherUserName}
              </h3>
              {selectedThread.otherUserCompany && (
                <p className="text-xs text-[var(--brand-muted)]">
                  {selectedThread.otherUserCompany}
                </p>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            id="messages-container"
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--brand-bg)]"
          >
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-[var(--brand-muted)]">
                <p>No messages yet. Say hello!</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                if (!msg) return null
                const isOwn = msg.from && user?.uid && msg.from === user.uid
                return (
                  <div
                    key={`${msg.id || idx}-${msg.createdAt}`}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-[var(--brand-primary)] text-black rounded-br-none font-medium'
                          : 'bg-[var(--brand-surface)] text-[var(--brand-text)] border border-[var(--brand-border)] rounded-bl-none'
                      }`}
                    >
                      <p className="break-words">{msg.text || ''}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-black/70' : 'text-[var(--brand-muted)]'
                        }`}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt.toDate?.() || msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Compose */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-[var(--brand-border)] bg-[var(--brand-surface)] flex gap-2 sticky bottom-0 z-10"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-[var(--brand-primary)] hover:opacity-90 disabled:opacity-50 text-black px-4 py-2 rounded-lg transition flex items-center gap-2 font-bold"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && threadsWithInfo.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--brand-surface)] rounded-lg shadow-lg w-96 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-[var(--brand-border)] flex items-center justify-between">
              <h3 className="font-bold text-lg text-[var(--brand-text)]">Start a conversation</h3>
              <button onClick={() => {
                setShowNewChatModal(false)
                setParticipantSearch('')
              }} className="text-[var(--brand-muted)] hover:text-[var(--brand-text)] text-2xl leading-none">
                ×
              </button>
            </div>
            
            <div className="p-4 border-b border-[var(--brand-border)]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-[var(--brand-muted)]" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--brand-border)] rounded-lg bg-[var(--brand-bg)] text-[var(--brand-text)] placeholder-[var(--brand-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredParticipants.length === 0 ? (
                <div className="p-4 text-center text-[var(--brand-muted)]">
                  {participantSearch ? 'No participants found' : 'No available participants'}
                </div>
              ) : (
                filteredParticipants.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => handleStartNewChat(participant)}
                    disabled={creatingThread}
                    className="w-full px-4 py-3 text-left hover:bg-[var(--brand-primary)] hover:bg-opacity-20 border-b border-[var(--brand-border)] transition disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-purple-500 flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                        {participant.displayName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--brand-text)] truncate">
                          {participant.displayName || 'Anonymous'}
                        </p>
                        {participant.company && (
                          <p className="text-sm text-[var(--brand-muted)] truncate">
                            {participant.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
