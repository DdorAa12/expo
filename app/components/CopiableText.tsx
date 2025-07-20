// CopiableText.tsx
import { Text, Pressable, Alert } from 'react-native';
import { useClipboard } from '../ClipboardContext';

type Props = {
  children: string;
};

export default function CopiableText({ children}: Props) {
  const { copy } = useClipboard();

  const handleCopy = () => {
    copy(children);
    Alert.alert('Copié dans le presse-papiers', `"${children}"`);
  };

  return (
    <Pressable onLongPress={handleCopy}>
      <Text>{children}</Text>
    </Pressable>
  );
}
