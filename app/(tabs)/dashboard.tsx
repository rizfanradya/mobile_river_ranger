import { Image, StyleSheet, Platform, View, Button, Text } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useAuth } from "@/context/authContext";
import { useNavigation } from "expo-router";
import { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase } from "@react-navigation/native";
import IsPageSecure from "@/components/isPageSecure";
import FormMasterData from "@/components/formMasterData";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { authState } = useAuth();

  useEffect(() => {
    if (!authState?.authenticated) {
      navigation.navigate("(signin)");
    }
  }, [authState]);

  const dataDummy = [
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nulla libero...",
      image: require("@/assets/images/partial-react-logo.png"),
      option: "Option 1",
    },
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nulla libero...",
      image: require("@/assets/images/partial-react-logo.png"),
      option: "Option 2",
    },
    {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nulla libero...",
      image: require("@/assets/images/partial-react-logo.png"),
      option: "Option 3",
    },
  ];

  return (
    <>
      {authState?.authenticated && authState.token ? (
        <>
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={
              <Image
                source={require("@/assets/images/partial-react-logo.png")}
                style={styles.reactLogo}
              />
            }
          >
            {dataDummy.map((data) => (
              <View style={styles.cardContainer}>
                <Image source={data.image} style={styles.cardImage} />
                <View style={styles.cardDescription}>
                  <Text
                    style={styles.cardTextDescription}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {data.description}
                  </Text>
                  <Text style={styles.cardOptionChip}>{data.option}</Text>
                </View>
              </View>
            ))}
          </ParallaxScrollView>
          <FormMasterData />
        </>
      ) : (
        <IsPageSecure />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  cardContainer: {
    backgroundColor: "#373A40",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardDescription: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  cardTextDescription: {
    color: "white",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  cardOptionChip: {
    color: "white",
    fontSize: 12,
    backgroundColor: "#FFAD60",
    borderRadius: 6,
    padding: 4,
    alignSelf: "flex-start",
  },
});
