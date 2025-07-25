import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { AudioContent, DocumentContent, ImageContent, Message, MessageType, StickerContent, SystemContent, TextContent, VideoContent } from '../../types';
import { MessageAudio, MessageDocument, MessageImage, MessageSticker, MessageSystem, MessageText, MessageVideo } from './MessageTypes';

export type MessageRenderers = {
  [MessageType.TEXT]?: (content: TextContent) => React.ReactElement;
  [MessageType.SYSTEM]?: (content: SystemContent) => React.ReactElement;
  [MessageType.IMAGE]?: (content: ImageContent) => React.ReactElement;
  [MessageType.VIDEO]?: (content: VideoContent) => React.ReactElement;
  [MessageType.AUDIO]?: (content: AudioContent) => React.ReactElement;
  [MessageType.DOCUMENT]?: (content: DocumentContent) => React.ReactElement;
  [MessageType.STICKER]?: (content: StickerContent) => React.ReactElement;
};

const defaultMessageRenderers: MessageRenderers = {
  [MessageType.TEXT]:    (content) => <MessageText content={content} />, 
  [MessageType.SYSTEM]:  (content) => <MessageSystem content={content} />, 
  [MessageType.IMAGE]:   (content) => <MessageImage content={content} />, 
  [MessageType.VIDEO]:   (content) => <MessageVideo content={content} />, 
  [MessageType.AUDIO]:   (content) => <MessageAudio content={content} />, 
  [MessageType.DOCUMENT]:(content) => <MessageDocument content={content} />, 
  [MessageType.STICKER]:  (content) => <MessageSticker content={content} />,
};

interface MessageProps {
  message: Message;
  messageRenderers?: MessageRenderers;
}

const Message = ({ message, messageRenderers }: MessageProps) => {
  const renderers = { ...defaultMessageRenderers, ...messageRenderers };
  const render = renderers[message.type] as ((content: any) => React.ReactElement) | undefined;
  return render ? render(message.content) : <Text style={styles.messageText}>[Unsupported message type]</Text>;
};

const styles = StyleSheet.create({
  messageText: { 
    fontSize: 16 
  },
});

export default Message;
