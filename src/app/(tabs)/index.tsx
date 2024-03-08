import {
  Dimensions,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import useKeyboardVisible from "@hooks/useKeyboardVisible";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

export default function CountScreen() {
  const isKeyboardVisible = useKeyboardVisible();
  const [count, setCount] = useState<any>(0);

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem("number", value);
    } catch (e) {
      // saving error
    }
  };

  const listValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getData = async (): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem("number");
      if (value !== null) {
        // value previously stored
        return value;
      }
      return null;
    } catch (e) {
      // error reading value
      return null;
    }
  };

  function handleChange(event: string) {
    // update state with user TextInput
    console.log(event);
    if (event === "") {
      setCount("");
      return;
    }
    setCount(parseInt(event));
  }

  function handleKeyboardDismiss() {
    if (count === "") setCount(0);
    Keyboard.dismiss();
  }

  function increment(n: number = 0) {
    setCount((prevCount: number) => {
      storeData(`${prevCount + n}`);
      return prevCount + n;
    });
  }

  function decrement() {
    setCount((prevCount: number) => {
      storeData(`${prevCount - 1}`);
      return prevCount - 1;
    });
  }
  interface AdditionalAddButtonProps {
    number: number;
  }

  const AdditionalAddButton = (props: AdditionalAddButtonProps) => {
    const { number } = props;
    const addButtonStyles = StyleSheet.create({
      button: {
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden",
        flex: 1,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      text: {
        fontSize: 40,
        color: "grey",
        textAlign: "center",
      },
    });
    return (
      <Pressable
        style={addButtonStyles.button}
        onPress={() => increment(number)}
        disabled={isKeyboardVisible}
      >
        {number ? (
          <Text style={addButtonStyles.text}>{number}</Text>
        ) : (
          <FontAwesome name="plus" size={35} />
        )}
      </Pressable>
    );
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await getData();
      if (result === null) setCount(0);
      else setCount(parseInt(result));
    };
    fetch();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          onChangeText={handleChange}
          value={`${count}`}
        />
        <View style={styles.buttonGrp}>
          <Pressable
            style={buttonStyles.left}
            onPress={decrement}
            disabled={isKeyboardVisible}
          >
            <Text style={buttonStyles.text}>-</Text>
          </Pressable>
          <Pressable
            style={buttonStyles.right}
            onPress={() => increment(1)}
            disabled={isKeyboardVisible}
          >
            <Text style={buttonStyles.text}>+</Text>
          </Pressable>
        </View>
        <View style={styles.btnContainer}>
          <FlatList
            data={listValues}
            numColumns={5}
            contentContainerStyle={{ gap: 10 }}
            columnWrapperStyle={{ gap: 10, padding: 10 }}
            renderItem={({ item }) => {
              return <AdditionalAddButton number={item} />;
            }}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    backgroundColor: "white",
  },
  input: {
    textAlign: "center",
    width: "100%",
    fontSize: 80,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    overflow: "hidden",
    paddingVertical: 20,
    flex: 1,
  },
  buttonGrp: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
  btnContainer: {
    width: "100%",
  },
});

const buttonStyles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 40,
  },
  left: {
    ...styles.button,
    backgroundColor: "#ef5350",
  },
  right: {
    ...styles.button,
    backgroundColor: "#42a5f5",
  },
});
