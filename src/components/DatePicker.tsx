import DateTimePicker from "@react-native-community/datetimepicker";
import { toLocalISODate } from "@utils/formatters";
import React, { useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

type DatePickerProps = {
  label: string;
  value: string; // yyyy-mm-dd
  onChange: (val: string) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      const formatted = toLocalISODate(selectedDate);
      onChange(formatted);
    }
  };

  if (Platform.OS === "web") {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleWebDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(toLocalISODate(e.target.value));
    };

    const openDatePicker = () => {
      inputRef.current?.showPicker?.(); // modern browsers
      inputRef.current?.click?.(); // fallback
    };

    return (
      <View style={{ marginTop: 8, marginBottom: 8 }}>
        <TouchableOpacity activeOpacity={0.8} onPress={openDatePicker}>
          <TextInput
            label={label}
            value={value}
            mode="outlined"
            placeholder="YYYY-MM-DD"
            editable={false}
            pointerEvents="none"
            right={<TextInput.Icon icon="calendar" onPress={openDatePicker} />}
          />
        </TouchableOpacity>
        {/* Hidden native date picker */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={handleWebDateChange}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 0,
            height: 0,
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ marginTop: 8 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <Button mode="outlined" onPress={() => setShow(true)}>
        {value || "Select Date"}
      </Button>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
};
