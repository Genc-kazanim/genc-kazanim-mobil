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

function DashboardScreen({  navigation }) {
    const [userEvents, setUserEvents] = useState([]);
    const { address,provider } = useAccount();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [confettiTrigger, setConfettiTrigger] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { config } = usePrepareContractWrite({
        address: '0x588cFB4c05d9Aec892813cfc2988BB997851a517', // Contract address for claimToken
        abi: wagmigotchiABI, // Contract ABI
        functionName: 'claimToken',
        args: selectedEvent ? [selectedEvent.id] : [] // Dynamically use the selected event's ID
    });
    const {
        write,
        isSuccess,
        isError
    } = useContractWrite(config);

    useEffect(() => {
        const fetchUserEvents = async () => {
            if (!address) return;

            try {
                const response = await fetch(`http://172.19.89.184:8000/user_events/${address}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const events = await response.json();
                setUserEvents(events); // Store the events in the state
            } catch (error) {
                console.error('Error while fetching user events:', error);
            }
        };
        fetchUserEvents();
    }, [address]);

    console.log(userEvents);
    const groupedNfts = userEvents.reduce((acc, nft) => {
        // Group NFTs by certificationType or another property
        const key = nft.certification_type;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(nft);
        return acc;
    }, {});

    const [selectedNft, setSelectedNft] = useState(null);
    const [isNftViewVisible, setIsNftViewVisible] = useState(false);

    // NFT görüntüleme modalını açma fonksiyonu

    const showAlert = (item) => {
        Alert.alert("Uyarı", "Bu etkinlik hala devam ediyor.");
    };
    // NFT görüntüleme modalını kapatma fonksiyonu
    const closeNftView = () => {
        setIsNftViewVisible(false);
        setSelectedNft(null);
    };
    // Her grup için bir başlık ve altında NFT kartları göster
    const renderGroup = ({ item }) => (
        <View>
            <Text style={styles.texts}>{item.certification_type}</Text>
            <FlatList
                data={item.nfts}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2} // Her satırda 2 öğe göster
                contentContainerStyle={{ alignItems: 'center' }} // İçerikleri ortala
            />
        </View>
    );

    const handleMint = async (item) => {
        try {
            await write?.();
            setSelectedNft(item); // NFT detaylarını göstermek için seçilen NFT'yi ayarla
            // İşlem başarılıysa veya hatalıysa, bu durumu useEffect içinde kontrol edeceğiz.
        } catch (error) {
            console.error('Mint işlemi sırasında hata:', error);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            // Mintleme işlemi başarılı
            setConfettiTrigger(true); // Confetti animasyonunu başlat
            openNftView(selectedNft); // NFT detaylarını göster
        }

        if (isError) {
            // Mintleme işlemi sırasında hata meydana geldi
            console.error('Mint işlemi sırasında hata.');
            // Gerekirse burada kullanıcıya bir hata mesajı gösterebilirsiniz.
        }
    }, [isSuccess, isError]); // useEffect'in bağımlılıklarına isSuccess ve isError'i ekleyin

    // NFT kartını render etmek için kullanılan fonksiyon
    const renderItem = ({ item, index }) => {
        const isActive = item.is_active;
        const handleCardPress = () => {
            if (isActive) {
                showAlert();
            } else {
                handleMint(item);
            }
        };
        // Construct the image URL using the IPFS hash
        const eventImageUrl = `https://coffee-changing-camel-226.mypinata.cloud/ipfs/${item.image_ipfs_hash}?pinataGatewayToken=6yvbVp44rWl1Lht7h3_Od8MI4yM2LJJFYih2NZTc-jLlbmPsGo9o61W9KwHWcAPr`;
        console.log(eventImageUrl);
        return (

            <NftCard
                key={index}
                nftImageUrl={eventImageUrl}
                profileImageUrl={"https://uniwave-main.s3.eu-central-1.amazonaws.com/915D2D0A-8718-43AD-B5C0-EB618E074439.JPG"}
                name={item.event_name}
                creationDate={new Date(item.timestamp * 1000).toLocaleDateString()}
                verildigiyer={item.issued_place}
                certificationType={item.certification_type}
                onViewClick={() => handleCardPress()}
            />

        );
    };

    const openNftView = (item) => {
        setSelectedNft({
            nftImageUrl: `https://coffee-changing-camel-226.mypinata.cloud/ipfs/${item.image_ipfs_hash}?pinataGatewayToken=6yvbVp44rWl1Lht7h3_Od8MI4yM2LJJFYih2NZTc-jLlbmPsGo9o61W9KwHWcAPr`,
            name: item.event_name,
            creationDate: new Date(item.timestamp * 1000).toLocaleDateString(),
            certificationType: item.certification_type,
            issuedPlace: item.issued_place // Burası gerekiyorsa eklenebilir
        });
        setIsNftViewVisible(true);
    };

    return (
        <WagmiConfig config={wagmiConfig}>
            <View style={styles.containersmain}>
                <FlatList
                    data={Object.keys(groupedNfts).map(key => ({ certification_type: key, nfts: groupedNfts[key] }))}
                    renderItem={renderGroup}
                    keyExtractor={(item, index) => item.certification_type}
                />
                <Apps/>
                {selectedNft && (
                    <NftView
                        nftFullImageUrl={selectedNft.nftImageUrl}
                        name={selectedNft.name}
                        creationDate={selectedNft.creationDate}
                        certificationType={selectedNft.certificationType}
                        isVisible={isNftViewVisible}
                        onClose={closeNftView}
                    />
                )}
            </View>
        </WagmiConfig>
    );
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
