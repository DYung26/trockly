
import {
  View,
  TouchableOpacity,

} from 'react-native';
import ThemedText from './reusables/ThemedText';
import { useRouter } from 'expo-router';




const OnboardingScreen: React.FC = () => {
  const router = useRouter();


  

  const handleCreateAccount = () => {
   router.push('/auth/login');
  };





  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
       <TouchableOpacity
            
            onPress={handleCreateAccount}
          >
            <ThemedText variant='h2'>Create account</ThemedText>
          </TouchableOpacity>
  </View>
  );
};


export default OnboardingScreen;