// this is the component that renders the chat window and the input box
// the bot will reply with the same message back to the user

import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import MessageBubble from './MessageBubble';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, order: prevMessages.length + 1 },
    ]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botReply = {
        id: (Date.now() + 1).toString(),
        text: `Bot reply to: ${inputValue}`,
        sender: 'bot',
      };
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...botReply, order: prevMessages.length + 1 },
      ]);
    }, 1000);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    setOverId(event.over ? event.over.id : null);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    setOverId(null);
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = messages.findIndex((msg) => msg.id === active.id);
      const newIndex = messages.findIndex((msg) => msg.id === over.id);

      const newMessages = arrayMove(messages, oldIndex, newIndex);

      // Reorder the messages and update the order numbers
      const reorderedMessages = newMessages.map((msg, index) => ({
        ...msg,
        order: index + 1,
      }));

      setMessages(reorderedMessages);
    }
  };

  return (
    <div className="chat-box">
      <DndContext 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={messages}>
          <div className="messages-container">
            {messages.map((message) => (
              <SortableMessageBubble 
                key={message.id} 
                message={message} 
                isActive={message.id === activeId}
                isOver={message.id === overId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

const SortableMessageBubble = ({ message, isActive, isOver }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: message.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isActive ? 'red' : isOver ? 'blue' : 'transparent',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <MessageBubble message={message} />
    </div>
  );
};

export default ChatBox;
