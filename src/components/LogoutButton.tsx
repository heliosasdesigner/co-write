import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function LogoutButton() {
  const navigation = useNavigation();

  const onSignOut = () => {
    signOut(auth).catch((error) => console.log('Error Loggin out', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10,
          }}
          onPress={onSignOut}
        >
          <AntDesign
            name="logout"
            size={24}
            color={'blue'}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
}
