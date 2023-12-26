import React, { useContext, useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Callout, TextField, Text } from "@radix-ui/themes";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerLoginSchema } from "../schemas/registerLoginSchema";
import { z } from "zod";
import ErrorMessage from "../components/ErrorMessage";
import { Spinner } from "../components/Spinner";
import { UserContext } from "../context/UserContext";

type RegisterLoginForm = z.infer<typeof registerLoginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterLoginForm>({
    resolver: zodResolver(registerLoginSchema),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { setUsername: setContextUsername } = userContext;

  const onSubmit = handleSubmit(async (data) => {
    console.log("data is: ", data);
    try {
      setIsSubmitting(true);
      const response = await axios.post("http://localhost:8080/login", data, {
        withCredentials: true,
      });
      console.log("response.data is: ", response.data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      setContextUsername(response.data.username);
      setIsSubmitting(false);
      reset();
      navigate("/dashboard");
    } catch (error) {
      setIsSubmitting(false);
      setContextUsername(null);
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setError(`User Not Found.\n Please Review Login Credentials`);
      } else if (axios.isAxiosError(error)) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError(`An unexpected error occurred: ${(error as Error).message}`);
      }
    }
  });
  return (
    <div>
      <Text
        as="div"
        className="text-2xl font-bold text-center text-gray-800 mb-6 pb-2"
      >
        Login
      </Text>
      {error && (
        <Callout.Root
          color="red"
          className="mx-auto mb-3"
          style={{ width: "70%" }}
        >
          <div className="flex justify-center">
            <Callout.Text
              className="text-sm text-gray-500 text-center"
              style={{ whiteSpace: "pre-line" }}
            >
              {error}
            </Callout.Text>
          </div>
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
          Login {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default Login;
