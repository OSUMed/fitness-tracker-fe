import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
import RegisterComponent from "./Register";
import LoginComponent from "./Login";

const RegisterLogin: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md px-4 py-8">
        {" "}
        {/* Adjust max-width as needed */}
        <Tabs.Root
          defaultValue="login"
          className="flex flex-col shadow-lg w-full" // Add w-full here to take up the width of the parent
        >
          <Tabs.List
            className="flex w-full" // Add w-full to make the tabs fill the container width
            aria-label="Register or Login to your account"
          >
            <Tabs.Trigger
              value="login"
              className="flex-1 py-4 text-center text-lg font-medium text-blue-700 rounded-t-lg focus:outline-none focus:bg-blue-50"
            >
              Login
            </Tabs.Trigger>
            <Tabs.Trigger
              value="register"
              className="flex-1 py-4 text-center text-lg font-medium text-blue-700 rounded-t-lg focus:outline-none focus:bg-blue-50"
            >
              Register
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="login" className="p-4 bg-white rounded-b-lg">
            <LoginComponent />
          </Tabs.Content>
          <Tabs.Content value="register" className="p-4 bg-white rounded-b-lg">
            <RegisterComponent />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};

export default RegisterLogin;
