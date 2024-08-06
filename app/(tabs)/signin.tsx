import { FontAwesome } from "@expo/vector-icons";
import { Block, Button, Input, Text } from "galio-framework";
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  View,
} from "react-native";

export default function SignIn() {
  const { width, height } = Dimensions.get("screen");

  return (
    <Block flex middle>
      <ImageBackground
        source={require("../../assets/images/register-bg.png")}
        style={{ width, height }}
      >
        <Block flex middle>
          <View
            style={{
              backgroundColor: "#F4F5F7",
              borderRadius: 14,
              shadowColor: "#000000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 8,
              shadowOpacity: 0.1,
              paddingHorizontal: 20,
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Block flex={0.3} middle style={{ marginVertical: 20 }}>
              <Text color="#8898AA" size={30}>
                Sign In
              </Text>
            </Block>

            <KeyboardAvoidingView
              style={{ flex: 1, width: width * 0.8, gap: 14 }}
              behavior="padding"
              enabled
            >
              <Input
                borderless
                placeholder="Username"
                iconContent={
                  <FontAwesome
                    name="user"
                    size={16}
                    color={"#172B4D"}
                    style={{ marginRight: 12 }}
                  />
                }
              />

              <Input
                password
                borderless
                placeholder="Password"
                iconContent={
                  <FontAwesome
                    name="lock"
                    size={16}
                    color={"#172B4D"}
                    style={{ marginRight: 12 }}
                  />
                }
              />

              <Button
                color="#2DCE89"
                style={{
                  width: width * 0.5,
                  marginTop: 45,
                  margin: "auto",
                }}
              >
                <Text bold size={14} color="#ffffff">
                  SIGN IN
                </Text>
              </Button>
            </KeyboardAvoidingView>
          </View>
        </Block>
      </ImageBackground>
    </Block>
  );
}
