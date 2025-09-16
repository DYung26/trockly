import { 
  View, 
  StyleSheet
} from 'react-native';
import ThemedText from './reusables/ThemedText';


export default function SplashScreen() {
  
    return (
      <View style={styles.container}>
        <ThemedText variant='body' >Welcome to Truckly App</ThemedText>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center'
  },
  title: {
    
  }
})