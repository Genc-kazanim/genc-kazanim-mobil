import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {useEffect, useState} from "react";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import '@walletconnect/react-native-compat';
import {useAccount, useContractWrite, useDisconnect, WagmiConfig} from 'wagmi';
import { useSignMessage } from 'wagmi'
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { FontAwesome5 } from '@expo/vector-icons';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi-react-native';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Apps2() {
    const { address, isConnected, isConnecting, isDisconnected } = useAccount();
    const navigation = useNavigation();

    useEffect(() => {
        // Navigate to the Login screen if the user is disconnected
        if (isDisconnected) {
            navigation.navigate('Login');
        }
    }, [isDisconnected, navigation]);


}

function LoginScreen({ navigation }) {
    const { open } = useWeb3Modal();

    return (
        <View style={styles.container}>
        </View>
    );
}
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const scheme = useColorScheme();


  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Roboto-Regular': Roboto_400Regular,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  return (

      <WagmiConfig config={wagmiConfig}>
        <NavigationContainer theme={scheme === 'light' ? DarkTheme : DefaultTheme}>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={
              {
                headerShown: false
              }
            }/>
            <Stack.Screen
                name="AccountStatus"
                component={AccountStatusHandler}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Dashboard"
                component={MyTabs}
                options={{
                  headerLeft: () => <CustomHeaderTitle />,
                  headerTitle: () => null,
                  headerRight: () => <W3mButton />,
                  headerStyle: {
                    backgroundColor: 'rgba(255, 255, 255, 0.0)', // semi-transparent white
                    // For Android, elevation: 0 removes the shadow
                    elevation: 0,
                    // For iOS, use the shadow properties
                    shadowOpacity: 0,
                  },

                }}
            />

          </Stack.Navigator>
          <Web3Modal />
          <Apps2/>
        </NavigationContainer>
        <StatusBar style={"light"} />
      </WagmiConfig>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
