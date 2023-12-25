import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";

interface RegisterForm {
  username: string;
  password: string;
}

const Register = () => {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [error, setError] = useState("");

  return (
    <div className="max-w-xl ">
      {error && (
        <Callout.Root color="red" className="m-5">
          <Callout.Text className="text-sm text-gray-500">{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="flex flex-col space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            const response = await axios.get("http://localhost:8080/free33");
            console.log(response);
          } catch (error) {
            setError(
              `There was a problem with the fetch operation:", ${error}`
            );
          }
        })}
      >
        <TextField.Root className="flex flex-col space-y-4 border-purple-800">
          <TextField.Input
            placeholder="Username"
            className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            {...register("username")}
          />
          <TextField.Input
            placeholder="Password"
            type="password"
            className="border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            {...register("password")}
          />
        </TextField.Root>
        <Button className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          Register User
        </Button>
      </form>
    </div>
  );
};

export default Register;
