import React from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import { Outskirts } from "../components/layout/public/Outskirts";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { Kingdom } from "../components/layout/private/Kingdom";
import { Palace } from "../components/layout/private/Palace";
import { Dungeons } from "../components/layout/private/Dungeons";
import { Dungeon } from "../components/layout/private/Dungeon";
import { Account } from "../components/layout/private/Account";
import { UserList } from "../components/user/UserList";
import { Error } from "../components/layout/public/Error";


export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Outskirts />}>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/kingdom" element={<Kingdom />}>
            <Route index element={<Palace />} />
            <Route path="palace" element={<Palace />} />
            <Route path="dungeons" element={<Dungeons />} />
            <Route path="dungeon" element={<Dungeon />} />
            <Route path="users" element={<UserList />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="*" element={<Error />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
