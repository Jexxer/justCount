import {
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";

import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import useKeyboardVisible from "@hooks/useKeyboardVisible";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

export default function CountScreen() {
  const isKeyboardVisible = useKeyboardVisible();
  const [count, setCount] = useState<any>(0);
  const [values, setValues] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInputValue, setModalInputValue] = useState<any>(0);
  const [targetIndex, setTargetIndex] = useState<number>(0);

  const getValues = async () => {
    const temp = values;
    try {
      for (let i = 0; i < 10; i++) {
        const res = await AsyncStorage.getItem(`value-${i}`);
        if (res !== null) temp[i] = parseInt(res);
      }
      setValues(temp);
    } catch (e) {
      console.log("error getting values", e);
    }
  };

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem("number", value);
    } catch (e) {
      // saving error
    }
  };

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
    index: number;
  }

  const AdditionalAddButton = (props: AdditionalAddButtonProps) => {
    const { number, index } = props;
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

    const handlePress = () => {
      if (number === 0) {
        setTargetIndex(index);
        setModalVisible(true);
      } else increment(number);
    };
    return (
      <>
        <Pressable
          style={addButtonStyles.button}
          onPress={handlePress}
          disabled={isKeyboardVisible}
          onLongPress={() => {
            setTargetIndex(index);
            setModalVisible(true);
          }}
        >
          {number ? (
            <Text style={addButtonStyles.text}>{number}</Text>
          ) : (
            <FontAwesome name="plus" size={35} color="grey" />
          )}
        </Pressable>
      </>
    );
  };

  useEffect(() => {
    const fetch = async () => {
      const result = await getData();
      if (result === null) setCount(0);
      else setCount(parseInt(result));
    };
    fetch();
    getValues();
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
            <FontAwesome name="minus" size={35} color="black" />
          </Pressable>
          <Pressable
            style={buttonStyles.right}
            onPress={() => increment(1)}
            disabled={isKeyboardVisible}
          >
            <FontAwesome name="plus" size={35} color="black" />
          </Pressable>
        </View>
        <View style={styles.btnContainer}>
          <FlatList
            data={values}
            numColumns={5}
            columnWrapperStyle={{ gap: 10, padding: 10 }}
            renderItem={({ item, index }) => {
              return <AdditionalAddButton number={item} index={index} />;
            }}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          // onRequestClose={() => {
          //   Alert.alert("Modal has been closed.");
          //   setModalVisible(!modalVisible);
          // }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <Text style={modalStyles.modalText}>Edit number</Text>
              <TextInput
                style={modalStyles.input}
                keyboardType="numeric"
                value={`${modalInputValue}`}
                onChange={(
                  e: NativeSyntheticEvent<TextInputChangeEventData>,
                ): void => {
                  if (e.nativeEvent.text === "") setModalInputValue("");
                  else setModalInputValue(parseInt(e.nativeEvent.text));
                }}
              />
              <Pressable
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() => {
                  setValues((prevValues) => {
                    const newValues = [...prevValues];
                    newValues[targetIndex] = modalInputValue;
                    return newValues;
                  });
                  // store value
                  AsyncStorage.setItem(
                    `value-${targetIndex}`,
                    `${modalInputValue}`,
                  );

                  Keyboard.dismiss();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={modalStyles.textStyle}>Save</Text>
              </Pressable>
              <Pressable
                style={[modalStyles.button, modalStyles.buttonClose]}
                onPress={() => {
                  Keyboard.dismiss();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={modalStyles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
    alignItems: "center",
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

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "90%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
});
