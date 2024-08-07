import { FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";

export default function FormMasterData() {
  const [buttonAddData, setButtonAddData] = useState(false);
  const cameraAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cameraAnim, {
        toValue: buttonAddData ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: buttonAddData ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    const timeout = setTimeout(() => {
      if (buttonAddData) {
        setButtonAddData(false);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [buttonAddData]);

  const cameraTranslateY = cameraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -75],
  });

  const cameraTranslateX = cameraAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, -10],
  });

  const formTranslateX = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -75],
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => setButtonAddData(!buttonAddData)}
        style={{
          position: "absolute",
          bottom: 50,
          right: 30,
          width: 70,
          height: 70,
          zIndex: 999,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#2DCE89",
            borderRadius: 99999,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name={buttonAddData ? "xmark" : "plus"}
            style={{
              color: "rgb(1, 1, 1)",
              fontSize: 30,
            }}
          />
        </View>
      </TouchableOpacity>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 55,
          right: 35,
          transform: [
            { translateY: cameraTranslateY },
            { translateX: cameraTranslateX },
          ],
          opacity: cameraAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => alert("Kamera")}
          style={{
            width: 50,
            height: 50,
            display: buttonAddData ? "flex" : "none",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#11CDEF",
              borderRadius: 99999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6
              name="camera"
              style={{
                color: "rgb(1, 1, 1)",
                fontSize: 20,
              }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 55,
          right: 35,
          transform: [
            { translateY: formTranslateY },
            { translateX: formTranslateX },
          ],
          opacity: formAnim,
        }}
      >
        <TouchableOpacity
          onPress={() => alert("Form")}
          style={{
            width: 50,
            height: 50,
            display: buttonAddData ? "flex" : "none",
          }}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#11CDEF",
              borderRadius: 99999,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome6
              name="image"
              style={{
                color: "rgb(1, 1, 1)",
                fontSize: 20,
              }}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}
