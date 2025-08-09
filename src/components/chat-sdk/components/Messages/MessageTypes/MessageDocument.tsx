import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DocumentContent } from '../../../types/types';



const MessageDocument = ({ content }: { content: DocumentContent }) => {
  const { extension, iconName, tileBg } = useMemo(() => {
    const nameFromUrl = (() => {
      try {
        const url = content?.document || '';
        const path = url.split('?')[0].split('#')[0];
        return path.substring(path.lastIndexOf('/') + 1);
      } catch {
        return '';
      }
    })();

    const fullName = content?.fileName || nameFromUrl || '';
    const rawExt = (fullName.split('.').pop() || '').toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp', 'tiff'].includes(rawExt);
    const isPdf = rawExt === 'pdf';
    const isExcel = ['xls', 'xlsx', 'csv', 'xlsm', 'xlsb'].includes(rawExt);
    const isPpt = ['ppt', 'pptx', 'pps', 'ppsx'].includes(rawExt);
    const isAudio = ['mp3', 'm4a', 'aac', 'wav', 'ogg', 'flac', 'amr', 'opus'].includes(rawExt);
    const isDoc = ['doc', 'docx'].includes(rawExt);
    const isZip = ['zip', 'rar', '7z', 'tar', 'gz'].includes(rawExt);
    const isVideo = ['mp4', 'mov', 'mkv', 'avi', 'webm'].includes(rawExt);

    let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'file-outline';
    let tileBg = '#7E57C2';

    if (isImage) { iconName = 'file-image'; tileBg = '#0B87FF'; }
    else if (isPdf) { iconName = 'file-pdf-box'; tileBg = '#E73B2E'; }
    else if (isExcel) { iconName = 'file-excel'; tileBg = '#21A366'; }
    else if (isPpt) { iconName = 'file-powerpoint'; tileBg = '#D24726'; }
    else if (isAudio) { iconName = 'file-music'; tileBg = '#7E57C2'; }
    else if (isVideo) { iconName = 'file-video'; tileBg = '#0B87FF'; }
    else if (isDoc) { iconName = 'file-word'; tileBg = '#2B579A'; }
    else if (isZip) { iconName = 'archive'; tileBg = '#F4B400'; }
    else { iconName = 'file-document-outline'; tileBg = '#607D8B'; }

    return { extension: (rawExt || 'file').toUpperCase(), iconName, tileBg };
  }, [content?.fileName, content?.document]);

  const handleOpen = () => {
    if (content?.document) {
      Linking.openURL(content.document);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.7} style={styles.row}>
        <View style={[styles.iconContainer, { backgroundColor: tileBg }]}>
          <MaterialCommunityIcons name={iconName} size={24} color="#fff" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.fileName} numberOfLines={2} ellipsizeMode="tail">
            {content.fileName}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.extBadge}>
              <Text style={styles.extText}>{extension}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={18} color="#999" />
          </View>
        </View>
      </TouchableOpacity>
      {content.caption ? (
        <Text style={styles.caption} numberOfLines={3}>
          {content.caption}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { minWidth: 220 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    paddingRight: 2,
  },
  fileName: {
    fontWeight: '600',
    fontSize: 15,
    color: '#111',
  },
  metaRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  extBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#EEF1F4',
  },
  extText: {
    fontSize: 11,
    color: '#667085',
    fontWeight: '600',
  },
  caption: {
    fontSize: 12,
    color: '#555',
    marginTop: 6,
  },
});

export default MessageDocument; 