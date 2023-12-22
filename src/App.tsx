import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Flex, Text, Button } from "@radix-ui/themes";
import "./App.css";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-center bg-green-300">
        Hello world Srikanth!
      </h1>
      <Flex direction="column" gap="2">
        <Text>Hello from Radix Themes :)</Text>
        <Button>Let's go</Button>
      </Flex>
    </>
  );
}

export default App;
