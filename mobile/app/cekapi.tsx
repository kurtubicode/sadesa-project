import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import axios from "axios";

const App = () => {
  const [pesan, setPesan] = useState("Loading...");

  useEffect(() => {
    // Gunakan IP Address komputermu yang dipakai di artisan serve
    axios
      .get("http://192.168.8.185:8000/api/tes-koneksi")
      .then((response) => {
        setPesan(response.data.pesan);
      })
      .catch((error) => {
        setPesan("Gagal terhubung ke Laravel");
        console.error(error);
      });
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>{pesan}</Text>
    </View>
  );
};

export default App;
