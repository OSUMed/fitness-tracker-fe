import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { Button, Callout, TextField, Text } from "@radix-ui/themes";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerLoginSchema } from "../schemas/registerLoginSchema";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";
import { Spinner } from "../components/Spinner";

type RegisterLoginForm = z.infer<typeof registerLoginSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterLoginForm>({
    resolver: zodResolver(registerLoginSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = handleSubmit(async (data) => {
    console.log("data is: ", data);
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        "http://localhost:8080/register",
        data,
        { withCredentials: true }
      );
      console.log(response.data);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      setError(`There was a problem with the fetch operation:", ${error}`);
    }
  });
  return (
    <div>
      <Text
        as="div"
        className="text-2xl font-bold text-center text-gray-800 mb-4 pb-2"
      >
        Register
      </Text>
      {error && (
        <Callout.Root color="red" className="m-5">
          <Callout.Text className="text-sm text-gray-500">{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="flex flex-col space-y-3" onSubmit={onSubmit}>
        <TextField.Root className="flex flex-col  p-2 mt-1">
          <TextField.Input placeholder="Username" {...register("username")} />
        </TextField.Root>
        <ErrorMessage>{errors.username?.message}</ErrorMessage>
        <TextField.Root className="flex flex-col  p-2 mt-1">
          <TextField.Input
            placeholder="Password"
            type="password"
            {...register("password")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.password?.message}</ErrorMessage>
        <Button
          disabled={isSubmitting}
          className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Register User {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default Register;
