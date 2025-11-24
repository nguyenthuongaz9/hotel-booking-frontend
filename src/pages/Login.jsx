"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";

const schemaLogin = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const { login, user } = useAuth();

  if (user && user?.role !== "ADMIN") {
    navigate("/");
  } if (user && user?.role === "ADMIN") {
    navigate("/owner");
  }

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await login(data.email, data.password);
      console.log(response);
    } catch (error) {
      console.error("login failed:", error);
      alert(`login: ${error.message}`);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[28rem] bg-gray-900/80 border border-gray-700 shadow-2xl rounded-2xl p-8 flex flex-col items-center backdrop-blur-sm"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Welcome Back 👋</h2>
        <p className="text-gray-400 text-sm mb-8">
          Sign in to continue to your account
        </p>

        <div className="w-full flex flex-col gap-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Login
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};
